import { PermissionsAndroid } from 'react-native';
import { store } from './store';
import * as U from 'karet.util';
import CryptoJS from 'crypto-js';
import { API_URL, PRIVATE_KEY } from './config';

const initializationStore = keys => {
    const localStore = store.get();
    keys = [...keys, [{ channel: 'default' }]];
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
        // eslint-disable-next-line no-prototype-builtins
        if (parameter.hasOwnProperty(param)) {
            parameterString += param + '=' + parameter[param] + '&';
        }
    }
    return parameterString.slice(0, -1);
};

const buildStr = data => {
    let signString = '';
    for (const item in data) {
        // eslint-disable-next-line no-prototype-builtins
        if (data.hasOwnProperty(item)) {
            signString += item + '=' + data[item] + '&';
        }
    }
    return signString.slice(0, -1);
};

// AES解密
const AesDecrypt = word => {
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

export function formatStyle (style) {
    try {
        if (Array.isArray(style)) {
            let obj = {};
            style.forEach((item) => { obj = { ...obj, ...item }; });
            return obj;
        }
        return style;
    } catch (e) {
        return style;
    }
}

export function _if (value, callback, elseCallBack) {
    try {
        if (value && typeof callback === 'function') {
            return callback(value);
        } else {
            if (elseCallBack && typeof elseCallBack === 'function') {
                return elseCallBack();
            }
        }
    } catch (e) {
        console.log(e, '_if');
        return null;
    }
}

export function getValue (obj, key) {
    try {
        let vague;
        if (typeof obj !== 'object' || typeof key !== 'string') {
            return undefined;
        }
        for (const k in obj) {
            if (k === key) {
                vague = obj[k];
                break;
            } else {
                const val = getValue(obj[k], key);
                if (val) {
                    vague = val;
                    break;
                }
            }
        }
        return vague;
    } catch (e) {
        console.log(e, 'getValue');
    }
}

async function requestPermission (success, fail) {
    try {
        if (Platform.OS === 'ios') {
            if (success) {
                success();
            }
        } else {
            const granted = await PermissionsAndroid.requestMultiple(
                [
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                ],
            );
            if (granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED && granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED) {
                if (success) {
                    success();
                }
            } else {
                if (fail) {
                    fail();
                }
            }
        }
    } catch (err) {
        console.warn(err);
    }
}

export { getRequestParameter, requestPermission, initializationStore, buildStr, parameterTransform, AesDecrypt };
