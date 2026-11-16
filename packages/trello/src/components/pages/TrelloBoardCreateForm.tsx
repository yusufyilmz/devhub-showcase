"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";

import { StudioButton } from "@shared/ui/button";
import { Card, CardContent } from "@shared/ui/cards";
import { Feedback } from "@shared/ui/feedback";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { NativeSelect } from "@shared/ui/native-select";
import { Textarea } from "@shared/ui/textarea";

import {
  BOARD_DESCRIPTION_LIMIT,
  BOARD_NAME_LIMIT,
  type BoardCreationState,
} from "../../board-creation";

interface TrelloBoardCreateFormProps {
  action: (state: BoardCreationState, form: FormData) => Promise<BoardCreationState>;
  boardsHref: string;
}

export function TrelloBoardCreateForm({ action, boardsHref }: TrelloBoardCreateFormProps) {
  const [state, submit, pending] = useActionState(action, { status: "idle" });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [layout, setLayout] = useState("starter");
  const id = useId();
  const nameInput = useRef<HTMLInputElement>(null);
  const descriptionInput = useRef<HTMLTextAreaElement>(null);
  const result = useRef<HTMLDivElement>(null);
  const errors = state.status === "error" ? state.fields : undefined;

  useEffect(() => {
    if (errors?.name) nameInput.current?.focus();
    else if (errors?.description) descriptionInput.current?.focus();
    else if (state.status !== "idle") result.current?.focus();
  }, [errors, state]);

  return (
    <Card className="w-full max-w-2xl" interaction="static">
      <CardContent className="p-6 sm:p-8">
        {state.status === "created" ? (
          <div className="grid gap-4" ref={result} tabIndex={-1}>
            <Feedback
              description={`“${state.name}” is ready to use.`}
              title="Board created"
              variant="success"
            />
            <div className="flex flex-wrap gap-3">
              {state.href && <StudioButton href={state.href}>Open in Trello</StudioButton>}
              <StudioButton href={boardsHref} tone="secondary" variant="outline">
                Back to boards
              </StudioButton>
            </div>
          </div>
        ) : (
          <form action={submit} aria-busy={pending} className="grid gap-5">
            {state.status === "error" && (
              <div ref={result} tabIndex={-1}>
                <Feedback description={state.message} variant="danger" />
              </div>
            )}
            <fieldset className="grid min-w-0 gap-5" disabled={pending}>
              <div className="grid gap-2">
                <Label htmlFor={`${id}-name`}>Board name</Label>
                <Input
                  aria-describedby={errors?.name ? `${id}-name-error` : undefined}
                  aria-invalid={Boolean(errors?.name)}
                  id={`${id}-name`}
                  maxLength={BOARD_NAME_LIMIT}
                  name="name"
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Product roadmap"
                  ref={nameInput}
                  required
                  value={name}
                />
                {errors?.name && (
                  <p className="text-sm text-destructive" id={`${id}-name-error`}>
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${id}-description`}>Description (optional)</Label>
                <Textarea
                  aria-describedby={errors?.description ? `${id}-description-error` : undefined}
                  aria-invalid={Boolean(errors?.description)}
                  id={`${id}-description`}
                  maxLength={BOARD_DESCRIPTION_LIMIT}
                  name="description"
                  onChange={(event) => setDescription(event.target.value)}
                  ref={descriptionInput}
                  rows={4}
                  value={description}
                />
                {errors?.description && (
                  <p className="text-sm text-destructive" id={`${id}-description-error`}>
                    {errors.description}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${id}-layout`}>Starting layout</Label>
                <NativeSelect
                  id={`${id}-layout`}
                  name="layout"
                  onChange={(event) => setLayout(event.target.value)}
                  value={layout}
                >
                  <option value="starter">To Do, Doing, Done</option>
                  <option value="blank">Empty board</option>
                </NativeSelect>
              </div>
            </fieldset>
            <p className="text-sm text-muted-foreground">
              New boards are private. Manage access and invite members in Trello.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <StudioButton disabled={pending} type="submit">
                {pending ? "Creating board…" : "Create board"}
              </StudioButton>
              <StudioButton href={boardsHref} tone="secondary" variant="outline">
                Cancel
              </StudioButton>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
