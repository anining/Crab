import { DeviceEventEmitter } from 'react-native';
import { DEVELOPER, PRIVATE_KEY, UA_ID } from './config';
import CryptoJS from 'crypto-js';
import toast from './toast';
import { AesDecrypt, buildStr, parameterTransform } from './util';
import * as U from 'karet.util';
import store from './store';
import { N } from './router';

// login
function login (code) {
    return transformFetch('POST', '/login', { code });
}

// 阿里云上传
function uploadImage (bucket, upload_dir) {
    return transformFetch('GET', 'upload/token', { bucket, upload_dir });
}

const transformFetch = async (method, url, data) => {
    DeviceEventEmitter.emit('loadingShow');
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
        Promise.race([
            new Promise((resolve, reject) => {
                setTimeout(() => reject(new Error({ error: 999, msg: '请求失败' })), 10000);
            }),
            // eslint-disable-next-line no-async-promise-executor
            new Promise(async (resolve, reject) => {
                try {
                    const FETCH_DATA = await fetch(parameterTransform(method, url, data), request);
                    const DATA_TEXT = await FETCH_DATA.text();
                    const localDate = DEVELOPER === 'Production' ? JSON.parse(AesDecrypt(DATA_TEXT)) : JSON.parse(DATA_TEXT);
                    DeviceEventEmitter.emit('loadingHidden');
                    resolve(localDate);
                } catch (e) {
                    DeviceEventEmitter.emit('loadingHidden');
                }
            }),
        ])
            .then(response => response);
    } catch (e) {
        DeviceEventEmitter.emit('loadingHidden');
        if (e.error === 999) {
            N.navigate('ErrorPage');
        }
        toast('请求失败!');
        return { error: 999, msg: '请求失败' };
    }
};

export { login, uploadImage };
