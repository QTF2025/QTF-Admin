import CryptoJS from 'crypto-js';
import localStoreData from './localstorage'
import { jwtDecode  } from 'jwt-decode';
import dayjs from 'dayjs';

export const aesEncrypt = (token: string) => {
    const decodedHeader: any = jwtDecode(token);
    const decryptData2 = (data: any) => {
        var C = CryptoJS;
        var Key = C.enc.Utf8.parse("THisIScuT0mEncK3yForDat8$ecurity");
        var IV = C.enc.Utf8.parse("THisIScuT0mEncK3");
        var decryptedText = C.AES.decrypt(data, Key, {
            iv: IV,
            mode: C.mode.CBC,
            padding: C.pad.Pkcs7
        });
        return decryptedText.toString(C.enc.Utf8);
    }
    const userData = JSON.parse(decryptData2(decodedHeader?.key)) ? JSON.parse(decryptData2(decodedHeader?.key)) : {}

    localStoreData.setUserData(userData);
    return userData;
}

export const convertToDate = (date: any) => {
    return dayjs(new Date(date.$d)).format('YYYY-MM-DD')
}

export const convertToDateYear = (date: any) => {
    return dayjs(new Date(date.$d)).format('YYYY')
}

export const isEmptyKeys = (dataObj: any, type: string, notValidate: string[]) => {
    const keys = Object.keys(dataObj)

    switch(type){
        case 'EMPTY_STRING':
            return !keys.some((key: any) => {
                if(!notValidate.includes(key)){
                    return dataObj[key] === ''
                }else{
                    return true;
                }
            })
        case 'UNDEFINED':
            return !keys.some((key: any) => {
                if(!notValidate.includes(key)){
                    return dataObj[key] === undefined
                }else{
                    return true;
                }
            })
        case 'ALL':
            return !keys.some((key: any) => {
                if(!notValidate.includes(key)){
                    return dataObj[key] === '' || dataObj[key] === null || dataObj[key] === undefined
                }else{
                    return true;
                }
            })
        default:
            return true

    }
}

export const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const formTailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export  const getLeadStatus = (id: any) => {
    let status;
    switch(id) {
        case '1':
            status = "Documents"
          return status;
        // case '2':
        //     status = "Preparation"
        //   return status;
        case '3':
            status = "Preparation"
          return status;
        case '4':
            status = "Payments"
          return status;
        case '6':
            status = "Filling"
          return status;
        case '7':
            status = "Completed"
          return status;
        default:
          return '';
      }
  }

  export const getTimeForTimeZone = (timeZone: any) => {
    return new Intl.DateTimeFormat('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        timeZone 
    }).format(new Date());
}

  export const getDateForTimeZone = (date: any, timeZone: any, type: string) => {
    const now = new Date(date);
    const cstOptions: any = {
        timeZone: timeZone, // Set the time zone to CST
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    };
    const cstTimeString = now.toLocaleString('en-US', cstOptions);
    const cstDate = new Date(cstTimeString);
    const cstISOString = cstDate.toISOString();

    if(type === 'END'){
        return cstISOString
    }else{
        const now1 = new Date(cstISOString)
        const cstTime = new Date(now1.getTime() - 8 * 60 * 60 * 1000);
        return cstTime.toISOString()
    }
}

export const generateTaxYearMonth = () => {
    const month = new Date().getMonth()
    if(month > 2){
        return true;
    }else{
        return false;
    }
}

export const downloadFile = (url: string) => {
  const a = window.document.createElement('a')
  a.href = url;
  window.document.body.appendChild(a)
  a.click()
  window.document.body.removeChild(a)
}

export const extractTextFromHTML = (html: any) => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;
        return tempElement.textContent || tempElement.innerText || '';
    };

export const HTMLDecode = (text: any) => {
  const doc = new DOMParser().parseFromString(text, 'text/html');
  return doc.documentElement.textContent;
}

export function convertToCSVText(text: any) {
  return text.replace(/<[^>]*>/g, ''); // Remove HTML tags
}

export const fileNames = (arr:any) => {
    const newstr =  arr?.replaceAll('//uploads','/uploads');
    const urlArray = newstr.split(',');
    return urlArray.map((url:any) => {
        const segments = url.split('/');
        const fileName = segments[segments.length - 1];
        return (
            <span key={fileName} style={{ marginRight: '10px' }}>
            <a href={url} target="_blank" rel="noopener noreferrer" key={fileName}>
                {fileName}
            </a>
            </span>
        );
    });
};