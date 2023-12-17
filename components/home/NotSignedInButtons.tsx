"use client"
import React from "react";
import { FiGithub } from "react-icons/fi";
import { Button } from "@nextui-org/react";
import { signIn } from "next-auth/react";

export default function NotSignedInButtons() {
  return (
    <Button
      onClick={() => {
        signIn("github");
      }}
      className="text-xl px-10 py-5 mt-10"
      color="primary"
      endContent={<FiGithub />}
    >
      Sign In With
    </Button>
  );
}
