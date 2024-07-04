import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";


import React from "react";
const BotAvatar = () => {
  return (
    <div>
      <Avatar className="h-8 w-8">
        <AvatarImage src="/logo.png" />
      </Avatar>
    </div>
  );
};

export default BotAvatar;
