import {
    activity,
    app,
    banner,
    getSecondIncome,
    getTask,
    gradeSetting,
    taskReceiveDetail,
    signConfig,
    taskPlatform,
    user,
    getNextRedLevel,
    account, withdrawLogsLatest,
} from './api';
import { _tc, _toFixed, rangeLevel, toGoldCoin, transformMoney } from './util';
import { getter, setter } from './store';
import { getGlobal, getPath } from '../global/global';
import asyncStorage from './asyncStorage';

import toast from './toast';
import { N } from './router';
let nextUpdateUserTime = null;
const updateUserRate = 5;
export const updateUser = (callback) => {
    return new Promise((resolve, reject) => {
        if (!nextUpdateUserTime || (nextUpdateUserTime <= +new Date())) {
            nextUpdateUserTime = +new Date() + 1000 * updateUserRate; // updateUserRate秒之内不允许更新user
            user().then(res => _tc(() => {
                resolve();
                if (!res.error && res.data) {
                    console.log(res, 'user');
                    setter([['user', formatUserInfo(res.data)]], true);
                    callback && callback();
                }
            }));
        } else {
            resolve();
        }
    });
};
export const updateAccount = (callback) => {
    return new Promise((resolve, reject) => {
        account().then(r => {
            resolve();
            !r.error && setter([['accounts', r.data]], true);
            callback && callback();
        });
    });
};
function formatUserInfo (data) {
    try {
        const { gradeSetting, gradeRange } = getter(['gradeSetting', 'gradeRange']);
        const gradeSettingObj = gradeSetting.get() || {};
        const { balance, today_income, total_income } = data;
        data.today_income = transformMoney(today_income);
        data.total_income = transformMoney(total_income);
        data.goldCoin = toGoldCoin(data.balance); // 0.01 * 1000
        data.balance = transformMoney(balance);
        const propNums = data.prop_nums || [];
        const propNumsObj = {};
        propNums.forEach(item => {
            propNumsObj[item.prop__prop_type] = item.count;
        });
        data.trCorrectRate = _toFixed(data.correct_rate * 100) + '%';
        data.propNumsObj = propNumsObj;
        data.myGradeLevel = rangeLevel(getPath(['user_level', 'level_num'], data, 1), gradeRange.get());
        data.myGrade = gradeSettingObj[data.myGradeLevel];
        return data;
    } catch (e) {
        return data;
    }
}
export const updateApp = () => {
    return new Promise((resolve, reject) => {
        app().then(res => _tc(() => {
            resolve();
            if (!res.error && res.data) {
                console.log(res, 'app');
                setter([['app', (res.data)]], true);
            }
        }));
    });
};

export const updateBanner = () => {
    return new Promise((resolve, reject) => {
        banner().then(res => _tc(() => {
            resolve();
            if (!res.error && res.data) {
                console.log(res, 'banner');
                setter([['banner', res.data]], true);
            }
        }));
    });
};
export const updateActivity = () => {
    return new Promise((resolve, reject) => {
        activity().then(res => _tc(() => {
            resolve();
            if (!res.error && res.data) {
                console.log(res, 'activity');
                setter([['activity', res.data]]);
                setter([['activityObj', formatActivity(res.data)]], true);
            }
        }));
    });
};
function formatActivity (list) {
    try {
        const obj = {};
        list.forEach((item) => {
            obj[item.category] = item;
        });
        return obj;
    } catch (e) {
        return {};
    }
}
export const getSignConfig = () => {
    return new Promise((resolve, reject) => {
        signConfig().then(res => _tc(() => {
            resolve();
            if (!res.error && res.data) {
                console.log(res, 'signConfig');
                setter([['signConfig', formatSignConfig(res.data)]], true);
            }
        }));
    });
};
function formatSignConfig (config) {
    try {
        const obj = {};
        config.forEach((item) => {
            obj[item.day] = item;
        });
        return obj;
    } catch (e) {
        return {};
    }
}
export const getTaskPlatform = () => {
    return new Promise((resolve, reject) => {
        taskPlatform().then(res => _tc(() => {
            console.log(res, 'taskPlatform');
            resolve();
            if (!res.error && res.data) {
                setter([['taskPlatform', (res.data)]], true);
            }
        }));
    });
};
function taskDetail (receive_task_id) {
    taskReceiveDetail(receive_task_id).then(r => {
        if (r.error) {
            toast(r.msg || '当前做任务人数过多！稍后再试！');
        } else {
            const { data: detail } = r;
            N.navigate('TaskDetailPage', { detail, account: undefined });
        }
    });
}
export function task (category, receive_task_id) {
    if (category) {
        getTask(category).then(r => {
            if (r.error) {
                toast(r.msg || '当前做任务人数过多！稍后再试！');
                error === 9 && N.navigate('AccountHomePage');
            } else {
                taskDetail(r.data.receive_task_id);
            }
        });
    } else {
        taskDetail(receive_task_id);
    }
}
export const getGradeSetting = () => {
    return new Promise((resolve, reject) => {
        gradeSetting().then(res => _tc(() => {
            console.log(res, 'getGradeSetting');
            resolve();
            if (!res.error && res.data) {
                setter([['gradeSetting', (formatGrade(res.data))]], true);
                setter([['gradeRange', (formatGradeRange(res.data))]], true);
            }
        }));
    });
};
function formatGrade (array) {
    try {
        const gradeObj = {};
        let baseIncome = null;
        array.forEach(item => {
            if (!baseIncome) {
                baseIncome = item.second_income;
            }
            const incomeRate = item.second_income / baseIncome;
            if (incomeRate) {
                item.incomeRate = _toFixed((incomeRate) * 100, 0) + '%';
            } else {
                item.incomeRate = '100%';
            }
            gradeObj[item.grade] = item;
        });
        return gradeObj;
    } catch (e) {
        return {};
    }
}
function formatGradeRange (array) {
    try {
        return array.map(item => item.level);
    } catch (e) {
        return [];
    }
}

export function updateSecondIncome () {
    return new Promise((resolve, reject) => {
        getSecondIncome().then(res => {
            resolve();
            const coin = getPath(['data', 'balance'], res);
            if (coin) {
                asyncStorage.setItem(`${getPath(['phone'], getGlobal('user'))}coin`, {
                    coin: toGoldCoin(coin),
                    time: +new Date(),
                    mastUpdate: true
                });
            }
        });
    });
}

export function updateNextRedLevel () {
    return new Promise((resolve, reject) => {
        getNextRedLevel().then(res => {
            resolve();
            if (res && !res.error && res.data) {
                setter([['nextRedLevel', getPath(['data', 'next_red_level'], res)]], true);
            }
        });
    });
}

export function getWithdrawLatest () {
    return new Promise((resolve, reject) => {
        withdrawLogsLatest().then(res => {
            resolve();
            if (res && !res.error && res.data) {
                setter([['withdrawLogsLatest', getPath(['data'], res)]], true);
            }
        });
    });
}
