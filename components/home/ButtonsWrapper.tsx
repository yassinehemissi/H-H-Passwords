"use client";
import React from "react";

import { useSession } from "next-auth/react";
import SignedInButtons from "./SignedInButtons";
import NotSignedInButtons from "./NotSignedInButtons";
import { CircularProgress } from "@nextui-org/react";

const ButtonsWrapper = () => {
  const { data: session, status } = useSession();
  return status != "loading" ? (
    session?.user ? (
      <SignedInButtons />
    ) : (
      <NotSignedInButtons />
    )
  ) : (
    <CircularProgress className="mt-5" color="default" aria-label="Loading..." />
  );
};

export default ButtonsWrapper;
