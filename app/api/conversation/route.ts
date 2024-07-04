import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/isSubscribed";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;
    const prompt = messages.prompt;
    if (!userId) {
      return new NextResponse("Unauthorised", { status: 500 });
    }

    if (!genAI) {
      return new NextResponse("Gemini API Key not configured", { status: 500 });
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const res = await response.text();

    //increase count
    await increaseApiLimit();

    return NextResponse.json(res);
  } catch (error) {
    console.log("[CONVERSATION ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
