import * as CryptoJS from 'crypto-js';

export const Encrypt = (text, secretKey) => {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export const Decrypt = (ciphertext, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};


