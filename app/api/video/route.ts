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
      fps: 24,
      width: 1024,
      height: 576,
      prompt,
      guidance_scale: 17.5,
    };

    const output = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      { input }
    ); //increase count
    await increaseApiLimit();
    return NextResponse.json(output);
  } catch (error) {
    console.log("[MUSIC ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
