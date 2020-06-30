import { DEVELOPER, PRIVATE_KEY, UA_ID } from './config';
import CryptoJS from 'crypto-js';
import toast from './toast';
import { _tc, AesDecrypt, buildStr, parameterTransform, setAndroidTime } from './util';
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

// 账号列表
export function account (platform_category) {
    return transformFetch('GET', '/account', platform_category && { platform_category });
}

// 取消绑定
export function deleteAccount (account_id) {
    return transformFetch('DELETE', '/account', { account_id });
}

// 账号绑定
export function postAccount (platform_category, home_url) {
    return transformFetch('POST', '/account', { platform_category, home_url });
}

// 账号切换
export function putAccount (platform_category, account_id) {
    return transformFetch('PUT', '/account', { platform_category, account_id });
}

// 帮助中心
export function helpCenter () {
    return transformFetch('GET', '/help_center');
}

// banner
export function banner () {
    return transformFetch('GET', '/banner');
}

// 提现商品
export function withdraw () {
    return transformFetch('GET', '/withdraw');
}

// 道具
export function prop () {
    return transformFetch('GET', '/prop/prop');
}

// 道具记录
export function propLogs () {
    return transformFetch('GET', '/prop/prop/logs');
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

// 提现跑马灯
export function withdrawLogsLatest (page = 1, size = 10) {
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
export function getReceiveTaskAward (level, activity_id) {
    return transformFetch('POST', '/activity/receive_task_award', { level, activity_id });
}

// 提取拼多多红包
export function getRedPackage (activity_id) {
    return transformFetch('PUT', '/activity/red_package', { activity_id });
}

// 打开拼多多红包
export function openRedPackage (activity_id) {
    return transformFetch('POST', '/activity/red_package', { activity_id });
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
export function uploadToken (bucket, upload_dir) {
    return transformFetch('GET', '/upload/token', { bucket, upload_dir });
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

// 接任务
export function getTask (task_platform_id) {
    return transformFetch('POST', '/task/receive', { task_platform_id });
}

// 提交任务
export function taskSubmit (receive_task_id, images, nickname) {
    return transformFetch('POST', '/task/submit', { receive_task_id, images, nickname });
}

// 接任务列表
export function taskReceive (page, size, status) {
    return transformFetch('GET', '/task/receive', { page, size, status });
}

// 接任务详情
export function taskReceiveDetail (receive_task_id) {
    return transformFetch('GET', '/task/receive/detail', { receive_task_id });
}

// 放弃任务
export function giveUp (receive_task_id) {
    return transformFetch('POST', '/task/giveup', { receive_task_id });
}

// 闯关题目
export function getGame () {
    return transformFetch('GET', '/game/level', {});
}
// 通关题目
export function passGame () {
    return transformFetch('POST', '/game/level', {});
}
// 错题记录
export function gameErrorLog () {
    return transformFetch('GET', '/game/error', {});
}

// 打错题目
export function gameError (idiom) {
    return transformFetch('POST', '/game/error', { idiom });
}

// 闯关
export function upgradeGameLevel (content) {
    return transformFetch('POST', '/game/level', { content });
}

// 等级配置
export function gradeSetting () {
    return transformFetch('GET', '/game/grade', { });
}

// 获取每秒奖励
export function getSecondIncome () {
    return transformFetch('POST', '/game/get_second_income', { });
}

// 生词本
export function getNoteBook () {
    return transformFetch('GET', '/notebook', { });
}

// 增加生词
export function addNoteBook (idiom) {
    return transformFetch('POST', '/notebook', { idiom });
}

// 删除生词
export function deleteNoteBook (notebook_id) {
    return transformFetch('DELETE', '/notebook', { notebook_id });
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
    try {
        const TIME_STAMP = Math.round(Date.now() / 1000).toString();
        const POST_DATA = JSON.stringify(data);
        const HEADER = new Headers({
            authorization: U.view(['authorization'], store).get(),
            'x-uaid': UA_ID,
            'x-timestamp': TIME_STAMP,
            'x-signature': CryptoJS.HmacSHA256(((method === 'GET' || method === 'DELETE') ? buildStr(data) : POST_DATA) + '.' + TIME_STAMP, PRIVATE_KEY).toString(),
        });
        const request = { method, headers: HEADER };
        (method === 'POST' || method === 'PUT') && (request.body = POST_DATA);
        let loadingEnd = false; // 是否执行完成
        return Promise.race([
            new Promise((resolve, reject) => {
                // 接口超时10s
                setAndroidTime(() => {
                    if (!loadingEnd) {
                        resolve({ error: 999, msg: '请求超时' });
                        toast('请求超时');
                        console.log(loadingEnd, '请求超时==', url, method, data);
                        loadingEnd = true;
                    }
                }, 8000);
            }),
            // eslint-disable-next-line no-async-promise-executor
            new Promise(async (resolve, reject) => {
                try {
                    const FETCH_DATA = await fetch(parameterTransform(method, url, data), request);
                    const DATA_TEXT = await FETCH_DATA.text();
                    console.log(DATA_TEXT);
                    const localDate = DEVELOPER === 'Production' ? JSON.parse(AesDecrypt(DATA_TEXT)) : JSON.parse(DATA_TEXT);
                    localDate.error && toast(localDate.msg);
                    if ('error' in localDate) {
                        resolve(localDate);
                    } else {
                        resolve({ error: 999, msg: '请求失败' });
                    }
                    loadingEnd = true;
                } catch (e) {
                    loadingEnd = true;
                    resolve({ error: 999, msg: '请求失败' });
                }
            })
        ]);
    } catch (e) {
        console.log(e);
    }
};
