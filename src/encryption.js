import CryptoJS from 'crypto-js';
import axios from 'axios';

let encryptionKey = null;

// Fetch the encryption key from the backend
export const fetchEncryptionKey = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/get_encryption_key/');
    encryptionKey = CryptoJS.enc.Hex.parse(response.data.key);
    return encryptionKey;
  } catch (error) {
    console.error('Error fetching encryption key:', error);
    throw new Error('Failed to fetch encryption key');
  }
};

// Encrypt file content using AES-256
export const encryptFileContent = (fileContent) => {
  if (!encryptionKey) {
    throw new Error('Encryption key is not set');
  }

  const iv = CryptoJS.lib.WordArray.random(16); // Generate random IV
  const encrypted = CryptoJS.AES.encrypt(fileContent, encryptionKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    iv: iv.toString(CryptoJS.enc.Hex), // Send IV along with the encrypted content
    ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
  };
};

// Decrypt file content using AES-256
export const decryptFileContent = (encryptedBase64, ivHex) => {
  if (!encryptionKey) {
    throw new Error('Encryption key is not set');
  }

  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const ciphertext = CryptoJS.enc.Base64.parse(encryptedBase64);

  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: ciphertext },
    encryptionKey,
    { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );

  return CryptoJS.enc.Utf8.stringify(decrypted);
};
