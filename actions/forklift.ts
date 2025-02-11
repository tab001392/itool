"use server";

import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { GetDataBySearchParams } from "@/types";

export const findForklift = async (sku: string) => {
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

    if (!userExist) {
      return { status: 401 };
    }

    const forklift = await db.forklift.findUnique({
      where: {
        sku,
      },
    });

    return JSON.parse(JSON.stringify(forklift));
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

export const getForklifts = async ({ searchString }: GetDataBySearchParams) => {
  try {
    if (searchString) {
      const forklifts = await db.forklift.findMany({
        where: {
          sku: {
            contains: searchString,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return JSON.parse(JSON.stringify(forklifts));
    } else {
      const forklifts = await db.forklift.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return JSON.parse(JSON.stringify(forklifts));
    }
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

export const resetForklifts = async () => {
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

    if (!userExist) {
      return { status: 401 };
    }

    const forkLifts = await db.forklift.updateMany({
      data: {
        present: false,
      },
    });

    return JSON.parse(JSON.stringify(forkLifts));
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

export const addForklift = async () => {
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

    if (!userExist) {
      return { status: 401 };
    }

    // Get the last inserted forklift SKU
    const lastForklift = await db.forklift.findFirst({
      orderBy: { sku: "desc" },
    });

    // Determine the next SKU
    const nextSku = lastForklift
      ? (parseInt(lastForklift.sku) + 1).toString()
      : "1001";

    // Create new forklift entry
    const newForklift = await db.forklift.create({
      data: {
        sku: nextSku, // Stored as a string
        present: false,
      },
    });

    return JSON.parse(JSON.stringify(newForklift));
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

export const getPresentForklifts = async () => {
  try {
    const forklifts = await db.forklift.findMany({
      where: {
        present: true,
      },
    });

    return JSON.parse(JSON.stringify(forklifts));
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

export const getAbsentForklifts = async () => {
  try {
    const forklifts = await db.forklift.findMany({
      where: {
        present: false,
      },
    });

    return JSON.parse(JSON.stringify(forklifts));
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

export const markForkliftAsPresent = async (sku: string) => {
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

    if (!userExist) {
      return { status: 401 };
    }

    const forklift = await db.forklift.update({
      where: {
        sku,
      },
      data: {
        present: true,
      },
    });

    return JSON.parse(JSON.stringify(forklift));
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};
