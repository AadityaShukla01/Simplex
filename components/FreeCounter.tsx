"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { MAX_FREE_COUNTS } from "@/constants";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { useProModal } from "@/hooks/use-pro-modal";

interface FreeCounterProps {
  apiLimitCount: number;
  isPro: boolean;
}
const FreeCounter = ({ apiLimitCount = 0, isPro }: FreeCounterProps) => {
  const [mounted, setMounted] = useState(false);
  const proModal = useProModal();
  // for hydration errors(docs)
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  if (isPro) return null;
  return (
    <div className="px-3">
      <Card className="bg-white/10">
        <CardContent className="py-6 flex flex-col justify-center">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p className="mb-2">
              {apiLimitCount}/{MAX_FREE_COUNTS} Free tier
            </p>
            <Progress
              value={(apiLimitCount / MAX_FREE_COUNTS) * 100}
              className="h-3"
            />
          </div>
          <Button variant={"premium"} onClick={proModal.onOpen}>
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreeCounter;
