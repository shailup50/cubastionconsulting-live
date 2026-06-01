import { redirect } from "next/navigation";

export default function PublicDocsRedirect() {
  redirect("/cubastion-admin/login");
}
