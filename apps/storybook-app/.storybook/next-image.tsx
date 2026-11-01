import type { ImgHTMLAttributes } from "react";

type ImageSource = string | { src: string };

export default function Image({
  alt,
  src,
  ...props
}: Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { alt: string; src: ImageSource }) {
  return <img alt={alt} src={typeof src === "string" ? src : src.src} {...props} />;
}
