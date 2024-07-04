"use client";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import TypewriterComponent from "typewriter-effect";
import { Button } from "./ui/button";

const LandingHero = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="text-white font-bold py-36 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1>Your everyday AI companion</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          <TypewriterComponent
            options={{
              strings: [
                "Chatbot.",
                "Code Generation.",
                "Music Generation.",
                "Video Generation.",
                "Image Generation.",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
        <div className="text-sm md:text-xl font-light text-zinc-400 flex flex-col mx-auto ">
          One stop solution for all the AI usage.
          <Link
            className="sm:p-2 p-4 my-2 font-semibold "
            href={isSignedIn ? "/dashboard" : "/sign-up"}
          >
            <Button variant={"premium"} className="rounded-md">
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;
