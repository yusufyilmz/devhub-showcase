"use client";

import { type DragEvent, type FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { Button, StudioButton } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@shared/ui/dialog";
import { Feedback } from "@shared/ui/feedback";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { NativeSelect } from "@shared/ui/native-select";
import { Textarea } from "@shared/ui/textarea";
import { Typography } from "@shared/ui/typography";

import { trelloBoardHref } from "../../board-creation";
import type { BoardCommand, BoardCommandResult, BoardCommentsResult } from "../../board-workspace";
import type { TrelloCard as CardData, TrelloBoard, TrelloList } from "../../types";
import { TrelloCard } from "../cards/TrelloCard";

type Editor =
  | { type: "board" }
  | { type: "list" }
  | { type: "newCard"; listId: string }
  | { type: "card"; cardId: string };

interface WorkspaceProps {
  action: (command: BoardCommand) => Promise<BoardCommandResult>;
  board: TrelloBoard;
  cards: CardData[];
  lists: TrelloList[];
  readComments: (cardId: string) => Promise<BoardCommentsResult>;
}

function saveCommand(editor: Editor, form: FormData): BoardCommand {
  const details = {
    desc: String(form.get("description") ?? ""),
    name: String(form.get("name") ?? ""),
  };
  switch (editor.type) {
    case "board":
      return { ...details, type: "editBoard" };
    case "card":
      return { ...details, cardId: editor.cardId, type: "editCard" };
    case "list":
      return { name: details.name, type: "addList" };
    case "newCard":
      return { ...details, listId: editor.listId, type: "addCard" };
  }
}

function CardComments({
  cardId,
  pending,
  readComments,
  submit,
}: Pick<WorkspaceProps, "readComments"> & {
  cardId: string;
  pending: boolean;
  submit: WorkspaceProps["action"];
}) {
  const [result, setResult] = useState<BoardCommentsResult>();
  const [text, setText] = useState("");
  const load = useCallback(() => {
    setResult(undefined);
    let active = true;
    readComments(cardId).then(
      (data) => {
        if (active) setResult(data);
      },
      () => {
        if (active) setResult({ error: "Could not load comments." });
      },
    );
    return () => {
      active = false;
    };
  }, [cardId, readComments]);
  useEffect(load, [load]);

  async function post(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) return;
    const saved = await submit({ cardId, text, type: "addComment" });
    if (!saved.ok || !saved.comment) return;
    const comment = saved.comment;
    setText("");
    setResult((current) =>
      current && "comments" in current
        ? { comments: [comment, ...current.comments.filter(({ id }) => id !== comment.id)] }
        : current,
    );
  }

  return (
    <section className="grid gap-3 border-t border-border pt-4">
      <Typography as="h3" variant="h5">
        Comments
      </Typography>
      {!result ? (
        <p className="text-sm text-muted-foreground" role="status">
          Loading comments…
        </p>
      ) : "error" in result ? (
        <Feedback description={result.error} variant="danger">
          <Button onClick={load} type="button" variant="outline">
            Reload comments
          </Button>
        </Feedback>
      ) : (
        <>
          {result.comments.length ? (
            <ul className="grid max-h-56 list-none gap-2 overflow-y-auto p-0">
              {result.comments.map((comment) => (
                <li
                  className="rounded-lg border border-border bg-muted/40 p-3 text-sm"
                  key={comment.id}
                >
                  <strong>{comment.memberCreator.fullName}</strong>
                  <p className="mt-1 whitespace-pre-wrap wrap-anywhere">{comment.text}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          )}
          <form className="grid gap-2" onSubmit={post}>
            <Label htmlFor="trello-comment">New comment</Label>
            <Textarea
              disabled={pending}
              id="trello-comment"
              maxLength={1000}
              onChange={(event) => setText(event.target.value)}
              rows={2}
              value={text}
            />
            <Button className="justify-self-start" disabled={pending || !text.trim()} type="submit">
              Post comment
            </Button>
          </form>
        </>
      )}
    </section>
  );
}

function BoardStatus({
  pending,
  error,
  empty,
}: {
  pending: boolean;
  error: string;
  empty: boolean;
}) {
  return (
    <>
      {pending && (
        <p className="text-sm text-muted-foreground" role="status">
          Updating board…
        </p>
      )}
      {error && <Feedback description={error} variant="danger" />}
      {empty && (
        <p className="text-sm text-muted-foreground">Add a list to start organizing cards.</p>
      )}
    </>
  );
}

export function TrelloBoardWorkspace({
  action,
  board,
  cards,
  lists,
  readComments,
}: WorkspaceProps) {
  const [editor, setEditor] = useState<Editor>();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const card = editor?.type === "card" ? cards.find(({ id }) => id === editor.cardId) : undefined;
  const initial = editor?.type === "board" ? board : card;
  const title = {
    board: "Edit board",
    card: "Card details",
    list: "Add list",
    newCard: "Add card",
  };
  const href = trelloBoardHref(board);

  function open(next?: Editor) {
    setError("");
    setEditor(next);
  }

  async function submit(command: BoardCommand): Promise<BoardCommandResult> {
    if (lock.current) return { error: "A change is already in progress.", ok: false };
    lock.current = true;
    setPending(true);
    setError("");
    try {
      const result = await action(command);
      if (!result.ok) setError(result.error);
      return result;
    } catch {
      const message = "Studio could not confirm the change. Reload the board before retrying.";
      setError(message);
      return { error: message, ok: false };
    } finally {
      lock.current = false;
      setPending(false);
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor) return;
    if ((await submit(saveCommand(editor, new FormData(event.currentTarget)))).ok) open();
  }

  async function remove() {
    if (
      !initial ||
      !window.confirm(`Permanently delete “${initial.name}”${card ? "" : " and all its cards"}?`)
    )
      return;
    const result = await submit(
      card ? { cardId: card.id, type: "deleteCard" } : { type: "deleteBoard" },
    );
    if (result.ok) open();
  }

  function drop(event: DragEvent, listId: string, beforeCardId?: string) {
    event.preventDefault();
    event.stopPropagation();
    const cardId = event.dataTransfer.getData("application/x-mydevstudio-trello-card");
    if (!cards.some(({ id }) => id === cardId) || cardId === beforeCardId) return;
    return submit({ beforeCardId, cardId, listId, type: "moveCard" });
  }

  return (
    <>
      <header className="grid gap-3 rounded-xl border border-border bg-card p-5">
        <Typography as="h1" className="wrap-anywhere" variant="h2">
          {board.name}
        </Typography>
        {board.desc && (
          <p className="whitespace-pre-wrap wrap-anywhere text-muted-foreground">{board.desc}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button disabled={pending} onClick={() => open({ type: "list" })} type="button">
            Add list
          </Button>
          <Button
            disabled={pending}
            onClick={() => open({ type: "board" })}
            type="button"
            variant="outline"
          >
            Edit board
          </Button>
          {href && (
            <StudioButton href={href} tone="secondary">
              Open in Trello
            </StudioButton>
          )}
        </div>
      </header>
      <BoardStatus empty={!lists.length} error={editor ? "" : error} pending={pending} />
      <section
        aria-label="Board lists"
        className="flex min-w-0 items-start gap-4 overflow-x-auto pb-4"
      >
        {lists
          .toSorted((left, right) => left.pos - right.pos)
          .map((list) => {
            const column = cards
              .filter(({ idList }) => idList === list.id)
              .sort((left, right) => left.pos - right.pos);
            return (
              <Card
                className="grid w-[min(18rem,82vw)] shrink-0 gap-3 bg-muted/40 p-3"
                interaction="static"
                key={list.id}
                onDragOver={(event) => {
                  if (
                    !pending &&
                    event.dataTransfer.types.includes("application/x-mydevstudio-trello-card")
                  )
                    event.preventDefault();
                }}
                onDrop={(event) => drop(event, list.id)}
              >
                <Typography as="h2" className="wrap-anywhere" variant="h5">
                  {list.name}
                </Typography>
                {column.map((item) => (
                  <div key={item.id} onDrop={(event) => drop(event, list.id, item.id)}>
                    <TrelloCard
                      card={item}
                      draggable={!pending}
                      onOpen={() => open({ cardId: item.id, type: "card" })}
                      showActions={false}
                    />
                  </div>
                ))}
                <Button
                  disabled={pending}
                  onClick={() => open({ listId: list.id, type: "newCard" })}
                  type="button"
                  variant="outline"
                >
                  Add card
                </Button>
              </Card>
            );
          })}
      </section>
      <Dialog
        onOpenChange={(visible) => {
          if (!visible && !pending) open();
        }}
        open={Boolean(editor)}
      >
        {editor && (
          <DialogContent>
            <DialogTitle>{title[editor.type]}</DialogTitle>
            <DialogDescription>{initial?.name ?? board.name}</DialogDescription>
            {error && <Feedback description={error} variant="danger" />}
            <form className="grid gap-2" key={initial?.id ?? editor.type} onSubmit={save}>
              <Label htmlFor="trello-name">Name</Label>
              <Input
                defaultValue={initial?.name}
                disabled={pending}
                id="trello-name"
                maxLength={100}
                name="name"
                required
              />
              {editor.type !== "list" && (
                <>
                  <Label htmlFor="trello-description">Description</Label>
                  <Textarea
                    defaultValue={initial?.desc}
                    disabled={pending}
                    id="trello-description"
                    maxLength={1000}
                    name="description"
                    rows={3}
                  />
                </>
              )}
              <div className="flex flex-wrap gap-2">
                <Button disabled={pending} type="submit">
                  {initial ? "Save changes" : title[editor.type]}
                </Button>
                {initial && (
                  <Button disabled={pending} onClick={remove} type="button" variant="destructive">
                    {card ? "Delete card" : "Delete board"}
                  </Button>
                )}
              </div>
            </form>
            {card && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="trello-move">Move to list</Label>
                  <NativeSelect
                    disabled={pending}
                    id="trello-move"
                    onChange={(event) =>
                      submit({ cardId: card.id, listId: event.target.value, type: "moveCard" })
                    }
                    value={card.idList}
                  >
                    {lists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.name}
                      </option>
                    ))}
                  </NativeSelect>
                </div>
                <CardComments
                  cardId={card.id}
                  key={card.id}
                  pending={pending}
                  readComments={readComments}
                  submit={submit}
                />
              </>
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
