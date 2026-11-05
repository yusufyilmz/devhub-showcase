import { FitnessApp } from "../../features/fitness/fitness-app";
export const metadata = {
  robots: { follow: false, index: false },
  title: "Fitness OS demo",
};
export default function PreviewPage() {
  return <FitnessApp demo />;
}
