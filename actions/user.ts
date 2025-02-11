"use server";

import { db } from "@/lib/db";
import { GetDataBySearchParams } from "@/types";
import { currentUser } from "@clerk/nextjs/server";

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }

    const userExist = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });
    if (userExist) {
      return { status: 200, user: userExist };
    }

    const newUser = await db.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.imageUrl,
      },
    });
    if (newUser) {
      return { status: 201, user: newUser };
    }
    return { status: 400 };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

export const getUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 403 };
    }

    const userExist = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (userExist) {
      return { status: 200, user: userExist };
    }

    return { status: 400 };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

export const getUsers = async ({ searchString }: GetDataBySearchParams) => {
  try {
    if (searchString) {
      const users = await db.user.findMany({
        where: {
          OR: [
            {
              firstName: {
                contains: searchString,
              },
            },
            {
              lastName: {
                contains: searchString,
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return JSON.parse(JSON.stringify(users));
    } else {
      const users = await db.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return JSON.parse(JSON.stringify(users));
    }
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};
