import { PermissionsAndroid, Linking, Animated, Platform, YellowBox } from 'react-native';
import { store } from './store';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';
import * as U from 'karet.util';
import { N } from './router';
import CryptoJS from 'crypto-js';
import RN_FS from 'react-native-fs';
import { API_URL, CONSOLE_LOG, PRIVATE_KEY } from './config';
import { BALANCE_RATE } from './data';
import { setDefaultGlobal } from '../global/global';
import Clipboard from '@react-native-community/clipboard';
import toast from './toast';
import moment from 'moment';

const initializationStore = keys => {
    const localStore = store.get();
    keys = [...keys, [{ channel: 'default' }]];
    keys.forEach(key => {
        localStore[key[0]] = JsonParse(key[1]);
    });
    U.set(store, localStore);
    setDefaultGlobal(localStore);
};

export function JsonParse (value, maxNumber = 5) {
    let ret = value;
    for (let i = 0; i < maxNumber; i++) {
        try {
            ret = JSON.parse(ret);
        } catch (e) {
            break;
        }
    }
    return ret;
}

export function setConsole () {
    try {
        if (!CONSOLE_LOG) {
            console.log = () => {
            };
        }
        console.error = () => {
        };
        console.warn = () => {
        };
        console.info = () => {
        };
        console.debug = () => {
        };
        YellowBox.ignoreWarnings(['Remote debugger']);
        console.disableYellowBox = true;
    } catch (e) {
        console.log(e);
    }
}

/**
 * @Description fetch parameter transform
 * @param  method 请求方法
 * @param  key URL参数字符串的前缀
 * @param parameter 将要转为URL参数字符串的对象
 * @return string URL参数字符串
 * @author JinPing Tan 2020/3/30
 */
const parameterTransform = (method, key, parameter) => {
    if (method === 'POST' || method === 'PUT') {
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
        return JsonParse(decryptedStr.toString());
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

export function saveBase64ImageToCameraRoll (base64Img, success, fail) {
    try {
        const dirs = Platform.OS === 'ios' ? RN_FS.LibraryDirectoryPath : RN_FS.ExternalDirectoryPath; // 外部文件，共享目录的绝对路径（仅限android）
        const downloadDest = `${dirs}/${(Math.random() * 10000000) | 0}.png`;
        RNFetchBlob.fs.writeFile(downloadDest, base64Img, 'base64').then(async rst => {
            try {
                await requestPermission(() => {
                    CameraRoll && CameraRoll.saveToCameraRoll(downloadDest)
                        .then(() => {
                            success && success();
                        })
                        .catch(() => {
                            fail && fail();
                        });
                });
            } catch (err) {
                fail && fail();
            }
        });
    } catch (e) {
        console.log(e);
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

export function getUrl (src) {
    try {
        const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
        const srcMatch = src.match(reg);
        if (srcMatch == null) {
            return '';
        } else {
            return srcMatch[0];
        }
    } catch (e) {
        return '';
    }
}

function transformMoney (money, digits = 2) {
    try {
        return unitConversion(toGoldCoin(money), digits);
    } catch (e) {
        return 0;
    }
}

export function toGoldCoin (money) {
    try {
        if (isNaN(money)) {
            return 0;
        }
        return (money * BALANCE_RATE);
    } catch (e) {
        return 0;
    }
}
export function unitConversion (gold, digits = 2) {
    try {
        if (isNaN(gold)) {
            return 0;
        }
        if (gold >= 10000) {
            return `${_toFixed(gold / 10000, digits)}w`;
        }
        return _toFixed(gold, digits);
    } catch (e) {
        return 0;
    }
}
function transformTime (time) {
    try {
        return moment(djangoTime(time)).format('MM-DD HH:mm');
        // YYYY-MM-DD HH:mm:ss
    } catch (e) {
        return '00:00:00';
    }
}

export function _copyStr (str) {
    try {
        if (typeof str === 'string' || typeof str === 'number') {
            Clipboard.setString(str.toString());
            toast('复制成功');
        }
    } catch (e) {
        console.log(e);
    }
}
export const AppAllPermissionsAndroid = [PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.CALL_PHONE];
function requestPermission (success, denied, PermissionsList = [PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]) {
    try {
        if (Platform.OS === 'ios') {
            success && success();
        } else {
            const grantedStr = PermissionsAndroid.RESULTS.GRANTED;
            PermissionsAndroid.requestMultiple(PermissionsList).then(granted => {
                if (granted === grantedStr) {
                    success && success();
                } else {
                    let toDoSuccess = true;
                    for (const i in granted) {
                        if (granted[i] !== grantedStr) {
                            toDoSuccess = false;
                            break;
                        }
                    }
                    if (toDoSuccess) {
                        success && success();
                        return false;
                    }
                    denied && denied();
                }
            });
        }
    } catch (err) {
        console.warn(err);
        denied && denied();
    }
}

// 防抖函数
export function _debounce (func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        if (timeout) {
            timeout = clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            timeout = clearTimeout(timeout);
            func.apply(context, args);
        }, wait);
    };
}

export function djangoTime (timeString) {
    try {
        if (typeof timeString === 'number') {
            return timeString;
        }
        timeString = timeString.toString();
        if (timeString.indexOf('.') < 0) {
            timeString += '.000';
        }
        const str = timeString.slice(0, -7);
        const ret = str.replace('T', ' ').replace(/-/g, '/');
        return ret + ' GMT+08:00';
    } catch (e) {
        console.log(e);
    }
}

export function msecsTransform (msecs) {
    if (msecs < 0) {
        return '00:00:00';
    }
    if (msecs / 3600000 > 1) {
        const hour = Math.floor(msecs / 3600000);
        const minute = Math.floor((msecs % 3600000) / 60000);
        const scend = Math.floor((msecs % 60000) / 1000);
        return `${hour > 9 ? hour : '0' + hour}:${
            minute > 9 ? minute : '0' + minute
        }:${scend > 9 ? scend : '0' + scend}`;
    } else {
        const minute = Math.floor(msecs / 60000);
        const scend = Math.floor((msecs % 60000) / 1000);
        return `00:${minute > 9 ? minute : '0' + minute}:${
            scend > 9 ? scend : '0' + scend
        }`;
    }
}

export function _tc (fn, err) {
    try {
        if (fn && typeof fn === 'function') {
            fn();
        } else {
            return null;
        }
    } catch (e) {
        console.log(JSON.stringify(e));
        if (err && typeof err === 'function') {
            err(e);
        } else {
            return err;
        }
    }
}

export function _gv (obj, str, defaultValue) {
    try {
        let ret = '';
        let nowObj = obj;
        for (let i = 0; i < [...str.split('.')].length; i++) {
            const key = [...str.split('.')][i];
            if (key in nowObj) {
                if (key === [...str.split('.')].pop()) {
                    ret = nowObj[key];
                } else {
                    nowObj = nowObj[key];
                }
            } else {
                break;
            }
        }
        return ret;
    } catch (e) {
        return defaultValue || '';
    }
}

export async function bannerAction (action, link, label) {
    switch (action) {
    // app 跳转内部页面
    case 1: N.navigate(link); break;
    // 到webview页面加载活动
    case 2: N.navigate('WebViewPage', { url: link, title: label || '活动' }); break;
    default:Linking.openURL(link).catch(e => console.log(e));
    }
}

export function setAndroidTime (callback, duration = 1000) {
    let timer;
    try {
        if (duration > 0) {
            timer = Animated.timing(new Animated.Value(0), {
                toValue: 1,
                duration: duration,
                useNativeDriver: true,
            }).start(() => {
                if (callback && typeof callback === 'function') {
                    callback();
                }
                if (timer && timer.stop && typeof timer.stop === 'function') {
                    timer.stop();
                }
                timer = null;
            });
        }
        return {
            stop: () => {
                if (timer && timer.stop && typeof timer.stop === 'function') {
                    timer.stop();
                }
                callback && (callback = null);
            }
        };
    } catch (e) {
        console.log(e);
    }
}

export function _toFixed (number, num = 2) {
    try {
        return Number(number).toFixed(num);
    } catch (e) {
        return 0;
    }
}

export function rangeLevel (level, rangeArray) {
    try {
        let grade = 1;
        for (let i = 0; i < rangeArray.length; i++) {
            const item = rangeArray[i];
            console.log(level, item, '==321');
            if (level <= item) {
                grade = i;
                break;
            }
            if ((i === rangeArray.length - 1) && (level >= item)) {
                grade = i;
            }
        }
        return grade || 1;
    } catch (e) {
        return 1;
    }
}

export { getRequestParameter, requestPermission, transformTime, initializationStore, buildStr, parameterTransform, AesDecrypt, transformMoney };
