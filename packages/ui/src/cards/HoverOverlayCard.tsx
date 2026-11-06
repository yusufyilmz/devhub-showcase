import { cn } from "../../../../lib/utils";

export type HoverOverlayCardProps = {
  title: string;
  description?: string;
  image: string;
  hoverImage: string;
  className?: string;
};

// A card that swaps its background image to a GIF on hover,
// with a dark overlay for readability.
export function HoverOverlayCard({
  title,
  description,
  image,
  hoverImage,
  className,
}: HoverOverlayCardProps) {
  return (
    <div className="w-full max-w-xs">
      <div
        className={cn(
          "group relative mx-auto flex h-96 w-full cursor-pointer flex-col justify-end overflow-hidden rounded-md border border-transparent p-4 shadow-xl transition-all duration-500 dark:border-neutral-800",
          className,
        )}
      >
        {/* Background images */}
        <div
          className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
          style={{
            backgroundImage: `url('${image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            backgroundImage: `url('${hoverImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-50" />

        <div className="relative z-50 text-white">
          <h1 className="font-bold text-xl md:text-3xl">{title}</h1>
          {description && <p className="mt-4 font-normal text-base">{description}</p>}
        </div>
      </div>
    </div>
  );
}
