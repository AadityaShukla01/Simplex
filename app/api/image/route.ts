import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import Replicate from "replicate";
import { checkSubscription } from "@/lib/isSubscribed";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;
    const prompt = messages.prompt;
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
    } // checking if user is in free subscription
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired", { status: 403 });
    }
    console.log("Running the model...");
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt,
          num_outputs: 1,
        },
      }
    );
    //increase count
    await increaseApiLimit();
    return new NextResponse(JSON.stringify(output), { status: 201 });
  } catch (err) {
    console.log(err);
  }
}
