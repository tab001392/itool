import { Forklift } from "@prisma/client";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { formatDateTime } from "@/lib/utils";
import { getForklifts } from "@/actions/forklift";
import { SearchParamProps } from "@/types";
import { Search } from "@/components/shared/search";
import { ForkliftQRCode } from "./_components/forklift-qrcode";
import { ContentLayout } from "@/components/shared/content-layout";
import { CreateForkliftConfirmation } from "./_components/create-forklift-confirmation";

export default async function ForkliftsPage({
  searchParams,
}: SearchParamProps) {
  const user = await currentUser();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  const searchText = (searchParams?.query as string) || "";
  const forklifts = await getForklifts({ searchString: searchText });

  return (
    <ContentLayout title="Forklifts">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
        {/* Left Section - Title & Description */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Forklifts</h2>
          <p className="text-sm text-gray-500">
            Manage your Forklifts.
          </p>
        </div>

        {/* Right Section - Add Button */}
        <CreateForkliftConfirmation />
      </div>

      <section className="mt-8">
        <Search placeholder="Search Forklift SKU..." />
      </section>

      <section className="overflow-x-auto p-1">
        <table className="w-full border-collapse border-t">
          <thead>
            <tr className="font-medium tracking-tight border-b text-muted-foreground">
              <th className="min-w-[100px] py-3 text-left">ID</th>
              <th className="min-w-[100px] py-3 text-left">Forklift SKU</th>
              <th className="min-w-[100px] py-3 text-left">Unique QRCode</th>
              <th className="min-w-[100px] py-3 text-left">Date Created</th>
            </tr>
          </thead>
          <tbody>
            {forklifts && forklifts.length === 0 ? (
              <tr className="border-b">
                <td
                  colSpan={3}
                  className="py-4 text-center text-muted-foreground"
                >
                  No Forklifts found.
                </td>
              </tr>
            ) : (
              <>
                {forklifts &&
                  forklifts.map((row: Forklift) => (
                    <tr
                      key={row.id}
                      className="font-normal tracking-tight leading-relaxed lg:font-medium border-b"
                      style={{ boxSizing: "border-box" }}
                    >
                      <td className="min-w-[100px] py-4 text-primary">
                        {row.id}
                      </td>
                      <td className="min-w-[100px] py-4">{row.sku}</td>
                      <td className="min-w-[100px] py-4">
                        <ForkliftQRCode
                          link={`${process.env.NEXT_PUBLIC_APP_URL}/forklifts/${row?.sku}`}
                        />
                      </td>
                      <td className="min-w-[100px] py-4">
                        {formatDateTime(row.createdAt!).dateTime}
                      </td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </table>
      </section>
    </ContentLayout>
  );
}
