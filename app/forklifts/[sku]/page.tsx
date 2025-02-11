import { findForklift, markForkliftAsPresent } from "@/actions/forklift";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SKUPage({ params }: { params: { sku: string } }) {
  const forklift = await findForklift(params.sku);

  let text = "";
  if (forklift) {
    await markForkliftAsPresent(params.sku);
    redirect("/dashboard");
  } else {
    text = "Forklift not found.";
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader />
      <h1>{text}</h1>
    </div>
  );
}
