import { redirect } from "next/navigation";

import { getUser } from "@/actions/user";

export default async function SetupPage() {
  const auth = await getUser();

  if (auth.status === 200 || auth.status === 201) {
    return redirect("/dashboard");
  } else {
    return redirect("/auth/sign-in");
  }
}
