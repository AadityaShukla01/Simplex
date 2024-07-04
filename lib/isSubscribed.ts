import { auth } from "@clerk/nextjs/server";
import { prismadb } from "./prismadb";

const DAY_IN_MS = 86_400_000;

// UTIL to check if login user is subscribed or not
export const checkSubscription = async () => {
  const { userId } = auth();
  if (!userId) {
    return false;
  }

  const userSubscription = await prismadb.userSubscription.findUnique({
    where: {
      userId,
    },
    select: {
      stripeCurrentPeriodEnd: true,
      stripePriceId: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
    },
  });

  if (!userSubscription) {
    return false;
  }

  const isValid =
    //+1 day grace
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
      Date.now();

  return !!isValid; // ensure it is always boolean
};
