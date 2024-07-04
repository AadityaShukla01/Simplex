"use client";

import Heading from "@/components/Heading";
import { ImageIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import Empty from "@/components/Empty";
import Loading from "@/components/Loader";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/user-avatar";
import BotAvatar from "@/components/bot-avatar";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";

interface Message {
  text: string;
  role: "user" | "bot";
}
const ImageGen = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [messages, setMessages] = useState<Message[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      const userMessage: Message = {
        role: "user",
        text: values.prompt,
      };
      const res = await axios.post("/api/image", {
        messages: values,
      });
      // doing like this because gemini accepts messages only
      const botMessage: Message = {
        text: res.data,
        role: "bot",
      };
      setMessages((current) => [...current, botMessage, userMessage]);
      console.log(messages);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      router.refresh();
    }
  };
  return (
    <div>
      <Heading
        title="Image Generator"
        description="Generating the most realistic & accurate images."
        icon={ImageIcon}
        iconColor="text-orange-500"
        bgColor="bg-orange-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-10">
                    <FormControl className="m-0 p-2">
                      <Input
                        className="border-0 outline-none focus:ring-0 focus:ring-transparent"
                        disabled={isLoading}
                        placeholder="Enter a prompt"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="col-span-2 w-full" disabled={isLoading}>
                Enter
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loading />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <div>
              <Empty label="No conversation started" />
            </div>
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div
                key={message.text}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                {message.role === "user" ? (
                  <p className="text-sm">{message.text}</p>
                ) : (
                  <div className="grid grid-cols-2 gap-20">
                    <img
                      src={message.text}
                      alt="output"
                      className="cursor-pointer"
                      onClick={() => window.open(message.text)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGen;
