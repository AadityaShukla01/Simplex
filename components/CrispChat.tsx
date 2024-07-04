"use client";
import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("d99a9b76-3f14-46b2-8c73-b2bdd08c041a");
  }, []);

  return null;
};
