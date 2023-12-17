"use client";
import { MdDelete } from "react-icons/md";
import Keys from "@/lib/encryption/client/Keys";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  CardHeader,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import React, { ReactNode, useContext, useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineFileUpload } from "react-icons/md";
import { useSession } from "next-auth/react";
import { KeysContext, useKeysContext } from "@/context/KeysContext";
import Encryption from "@/lib/encryption/client/Encryption";
import type { KeyType } from "@/context/KeysContext";
import { toast } from "react-toastify";

export default function ManageKeys() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { keys, setKeys } = useKeysContext();
  const [currentKeyLoading, setCurrentKeyLoading] = useState<KeyType | null>(
    null
  );
  const [currentGenerationOption, setCurrentGenerationOption] = useState<
    string | boolean
  >(false);
  const [currentFile, setCurrentFile] = useState({
    signature: "",
    key: "",
    keyName: "",
  });

  let notify = (message: string) => {
    toast(message);
  };
  const [masterPassword, setMasterPassword] = useState("");
  const [keyName, setKeyName] = useState("");
  const { data: session, status } = useSession();
  const KEY_TYPES: { [key: string]: ReactNode } = {
    "Master Password": (
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-2 items-start justify-start"
      >
        <Input
          onChange={(e) => setKeyName(e.target.value as string)}
          type="text"
          value={keyName}
          label="Key Name"
        />
        <Input
          type="password"
          onChange={(e) => setMasterPassword(e.target.value as string)}
          value={masterPassword}
          label="Master Password"
        />
        <Button
          onClick={async () => {
            // generating data and encrypting it with master password
            // to see if the encryption is done
            let signature = Encryption.encrypt(
              Keys.generateRandomString(10),
              masterPassword
            );
            axios
              .post("/api/keys", {
                key_signature: signature,
                key_name: keyName,
                key_type: 0,
                key_owner: session?.user?.email,
              })
              .then(({ data }) => {
                notify("Key Added");
                setKeys([...keys, data]);
              });
          }}
          className="w-full"
          color="danger"
          type="submit"
        >
          Save Key
        </Button>
      </form>
    ),
    "H&H Key (Downloadable)": (
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-2 items-start justify-start"
      >
        <Input
          onChange={(e) => setKeyName(e.target.value as string)}
          type="text"
          value={keyName}
          label="Key Name"
        />
        <Button
          onClick={() => {
            const newKey = Keys.generateKey(keyName);
            axios
              .post("/api/keys", {
                key_signature: newKey.signature,
                key_name: keyName,
                key_type: 1,
                key_owner: session?.user?.email,
              })
              .then(({ data }) => {
                notify("Key Added");
                Keys.downloadKey(newKey);
                setKeys([...keys, data]);
              });
          }}
          className="w-full"
          color="danger"
          type="submit"
        >
          Save Key
        </Button>
      </form>
    ),
  };
  return (
    <CardHeader className="flex flex-col justify-start items-start gap-0 p-5">
      <h1 className="text-3xl font-bold text-left">Key Management</h1>
      <div className="my-5 flex flex-col justify-start item-start text-left gap-2">
        <h2>Generate a Key:</h2>
        <Autocomplete
          onSelectionChange={(key_type) => {
            setCurrentGenerationOption(key_type as string);
            setKeyName("");
            setMasterPassword("");
          }}
          label="Select Key Type"
          className="max-w-xs"
        >
          {Object.keys(KEY_TYPES).map((key_type) => (
            <AutocompleteItem
              className="text-white"
              key={key_type}
              value={key_type}
            >
              {key_type}
            </AutocompleteItem>
          ))}
        </Autocomplete>
        {currentGenerationOption
          ? (KEY_TYPES[currentGenerationOption as string] as React.ReactNode)
          : null}
      </div>
      <Divider />
      <div className="my-5 flex flex-col justify-start item-start text-left gap-2 w-full">
        <h2>Load a Key:</h2>
        <Table
          aria-label="Example table with dynamic content"
          className="w-full"
        >
          <TableHeader>
            <TableColumn>Key Name</TableColumn>
            <TableColumn>Key Type</TableColumn>
            <TableColumn>Key Status</TableColumn>
            <TableColumn>Key Options</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No Keys Loaded">
            {keys.map((key, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{key.key_name}</TableCell>
                  <TableCell>{key.key_type}</TableCell>
                  <TableCell>
                    <Chip
                      className="capitalize"
                      color={key.key_loaded ? "success" : "danger"}
                      size="sm"
                      variant="flat"
                    >
                      {key.key_loaded ? "Loaded" : "Not Loaded"}
                    </Chip>
                  </TableCell>
                  <TableCell className="flex justify-center items-center">
                    {key.key_loaded ? (
                      <Tooltip color="danger" content="Unload Key">
                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                          <MdDelete
                            onClick={() => {
                              let neo_keys = [...keys];
                              neo_keys = neo_keys.map((key2) => {
                                if (key2.key_id == key.key_id) {
                                  key2.key_signature = "";
                                  key2.key_loaded = false;
                                  key2.key_value = "";
                                }
                                return key2;
                              });
                              notify("Key Unloaded");
                              setKeys(neo_keys);
                            }}
                            color="red"
                          />
                        </span>
                      </Tooltip>
                    ) : (
                      <Tooltip color="success" content="Load Key">
                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                          <MdOutlineFileUpload
                            onClick={() => {
                              setCurrentKeyLoading(key);
                              onOpen();
                            }}
                            color="green"
                          />
                        </span>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Modal
          className="text-white"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Loading Key
                </ModalHeader>
                <ModalBody>
                  <h1>
                    <span className="font-bold">Key Name: </span>
                    {currentKeyLoading?.key_name}
                  </h1>
                  {currentKeyLoading != null ? (
                    currentKeyLoading?.key_type == 0 ? (
                      <Input
                        type="password"
                        onChange={(e) =>
                          setMasterPassword(e.target.value as string)
                        }
                        value={masterPassword}
                        label="Master Password"
                      />
                    ) : (
                      <Input
                        aria-label="file input"
                        type="file"
                        onChange={async (e) => {
                          let files = e.target.files;
                          let file;
                          if (files) {
                            file = files[0];
                            if (file) {
                              const text = await file.text();

                              setCurrentFile(JSON.parse(text));
                            }
                          }
                        }}
                      />
                    )
                  ) : null}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onPress={() => {
                      axios
                        .post("/api/keys/verification", {
                          key_name: currentKeyLoading?.key_name,
                        })
                        .then(({ data }) => {
                          if (data.key_signature) {
                            if (currentKeyLoading?.key_type == 0) {
                              let decryption = Encryption.decrypt(
                                data.key_signature,
                                masterPassword
                              );
                              if (decryption.length != 0) {
                                let neo_keys = [...keys];
                                neo_keys = neo_keys.map((key) => {
                                  if (key.key_id == currentKeyLoading.key_id) {
                                    key.key_signature = data.key_signature;
                                    key.key_loaded = true;
                                    key.key_value = masterPassword;
                                  }
                                  return key;
                                });
                                notify("Key Loaded");
                                setKeys(neo_keys);
                              } else {
                                notify("Key Failed to load");
                              }
                            } else {
                              if (currentFile.signature == data.key_signature) {
                                let neo_keys = [...keys];
                                neo_keys = neo_keys.map((key) => {
                                  if (key.key_id == currentKeyLoading?.key_id) {
                                    key.key_signature = data.key_signature;
                                    key.key_loaded = true;
                                    key.key_value = currentFile.key;
                                  }
                                  return key;
                                });
                                notify("Key Loaded");
                                setKeys(neo_keys);
                              } else {
                                notify("Key Failed to load");
                              }
                            }
                          }
                        });
                      onClose();
                    }}
                  >
                    Load
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </CardHeader>
  );
}
