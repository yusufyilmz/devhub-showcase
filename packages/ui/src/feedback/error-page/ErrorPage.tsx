"use client";

import { CircleAlert } from "lucide-react";

import { copy } from "@shared/config";

import { GoBackButton } from "../../buttons/go-back-button/GoBackButton";
import { HomeButton } from "../../buttons/home-button/HomeButton";
import { recoveryPageStyles } from "../../layout/page-variants/styles";

export function ErrorPage() {
  return (
    <div className={recoveryPageStyles.shell}>
      <section className={`${recoveryPageStyles.card} [--recovery-tone:var(--destructive)]`}>
        <span className={recoveryPageStyles.icon}>
          <CircleAlert aria-hidden="true" className="size-[1.375rem]" />
        </span>
        <p className={recoveryPageStyles.label}>Server error</p>
        <h1 className={recoveryPageStyles.title}>{copy.errorPage.title}</h1>
        <p className={recoveryPageStyles.description}>{copy.errorPage.message}</p>
        <div className={recoveryPageStyles.actions}>
          <GoBackButton className={recoveryPageStyles.button} />
          <HomeButton className={recoveryPageStyles.button} />
        </div>
      </section>
    </div>
  );
}
