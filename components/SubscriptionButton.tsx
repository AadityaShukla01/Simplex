"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import axios from "axios";

interface SubscriptionButtonProps {
  isPro: boolean;
}

const SubscriptionButton = ({ isPro = false }: SubscriptionButtonProps) => {
  const [loading, setLoading] = useState(false);
  const onclick = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      // if subscribed billing else checkout page
      window.location.href = response.data.url;
    } catch (error) {
      console.log("BILLING ERROR");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Button
        variant={isPro ? "default" : "premium"}
        onClick={onclick}
        disabled={loading}
      >
        {isPro ? "Manage subscription" : "Upgrade"}
        {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
      </Button>
    </div>
  );
};

export default SubscriptionButton;
