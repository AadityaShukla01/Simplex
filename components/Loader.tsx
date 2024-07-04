import Image from "next/image";
import React from "react";

const Loading = () => {
  return (
    <>
      <div className="h-full flex flex-col gap-y-4 items-center justify-center">
        <div className="w-10 h-10 relative animate-spin">
          <Image alt="Loader" fill src="/logo.png" />
        </div>
        <p className="text-sm text-muted-foreground">Waiting for Simplex....</p>
      </div>
    </>
  );
};

export default Loading;
