"use client";

import { type MouseEvent, type PointerEvent, useEffect, useRef, useState } from "react";

type Side = "left" | "right";
type Drag = { pointerId: number; startX: number; left: number; width: number };

export function useCompanionDock(agent: string, floating: boolean) {
  const storageKey = `agent-companion:${agent}:side`;
  const [side, setSide] = useState<Side>("left");
  const [offset, setOffset] = useState<number>();
  const drag = useRef<Drag>(null);
  const didDrag = useRef(false);

  useEffect(() => {
    if (!floating) return;
    try {
      setSide(localStorage.getItem(storageKey) === "right" ? "right" : "left");
    } catch {
      // The companion can still move when storage is unavailable.
    }
  }, [floating, storageKey]);

  function dock(next: Side) {
    setSide(next);
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // Keep the selected side for this visit.
    }
  }

  function start(event: PointerEvent<HTMLButtonElement>) {
    if (!floating || !event.isPrimary || event.button !== 0) return;
    const { left, width } = event.currentTarget.getBoundingClientRect();
    didDrag.current = false;
    drag.current = { left, pointerId: event.pointerId, startX: event.clientX, width };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const distance = event.clientX - current.startX;
    if (!didDrag.current && Math.abs(distance) < 6) return;
    didDrag.current = true;
    const right = document.documentElement.clientWidth - current.width;
    setOffset(Math.min(right - current.left, Math.max(-current.left, distance)));
  }

  function cancel() {
    drag.current = null;
    setOffset(undefined);
  }

  function finish(event: PointerEvent<HTMLButtonElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    if (didDrag.current) {
      const center = current.left + current.width / 2 + event.clientX - current.startX;
      dock(center < document.documentElement.clientWidth / 2 ? "left" : "right");
    }
    cancel();
  }

  function suppressDragClick(event: MouseEvent<HTMLButtonElement>) {
    if (!didDrag.current || event.detail === 0) return false;
    event.preventDefault();
    didDrag.current = false;
    return true;
  }

  return { cancel, dock, finish, move, offset, side, start, suppressDragClick };
}
