"use client";

import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  CardHeader,
  Chip,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { toast } from "react-toastify";

import { useKeysContext } from "@/context/KeysContext";
import Encryption from "@/lib/encryption/client/Encryption";
import axios from "axios";
const extensionToMimeType = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  txt: "text/plain",
  // Add more extensions and corresponding MIME types as needed
};
export default function ManageData() {
  let notify = (message: string) => {
    toast(message);
  };

  const { keys } = useKeysContext();
  const [Loading, setLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState<{
    data: File;
    name: string;
  }>({
    data: new File([""], ""),
    name: "",
  });
  const [key, setKey] = useState<(typeof keys)[0]>();
  const [DataName, setDataName] = useState("");
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("/api/data").then(({ data }) => {
      setData(data);
    });
  }, []);
  const getData = (password: any) => {
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
      {Loading ? (
        <div className="fixed left-0 top-0 bg-[rgba(0,0,0,0.2)] flex items-center justify-center h-screen w-screen">
          <Spinner />
        </div>
      ) : null}
      <h1 className="text-3xl font-bold text-left">Data Management</h1>
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
            onChange={(e) => setDataName(e.target.value as string)}
            type="text"
            value={DataName}
            label="Data Name"
          />
          <Input
            aria-label="file"
            type="file"
            onChange={async (e) => {
              let files = e.target.files;
              let file;
              if (files) {
                file = files[0];
                if (file) {
                  setCurrentFile({
                    name: file.name + ".hnh",
                    data: file,
                  });
                }
              }
            }}
          />
          <Button
            onClick={async () => {
              if (!key?.key_value) return;
              let buffa = await currentFile.data.arrayBuffer();
              console.log(buffa)
              let buffer = Buffer.from(buffa);
              let encrypted = Encryption.encrypt(
                JSON.stringify(buffer),
                key?.key_value
              );
              let formData = new FormData();
              let file = new File([encrypted], currentFile.name);
              formData.append("file", file);
              formData.append("data_name", DataName);
              formData.append("data_key_id", key?.key_id.toString());
              axios.post("/api/data/save", formData).then(({ data }) => {
                notify("Data saved");
                axios.get("/api/data").then(({ data }) => {
                  setData(data);
                });
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
          <TableColumn>Data Name</TableColumn>
          <TableColumn>Data Key Name</TableColumn>
          <TableColumn>Key Status</TableColumn>
          <TableColumn>Data</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No Data Found">
          {data.map((file_data: any, index) => {
            return (
              <TableRow key={index}>
                <TableCell className="text-left">
                  {file_data.data_title}
                </TableCell>
                <TableCell className="text-left">
                  {
                    keys.filter((key) => {
                      if (key.key_id == file_data.data_key_id) {
                        return key;
                      }
                    })[0].key_name
                  }
                </TableCell>
                <TableCell className="text-left">
                  {keys.filter((key) => {
                    if (key.key_loaded && key.key_id == file_data.data_key_id) {
                      return key;
                    }
                  }).length == 1 ? (
                    <Chip>Descrypted</Chip>
                  ) : (
                    <Chip>Encrypted</Chip>
                  )}
                </TableCell>
                <TableCell className="text-left">
                  {keys.filter((key) => {
                    if (key.key_loaded && key.key_id == file_data.data_key_id) {
                      return key;
                    }
                  }).length == 0 ? (
                    <Chip>Need to decrypt</Chip>
                  ) : (
                    <Button
                      onClick={() => {
                        axios
                          .post("/api/data/", {
                            data_file_location: file_data.data_file_location,
                          })
                          .then(({ data }) => {
                            let file_data_decrypted = Encryption.decrypt(
                              data.file,
                              keys.filter((key) => {
                                if (
                                  key.key_loaded &&
                                  key.key_id == file_data.data_key_id
                                ) {
                                  return key;
                                }
                              })[0].key_value as string
                            );
                            let buff = Buffer.from(
                              JSON.parse(file_data_decrypted)
                            );
                            const blob = new Blob([buff]);
                            const blobUrl = window.URL.createObjectURL(blob);
                            let a = document.createElement("a");
                            document.body.appendChild(a);
                            a.download = file_data.data_file_location
                              .replace("/data/", "")
                              .replace(".hnh", "");
                            a.href = blobUrl;
                            a.click();
                            document.body.removeChild(a);
                            window.URL.revokeObjectURL(blobUrl);
                          });
                      }}
                      color="success"
                    >
                      Download
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </CardHeader>
  );
}
