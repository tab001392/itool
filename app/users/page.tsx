import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { formatDateTime } from "@/lib/utils";
import { getUsers } from "@/actions/user";
import { SearchParamProps } from "@/types";
import { Search } from "@/components/shared/search";
import { ContentLayout } from "@/components/shared/content-layout";

export default async function UsersPage({ searchParams }: SearchParamProps) {
  const user = await currentUser();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  const searchText = (searchParams?.query as string) || "";
  const users = await getUsers({ searchString: searchText });

  return (
    <ContentLayout title="users">
      <section className="mt-8">
        <Search placeholder="Search User..." />
      </section>

      <section className="overflow-x-auto p-1">
        <table className="w-full border-collapse border-t">
          <thead>
            <tr className="font-medium tracking-tight border-b text-muted-foreground">
              <th className="min-w-[100px] py-3 text-left">ID</th>
              <th className="min-w-[100px] py-3 text-left">First Name</th>
              <th className="min-w-[100px] py-3 text-left">Last Name</th>
              <th className="min-w-[100px] py-3 text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length === 0 ? (
              <tr className="border-b">
                <td
                  colSpan={4}
                  className="py-4 text-center text-muted-foreground"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              <>
                {users &&
                  users.map((row: User) => (
                    <tr
                      key={row.id}
                      className="font-normal tracking-tight leading-relaxed lg:font-medium border-b"
                      style={{ boxSizing: "border-box" }}
                    >
                      <td className="min-w-[100px] py-4 text-primary">
                        {row.id}
                      </td>
                      <td className="min-w-[100px] py-4">{row.firstName}</td>
                      <td className="min-w-[100px] py-4">{row.lastName}</td>
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
