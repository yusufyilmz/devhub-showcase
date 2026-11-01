import { FitnessApp } from "../fitness-app";
export const metadata = {
  robots: { follow: false, index: false },
  title: "Shared workspace • Yusuf Fitness OS",
};
/** Same live workspace as /, always read-only even when the owner is signed in. */
export default function PreviewPage() {
  return <FitnessApp readOnly />;
}
