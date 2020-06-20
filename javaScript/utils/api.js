import { DeviceEventEmitter } from 'react-native';
import { DEVELOPER, PRIVATE_KEY, UA_ID } from './config';
import CryptoJS from 'crypto-js';
import toast from './toast';
import { AesDecrypt, buildStr, parameterTransform } from './util';
import * as U from 'karet.util';
import { store } from './store';
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

// 用户信息
function user () {
    return transformFetch('GET', '/user');
}

// app
function app () {
    return transformFetch('GET', '/app');
}

// 提现商品
function withdraw () {
    return transformFetch('GET', '/withdraw');
}

// 提现
function postWithdraw (withdraw_id, money, withdraw_type, account, name) {
    let data = {
        withdraw_id, money, withdraw_type
    };
    if (account && name) {
        data = Object.assign(data, { name, account });
    }
    return transformFetch('POST', '/withdraw', data);
}

// 提现列表
function withdrawLogs (page, size) {
    return transformFetch('GET', '/withdraw/logs', { page, size });
}

// 活动
function activity () {
    return transformFetch('GET', '/activity');
}

// 阿里云oss上传token
function uploadToken () {
    return transformFetch('GET', '/upload/token');
}

// 反馈
function feedback (feedback_type, content, images, contact) {
    return transformFetch('POST', '/feedback', { feedback_type, content, images, contact });
}

// 反馈记录
function getFeedback (page, size) {
    return transformFetch('GET', '/feedback', { page, size });
}

// 资金记录
function income (page, size, source) {
    let data = {
        page, size
    };
    if (source) {
        data = Object.assign(data, { source });
    }
    return transformFetch('GET', '/income', data);
}

const transformFetch = async (method, url, data = {}) => {
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

export { apiLogin, verifyCode, user, withdraw, postWithdraw, withdrawLogs, income, app, feedback, activity, getFeedback, uploadToken };
