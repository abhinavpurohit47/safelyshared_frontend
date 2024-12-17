import CryptoJS, { enc } from 'crypto-js';
import axios from 'axios';

let encryptionKey = null;
const getCSRFToken = () => {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  };
  
export const fetchEncryptionKey = async () => {
  try {
    const csrfToken = getCSRFToken();
    const response = await axios.get('http://localhost:8000/api/get_aes/', {
        headers: {
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
    });
    encryptionKey = CryptoJS.enc.Hex.parse(response.data.key);
    return encryptionKey;
  } catch (error) {
    console.error('Error fetching encryption key:', error);
    throw new Error('Failed to fetch encryption key');
  }
};

export const encryptFileContent = (fileContent) => {
  if (!encryptionKey) {
    throw new Error('Encryption key is not set');
  }

  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(fileContent, encryptionKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    iv: iv.toString(CryptoJS.enc.Hex),
    ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
  };
};

export const decryptFileContent = (encryptedContent, iv, key) => {
    const keyHex = CryptoJS.enc.Hex.parse(key);
    console.log(keyHex,'keyHex')
    const ivHex = CryptoJS.enc.Hex.parse(iv);
    console.log(ivHex,'ivHex')
    const encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedContent);
    console.log(encryptedHexStr,'encryptedHexStr')
    const encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  
    const decrypted = CryptoJS.AES.decrypt(encryptedBase64Str, keyHex, {
      iv: ivHex,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
  
    return decrypted.toString(CryptoJS.enc.Utf8);
  };
