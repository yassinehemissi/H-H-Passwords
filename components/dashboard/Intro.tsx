import { CardHeader } from "@nextui-org/react";
import React from "react";

export default function Intro() {
  return (
    <CardHeader className="flex flex-col justify-start items-start gap-0 p-5">
      <h1 className="text-3xl font-bold text-left">Welcome to H&H Passwords</h1>
      <p className="mt-2 text-left font-light">
        Introducing H&H Passwords a cutting-edge password manager that combines
        seamless password storage with unparalleled security features. With an
        innovative key-based protection system, managing your passwords has
        never been more secure and straightforward. Your digital fortress is
        further fortified with advanced encryption, extending beyond passwords
        to safeguard your files. Only you hold the key to unlock this robust
        defense, ensuring that your sensitive information remains confidential
        and protected from prying eyes. Experience peace of mind and convenience
        in one package download H&H Passwords now and take control of your
        online security like never before.
      </p>
    </CardHeader>
  );
}
