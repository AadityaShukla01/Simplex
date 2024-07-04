"use client";

import Heading from "@/components/Heading";
import { Music } from "lucide-react";
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
import { useProModal } from "@/hooks/use-pro-modal";
import {toast} from "react-hot-toast";

const MusicPage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [music, setMusic] = useState<string>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusic(undefined);
      const res = await axios.post("/api/music", values);
      setMusic(res.data.audio);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      }else {
        toast.error("Something went wrong");
      }
    } finally {
      router.refresh();
    }
  };
  return (
    <div>
      <Heading
        title="Music Generator"
        description="Turn tour prompt into music"
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
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
          {!music && !isLoading && (
            <div>
              <Empty label="No conversation started" />
            </div>
          )}
          <div>
            {music && (
              <audio controls className="w-full mt-8">
                <source src={music} />
              </audio>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
