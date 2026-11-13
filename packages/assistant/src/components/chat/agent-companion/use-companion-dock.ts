"use client";

import { type MouseEvent, type PointerEvent, useEffect, useRef, useState } from "react";

import { accountPreferenceSession, companionStorage } from "@shared/runtime/storage";

type Layout = NonNullable<ReturnType<typeof companionStorage.readLayout>>;
type Gesture = {
  pointer: number;
  x: number;
  y: number;
  bounds: DOMRect;
  size: number;
  resize: boolean;
};

const margin = 16;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const clampSize = (size: number) => clamp(Math.round(size), 48, 208);

export function useCompanionDock(agent: string, floating: boolean) {
  const [layout, setLayout] = useState<Layout>();
  const [pending, setPending] = useState<Layout>();
  const container = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture>(null);
  const didDrag = useRef(false);

  useEffect(() => {
    if (!floating) return;
    const refresh = () =>
      setLayout(
        companionStorage.readLayout(agent) ?? {
          x: companionStorage.readSide(agent) === "right" ? 1 : 0,
          y: 1,
        },
      );
    refresh();
    return accountPreferenceSession.subscribe(refresh);
  }, [agent, floating]);

  function save(next: Layout) {
    setLayout(next);
    companionStorage.writeLayout(agent, next);
  }

  const current = pending ?? layout ?? { x: 0, y: 1 };
  const side = current.x < 0.5 ? "left" : "right";

  function start(event: PointerEvent<HTMLElement>, resize = false) {
    if (!floating || !event.isPrimary || event.button !== 0 || gesture.current) return;
    const bounds = container.current?.getBoundingClientRect();
    const size = container.current?.querySelector(".agent-launcher")?.getBoundingClientRect().width;
    if (!bounds || !size) return;
    didDrag.current = false;
    gesture.current = {
      bounds,
      pointer: event.pointerId,
      resize,
      size,
      x: event.clientX,
      y: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function nextLayout(event: PointerEvent<HTMLElement>, active: Gesture): Layout {
    const dx = event.clientX - active.x;
    const dy = event.clientY - active.y;
    if (active.resize) return { ...(layout ?? current), size: clampSize(active.size - dy) };
    const viewport = document.documentElement;
    return {
      ...layout,
      x: clamp(
        (active.bounds.left + dx - margin) /
          Math.max(1, viewport.clientWidth - active.bounds.width - 2 * margin),
        0,
        1,
      ),
      y: clamp(
        (active.bounds.top + dy - margin) /
          Math.max(1, viewport.clientHeight - active.bounds.height - 2 * margin),
        0,
        1,
      ),
    };
  }

  function move(event: PointerEvent<HTMLElement>) {
    const active = gesture.current;
    if (!active || active.pointer !== event.pointerId) return;
    if (!didDrag.current && Math.hypot(event.clientX - active.x, event.clientY - active.y) < 6)
      return;
    didDrag.current = true;
    setPending(nextLayout(event, active));
  }

  function cancel() {
    gesture.current = null;
    setPending(undefined);
  }

  function finish(event: PointerEvent<HTMLElement>) {
    const active = gesture.current;
    if (!active || active.pointer !== event.pointerId) return;
    if (didDrag.current) save(nextLayout(event, active));
    cancel();
  }

  function suppressDragClick(event: MouseEvent<HTMLElement>) {
    if (!didDrag.current || event.detail === 0) return false;
    event.preventDefault();
    didDrag.current = false;
    return true;
  }

  function resizeBy(delta: number) {
    const size = container.current?.querySelector(".agent-launcher")?.getBoundingClientRect().width;
    if (size) save({ ...current, size: clampSize(size + delta) });
  }

  return {
    cancel,
    container,
    current,
    dock: (next: "left" | "right") => save({ ...current, x: next === "left" ? 0 : 1 }),
    finish,
    move,
    moving: Boolean(pending),
    resizeBy,
    side,
    start,
    suppressDragClick,
  };
}
