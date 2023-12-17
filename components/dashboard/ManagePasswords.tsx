"use client";

import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  CardHeader,
  Chip,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useKeysContext } from "@/context/KeysContext";
import { toast } from "react-toastify";
import Encryption from "@/lib/encryption/client/Encryption";
import axios from "axios";
export default function ManagePasswords() {
  const { keys } = useKeysContext();
  const [password, setPassword] = useState("");
  const [key, setKey] = useState<(typeof keys)[0]>();
  const [passwordName, setPasswordName] = useState("");
  const [passwords, setPasswords] = useState([]);
  useEffect(() => {
    axios.get("/api/passwords").then(({ data }) => {
      setPasswords(data);
    });
  }, []);
  let notify = (message: string) => {
    toast(message);
  };

  const getPassword = (password: any) => {
    let key = keys.filter((key) => {
      if (key.key_loaded && key.key_id == password.password_key_id) {
        return key;
      }
    });
    let result = "Hidden";
    if (key.length == 1) {
      result = Encryption.decrypt(
        password.password,
        key[0].key_value as string
      );
    }
    return result;
  };

  return (
    <CardHeader className="flex flex-col justify-start items-start gap-0 p-5">
      <h1 className="text-3xl font-bold text-left">Password Management</h1>
      <div className="my-5 flex flex-col justify-start item-start text-left gap-2">
        <h2>Add a password:</h2>
        <div className="w-full grid grid-rows-2 grid-cols-2 gap-3">
          <Autocomplete
            onSelectionChange={(key_type) => {
              for (let i = 0; i < keys.length; i++) {
                if (keys[i].key_id == key_type) {
                  setKey(keys[i]);
                  return;
                }
              }
            }}
            label="Select Loaded Key"
            className="max-w-xs"
          >
            {keys
              .filter((key_type: any) => {
                if (key_type.key_loaded) return key_type;
              })
              .map((key_type) => {
                return (
                  <AutocompleteItem
                    className="text-white"
                    key={key_type.key_id}
                    value={key_type.key_name}
                  >
                    {key_type.key_name}
                  </AutocompleteItem>
                );
              })}
          </Autocomplete>
          <Input
            onChange={(e) => setPasswordName(e.target.value as string)}
            type="text"
            value={passwordName}
            label="Password Name"
          />
          <Input
            type="password"
            onChange={(e) => setPassword(e.target.value as string)}
            value={password}
            label="Password"
          />
          <Button
            onClick={async () => {
              if (!key?.key_value) return;
              let encrypted = Encryption.encrypt(password, key?.key_value);
              axios
                .post("/api/passwords/save", {
                  password: encrypted,
                  password_name: passwordName,
                  password_key_id: key.key_id,
                })
                .then(({ data }) => {
                  notify("Password Saved");
                });
            }}
            className="w-full h-full"
            color="danger"
            type="submit"
          >
            Save Password
          </Button>
        </div>
      </div>
      <Table aria-label="Example table with dynamic content" className="w-full">
        <TableHeader>
          <TableColumn>Password Name</TableColumn>
          <TableColumn>Password Key Name</TableColumn>
          <TableColumn>Key Status</TableColumn>
          <TableColumn>Password</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No Passwords Found">
          {passwords.map((password: any, index) => {
            return (
              <TableRow key={index}>
                <TableCell className="text-left">
                  {password.password_title}
                </TableCell>
                <TableCell className="text-left">
                  {
                    keys.filter((key) => {
                      if (key.key_id == password.password_key_id) {
                        return key;
                      }
                    })[0].key_name
                  }
                </TableCell>
                <TableCell className="text-left">
                  {keys.filter((key) => {
                    if (
                      key.key_loaded &&
                      key.key_id == password.password_key_id
                    ) {
                      return key;
                    }
                  }).length == 1 ? (
                    <Chip>Descrypted</Chip>
                  ) : (
                    <Chip>Encrypted</Chip>
                  )}
                </TableCell>
                <TableCell className="text-left">
                  {getPassword(password)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </CardHeader>
  );
}
