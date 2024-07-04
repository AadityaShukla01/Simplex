import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/isSubscribed";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;
    console.log(prompt);
    if (!userId) {
      return new NextResponse("Unauthorised", { status: 500 });
    }

    if (!replicate) {
      return new NextResponse("Replicate API Key not configured", {
        status: 500,
      });
    }

    if (!prompt) {
      return new NextResponse("Messages are required", { status: 400 });
    }
    // checking if user is in free subscription
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired", { status: 403 });
    }
    const input = {
      prompt_a: prompt,
    };

    const output = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      { input }
    );
    //increase count
    await increaseApiLimit();

    return NextResponse.json(output);
  } catch (error) {
    console.log("[MUSIC ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
