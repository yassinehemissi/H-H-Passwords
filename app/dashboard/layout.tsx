"use client";
import { KeysContextProvider } from "@/context/KeysContext";
import "react-toastify/dist/ReactToastify.css";

import {
  Listbox,
  ListboxItem,
  Card,
  CardHeader,
  Divider,
  CardBody,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [keys, setKeys] = useState([]);
  useEffect(() => {
    axios.get("/api/keys").then(({ data }) => {
      setLoadingKeys(false);
      setKeys(data);
    });
  }, []);
  return !loadingKeys ? (
    <KeysContextProvider keys={keys}>
      <ToastContainer />
      <main className="flex justify-center flex-row gap-3 items-start text-white w-full h-screen text-center p-5">
        <Card className="max-w-[400px] w-[40%] h-full">
          <CardHeader
            onClick={() => router.push("/dashboard/")}
            className="flex flex-col justify-center items-center gap-0  cursor-pointer"
          >
            <h1 className="text-3xl font-bold">H&H</h1>
            <h2>Password</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <Listbox
              onAction={(key) => {
                router.push(key as string);
              }}
            >
              <ListboxItem key="/dashboard/manage-keys">
                Manage Keys
              </ListboxItem>
              <ListboxItem key="/dashboard/manage-passwords">
                Manage Passwords
              </ListboxItem>
              <ListboxItem key="/dashboard/manage-data">
                Manage Data
              </ListboxItem>

              <ListboxItem key="/" className="text-danger" color="danger">
                Return Home
              </ListboxItem>
            </Listbox>
          </CardBody>
        </Card>
        <Card className="w-full h-full opacity-80">{children}</Card>
      </main>
    </KeysContextProvider>
  ) : (
    <p>Loading</p>
  );
}
