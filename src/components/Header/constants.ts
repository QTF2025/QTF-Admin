import localStorageContent from "../../utils/localstorage";
import CryptoJS from 'crypto-js';

export const aesEncrypt = (data: any) => {
    const decryptData2 = (data: any) => {
      var C = CryptoJS;
      var Key = C.enc.Utf8.parse("THisIScuT0mEncK3yForDat8$ecurity");
      var IV = C.enc.Utf8.parse("THisIScuT0mEncK3");
      var decryptedText = C.AES.decrypt(data, Key, {
        iv: IV,
        mode: C.mode.CBC,
        padding: C.pad.Pkcs7
      });
      // console.log('decoderrrdecry', decryptedText.toString(C.enc.Utf8));
      return decryptedText.toString(C.enc.Utf8);
    }
    var userData = JSON.parse(decryptData2(data))
    localStorageContent.setUserData(userData)
  }