import { NativeModules } from 'react-native';
import store from './store';
import * as U from 'karet.util';
import CryptoJS from 'crypto-js';
import { API_URL, PRIVATE_KEY } from './config';

const initializationStore = keys => {
    const localStore = store.get();
    keys = [...keys, [{ channel: '??' }]];
    keys.forEach(key => {
        localStore[key[0]] = key[1];
    });
    U.set(store, localStore);
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
    for (const param in parameter) {
        if (parameter.hasOwnProperty(param)) {
            parameterString += param + '=' + parameter[param] + '&'; '';
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

// AES解密
const AesDecrypt = (word) => {
    try {
        const decrypt = CryptoJS.AES.decrypt(word, CryptoJS.enc.Base64.parse(PRIVATE_KEY), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        });
        const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedStr.toString());
    } catch (e) {
        console.log(word, e);
        return {};
    }
};

const getRequestParameters = () => {
    const search = window.location.search.replace(/^\?/, '').split('&');
    const params = {};
    for (let i = 0; i < search.length; i++) {
        const data = search[i].split('=');
        if (data.length >= 2) {
            params[data[0]] = data[1];
        }
    }
    return params;
};

const getRequestParameter = (key) => {
    const params = getRequestParameters();
    return params[key];
};

export { getRequestParameter, initializationStore, buildStr, parameterTransform, AesDecrypt };
