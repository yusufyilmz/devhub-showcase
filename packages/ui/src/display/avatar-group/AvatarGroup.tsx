/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */

import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { avatarGroupStyles } from "./styles";
import type { AvatarGroupOptions } from "./types";

export function AvatarGroup({ avatars }: AvatarGroupOptions) {
  return (
    <div className={avatarGroupStyles.element1}>
      {avatars.map((avatar) => (
        <Avatar className={avatarGroupStyles.element2} key={avatar.src ?? avatar.value}>
          {avatar.src ? <AvatarImage alt={avatar.alt ?? ""} src={avatar.src} /> : null}
          <AvatarFallback>{avatar.value ?? avatar.alt?.slice(0, 1)}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}
