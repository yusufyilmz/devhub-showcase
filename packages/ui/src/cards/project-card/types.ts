import type { AvatarGroupOptions } from "../../display/avatar-group/types";

export type ProjectCardProps = {
  title: string;
  description?: string;
  images?: readonly { src: string; alt: string }[];
  avatars?: AvatarGroupOptions["avatars"];
  caseStudyHref?: string;
  projectHref?: string;
};
