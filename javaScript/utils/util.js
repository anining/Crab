import store from './store';
import * as U from 'karet.util';
import CryptoJS from 'crypto-js';
import toast from './toast';
import {DEVELOPER, UA_ID, API_URL, PRIVATE_KEY} from './config';

const initializationStore = keys => {
  const localStore = store.get();
  keys.forEach(key => {
    localStore[key[0]] = key[1];
  });
  U.set(store, localStore);
};

const transformFetch = async (method, url, data, showError = true) => {
  // DeviceEventEmitter.emit('loadShow');
  const TIME_STAMP = Math.round(Date.now() / 1000).toString();
  const POST_DATA = JSON.stringify(data);
  const HEADER = new Headers({
    'authorization': localStorage.getItem('loggedIn'),
    'x-uaid': UA_ID, 'x-timestamp': TIME_STAMP,
    'x-signature': CryptoJS.HmacSHA256((method === 'GET' ? buildStr(data) : POST_DATA) + '.' + TIME_STAMP, PRIVATE_KEY).toString(),
  });
  let request = {method, headers: HEADER};
  method !== 'GET' && (request['body'] = POST_DATA);
  try {
    Promise.race([
      new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error({error: 999, msg: '请求失败'})), 8000);
      }),
      new Promise(async (resolve, reject) => {
        const FETCH_DATA = await fetch(parameterTransform(method, url, data), request);
        const DATA_TEXT = await FETCH_DATA.text();
        const localDate = DEVELOPER === 'Production' ? JSON.parse(AesDecrypt(DATA_TEXT)) : JSON.parse(DATA_TEXT);
        resolve(localDate);
      }),
    ])
      .then(response => {
        if (showError && response && response.error) {
          // DeviceEventEmitter.emit('loadHide');
          toast(response.msg || '请求失败!');
        }
        return response;
      });
  } catch (e) {
    // DeviceEventEmitter.emit('loadHide');
    toast('请求失败!');
    return {error: 999, msg: '请求失败'};
  }
};

/**
 * @Description fetch parameter transform
 * @param  method 请求方法
 * @param  key URL参数字符串的前缀
 * @param parameter 将要转为URL参数字符串的对象
 * @return string URL参数字符串
 * @author JinPing Tan 2020/3/30
 */
const parameterTransform = (method, key, parameter) => {
  if (method !== 'GET') {
    return API_URL + key;
  }
  let parameterString = API_URL + key + '?';
  for (let param in parameter) {
    if (parameter.hasOwnProperty(param)) {
      parameterString += param + '=' + parameter[param] + '&';
    }
  }
  return parameterString.slice(0, -1);
};

const buildStr = data => {
  let signString = '';
  for (const item in data) {
    if (data.hasOwnProperty(item)) {
      signString += item + '=' + data[item] + '&';
    }
  }
  return signString.slice(0, -1);
};

//AES解密
const AesDecrypt = (word) => {
  try {
    let decrypt = CryptoJS.AES.decrypt(word, CryptoJS.enc.Base64.parse(PRIVATE_KEY), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedStr.toString());
  } catch (e) {
    console.log(word, e);
    return {};
  }
};

const getRequestParameters = () => {
  let search = window.location.search.replace(/^\?/, '').split('&');
  let params = {};
  for (let i = 0; i < search.length; i++) {
    let data = search[i].split('=');
    if (data.length >= 2) {
      params[data[0]] = data[1];
    }
  }
  return params;
};

const getRequestParameter = (key) => {
  let params = getRequestParameters();
  return params[key];
};

export {getRequestParameter, initializationStore, transformFetch};

