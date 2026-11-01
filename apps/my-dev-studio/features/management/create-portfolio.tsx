"use client";

import { useRouter } from "next/navigation";

import { CreatePortfolio as CreatePortfolioView } from "@shared/components/studio";

export function CreatePortfolio() {
  const router = useRouter();
  return (
    <CreatePortfolioView
      onCreated={(id) => {
        router.push(`/admin/portfolios/${id}`);
        router.refresh();
      }}
    />
  );
}
