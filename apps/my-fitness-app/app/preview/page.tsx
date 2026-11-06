import { FitnessApp } from "../../features/fitness/fitness-app";

export const metadata = {
  robots: { follow: false, index: false },
  title: "My Fitness Studio demo",
};

export default function PreviewPage() {
  return <FitnessApp demo />;
}
