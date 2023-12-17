import * as crypto from "crypto";
import Encryption from "./Encryption";
import { m } from "framer-motion";

interface TKey {
  signature: string;
  key: string;
  keyName: string;
}

class Keys {
  public static generateRandomString(keySize: number): string {
    return crypto.randomBytes(keySize).toString("hex");
  }

  public static generateKey(keyName: string, masterPassword?: string): TKey {
    let signature = Keys.generateRandomString(32);

    let key = Keys.generateRandomString(120);

    return { key: key, signature: signature, keyName: keyName };
  }

  public static downloadKey(key: TKey) {
    const fileContent = JSON.stringify(key);
    const fileName = key.keyName + ".json";

    const blob = new Blob([fileContent]);
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    // Append the link to the body
    document.body.appendChild(link);

    // Trigger the click event to start the download
    link.click();

    // Remove the link from the body
    document.body.removeChild(link);
  }
}

export default Keys;
