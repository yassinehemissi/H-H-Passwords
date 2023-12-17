import * as CryptoJS from "crypto-js";

class Encryption {
  private static readonly iv: string = "1234567890123456"; // 16 characters

  static encrypt(data: string, key: string): string {
    const cipherText = CryptoJS.AES.encrypt(data, key);
    return cipherText.toString();
  }

  static decrypt(encryptedData: string, key: string): string {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key);
    console.log(decryptedBytes);
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
  }
}

export default Encryption;
