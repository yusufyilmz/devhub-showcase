import { HomePage } from "@/features/home/home-page";
import { getHomeAction, getHomeExample } from "@/lib/home-links";

export default async function Page() {
  const [action, exampleHref] = await Promise.all([getHomeAction(), getHomeExample()]);
  return <HomePage action={action} exampleHref={exampleHref} />;
}
