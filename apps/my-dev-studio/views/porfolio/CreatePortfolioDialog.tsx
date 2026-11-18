"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CreatePortfolio as CreatePortfolioView } from "@shared/assistant/management-ui";
import { Button } from "@shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@shared/ui/dialog";
import { SectionCatalog } from "@shared/ui/sections";

export function CreatePortfolioDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button type="button">Create a portfolio</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[min(90dvh,64rem)] w-[calc(100%-1rem)] max-w-5xl overflow-y-auto sm:max-w-5xl">
        <DialogHeader className="pr-lg">
          <DialogTitle>New managed portfolio</DialogTitle>
          <DialogDescription>
            Set up a private portfolio and explore example sections.
          </DialogDescription>
        </DialogHeader>
        <div className="grid min-w-0 gap-lg lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <CreatePortfolioView
            onCreated={(id) => {
              setOpen(false);
              router.push(`/studio/portfolios/${id}`);
              router.refresh();
            }}
          />
          <SectionCatalog />
        </div>
      </DialogContent>
    </Dialog>
  );
}
