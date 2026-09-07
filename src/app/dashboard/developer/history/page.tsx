import { redirect } from "next/navigation";

export default function DeveloperHistoryRedirectPage() {
  redirect("/dashboard/developer?tab=history");
}
