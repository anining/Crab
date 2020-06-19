import { DeviceEventEmitter } from 'react-native';
import { DEVELOPER, PRIVATE_KEY, UA_ID } from './config';
import CryptoJS from 'crypto-js';
import toast from './toast';
import { AesDecrypt, buildStr, parameterTransform } from './util';
import * as U from 'karet.util';
import store from './store';
import { N } from './router';

// login
function apiLogin (phone, code, invite_code) {
    let data = {
        phone, code
    };
    if (invite_code) {
        data = Object.assign(data, { invite_code });
    }
    return transformFetch('POST', '/login', data);
}

// 发送验证码
function verifyCode (phone, scene = 'login') {
    return transformFetch('POST', '/verify/code', { phone, scene });
}

const transformFetch = async (method, url, data) => {
    const TIME_STAMP = Math.round(Date.now() / 1000).toString();
    const POST_DATA = JSON.stringify(data);
    const HEADER = new Headers({
        authorization: U.view(['authorization'], store).get(),
        'x-uaid': UA_ID,
        'x-timestamp': TIME_STAMP,
        'x-signature': CryptoJS.HmacSHA256((method === 'GET' ? buildStr(data) : POST_DATA) + '.' + TIME_STAMP, PRIVATE_KEY).toString(),
    });
    const request = { method, headers: HEADER };
    method !== 'GET' && (request.body = POST_DATA);
    try {
        return Promise.race([
            new Promise((resolve, reject) => {
                // 接口超时10s
                setTimeout(() => reject(new Error({ error: 999, msg: '请求失败' })), 10000);
            }),
            // eslint-disable-next-line no-async-promise-executor
            new Promise(async (resolve, reject) => {
                const FETCH_DATA = await fetch(parameterTransform(method, url, data), request);
                const DATA_TEXT = await FETCH_DATA.text();
                const localDate = DEVELOPER === 'Production' ? JSON.parse(AesDecrypt(DATA_TEXT)) : JSON.parse(DATA_TEXT);
                resolve(localDate);
            }),
        ])
            .then(r => r);
    } catch (e) {
        if (e.error === 999) {
            N.navigate('ErrorPage');
        }
        toast('请求失败');
        return { error: 999, msg: '请求失败' };
    }
};

export { apiLogin, verifyCode };
