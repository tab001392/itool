import Link from "next/link";
import { Forklift } from "@prisma/client";
import { redirect } from "next/navigation";
import { Check, Scan, X, XCircle } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUsers } from "@/actions/user";
import { formatDateTime } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import { Search } from "@/components/shared/search";
import { ContentLayout } from "@/components/shared/content-layout";
import {
  getAbsentForklifts,
  getForklifts,
  getPresentForklifts,
} from "@/actions/forklift";

export default async function DashboardPage({
  searchParams,
}: SearchParamProps) {
  const user = await currentUser();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  const searchText = (searchParams?.query as string) || "";
  const forklifts = await getForklifts({ searchString: searchText });
  const presentForklifts = await getPresentForklifts();
  const absentForklifts = await getAbsentForklifts();
  const users = await getUsers({ searchString: "" });

  return (
    <ContentLayout title="Dashboard">
      <div className="my-4 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
        <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-center sm:text-left">
          Hi {user.firstName} {" 👋"}
        </h3>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Link
            href="/scanner"
            className="flex items-center space-x-1 bg-green-500 px-3 py-2 rounded-md text-sm sm:text-base"
          >
            <Scan className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Start Session</span>
          </Link>
          <Link
            href="/report"
            className="flex items-center space-x-1 bg-red-500 px-3 py-2 rounded-md text-sm sm:text-base"
          >
            <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>End Session</span>
          </Link>
        </div>
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-4xl">{users.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                All registered users
              </div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <CardDescription>Total Forklifts</CardDescription>
              <CardTitle className="text-4xl">{forklifts.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                All forklifts with QRCode
              </div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="pb-2">
              <CardDescription>Present Forklifts</CardDescription>
              <CardTitle className="text-4xl">
                {presentForklifts.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                After a scanning session
              </div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-05-chunk-4">
            <CardHeader className="pb-2">
              <CardDescription>Absent Forklifts</CardDescription>
              <CardTitle className="text-4xl">
                {absentForklifts.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                After a scanning session
              </div>
            </CardContent>
          </Card>
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
                <th className="min-w-[100px] py-3 text-left">Present</th>
                <th className="min-w-[100px] py-3 text-left">Date Created</th>
              </tr>
            </thead>
            <tbody>
              {forklifts && forklifts.length === 0 ? (
                <tr className="border-b">
                  <td
                    colSpan={4}
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
                          {" "}
                          {row.present ? (
                            <Check className="text-green-500" />
                          ) : (
                            <X className="text-red-500" />
                          )}
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
      </div>
    </ContentLayout>
  );
}
