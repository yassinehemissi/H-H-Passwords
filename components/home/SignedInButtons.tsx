"use client";
import React from "react";
import { Button } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { MdDashboard } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
export default function SignedInButtons() {
  return (
    <div className="flex flex-col gap-5 mt-10">
      <Link href="/dashboard">
        <Button
          className="text-xl px-10 py-5"
          color="primary"
          endContent={<MdDashboard />}
        >
          Access Dashboard
        </Button>
      </Link>
      <Button
        onClick={() => {
          signOut();
        }}
        className="text-xl px-10 py-5"
        color="danger"
        endContent={<CiLogout />}
      >
        Logout
      </Button>
    </div>
  );
}
