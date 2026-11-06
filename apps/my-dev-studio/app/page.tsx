import { getHomeAction, getHomeExample } from "@/features/home/home-links";
import { HomePage } from "@/features/home/home-page";

export default async function Page() {
  const [action, exampleHref] = await Promise.all([getHomeAction(), getHomeExample()]);
  return <HomePage action={action} exampleHref={exampleHref} />;
}
