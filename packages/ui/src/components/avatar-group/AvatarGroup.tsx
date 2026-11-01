/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";

export function AvatarGroup({
  avatars,
}: {
  avatars: { src?: string; alt?: string; value?: string }[];
}) {
  return (
    <div className="flex -space-x-2">
      {avatars.map((avatar) => (
        <Avatar className="ring-2 ring-background" key={avatar.src ?? avatar.value}>
          {avatar.src ? <AvatarImage alt={avatar.alt ?? ""} src={avatar.src} /> : null}
          <AvatarFallback>{avatar.value ?? avatar.alt?.slice(0, 1)}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}
