import { DeviceEventEmitter } from 'react-native';
import { DEVELOPER, PRIVATE_KEY, UA_ID } from './config';
import CryptoJS from 'crypto-js';
import toast from './toast';
import { AesDecrypt, buildStr, parameterTransform } from './util';
import * as U from 'karet.util';
import { store } from './store';
import { N } from './router';

// login
export function apiLogin (phone, code, invite_code) {
    let data = {
        phone, code
    };
    if (invite_code) {
        data = Object.assign(data, { invite_code });
    }
    return transformFetch('POST', '/login', data);
}

// 发送验证码
export function verifyCode (phone, scene = 'login') {
    return transformFetch('POST', '/verify/code', { phone, scene });
}

// 用户信息
export function user () {
    return transformFetch('GET', '/user');
}

// 用户信息
export function app () {
    return transformFetch('GET', '/app');
}

// banner
export function banner () {
    return transformFetch('GET', '/banner');
}

// 提现商品
export function withdraw () {
    return transformFetch('GET', '/withdraw');
}

// 提现
export function postWithdraw (withdraw_id, money, withdraw_type, account, name) {
    let data = {
        withdraw_id, money, withdraw_type
    };
    if (account && name) {
        data = Object.assign(data, { name, account });
    }
    return transformFetch('POST', '/withdraw', data);
}

// 提现列表
export function withdrawLogs (page, size) {
    return transformFetch('GET', '/withdraw/logs', { page, size });
}

// 活动
export function activity (page = 1, size = 10) {
    return transformFetch('GET', '/activity', { page, size });
}

// 活动详情
export function activityDetail (activity_id) {
    return transformFetch('GET', '/activity/detail', { activity_id });
}

// 领取完成任务红包
export function getReceiveTaskAward () {
    return transformFetch('POST', '/activity/receive_task_award');
}

// 提取拼多多红包
export function getRedPackage () {
    return transformFetch('PUT', '/activity/red_package');
}

// 打开拼多多红包
export function openRedPackage () {
    return transformFetch('POST', '/activity/red_package');
}

// 拼多多红包跑马灯
export function redPackageLatest () {
    return transformFetch('POST', '/activity/red_package/latest');
}

// 新手任务
export function newUserTask () {
    return transformFetch('GET', '/newuser/task');
}

// 领取新手任务
export function getNewUserTask (new_user_task_id) {
    return transformFetch('POST', '/newuser/task', { new_user_task_id });
}

// 签到配置
export function signConfig () {
    return transformFetch('GET', '/sign/config');
}

// 签到记录
export function signLogs () {
    return transformFetch('GET', '/sign');
}

// 签到
export function sign () {
    return transformFetch('POST', '/sign');
}

// 任务大类别
export function taskPlatform () {
    return transformFetch('GET', '/task/platform');
}

// 躺赚详情
export function awardDetail () {
    return transformFetch('GET', '/children/award/detail');
}

// 领取徒弟提现奖励
export function getChildAward () {
    return transformFetch('POST', '/children/award/withdraw');
}

// 领取推手奖励
export function getPromoteAward () {
    return transformFetch('POST', '/children/award/promote');
}

// 绑定父级
export function bindParent () {
    return transformFetch('PUT', '/children/parent');
}

// 徒弟详情
export function childDetail () {
    return transformFetch('POST', '/children/detail');
}

// 阿里云oss上传token
export function uploadToken () {
    return transformFetch('GET', '/upload/token');
}

// 反馈
export function feedback (feedback_type, content, images, contact) {
    return transformFetch('POST', '/feedback', { feedback_type, content, images, contact });
}

// 反馈记录
export function getFeedback (page, size) {
    return transformFetch('GET', '/feedback', { page, size });
}

// 小黑屋
export function userBaned (page, size) {
    return transformFetch('GET', '/user/baned', { page, size });
}

// 接任务列表
export function taskReceive (page, size, status) {
    return transformFetch('GET', '/task/receive', { page, size, status });
}

// 资金记录
export function income (page, size, source) {
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
                localDate.error && toast(localDate.detail);
                resolve(localDate);
            }),
            // eslint-disable-next-line handle-callback-err
        ]).then(r => r).catch(err => {
            console.log(JSON.stringify(err));
            return { error: 999, msg: '请求失败' };
        });
    } catch (e) {
        if (e.error === 999) {
            N.navigate('ErrorPage');
        }
        toast('请求失败');
        return { error: 999, msg: '请求失败' };
    }
};
