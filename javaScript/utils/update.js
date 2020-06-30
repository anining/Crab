import { activity, app, banner, getSecondIncome, gradeSetting, signConfig, taskPlatform, user } from './api';
import {_tc, _toFixed, rangeLevel, toGoldCoin, transformMoney} from './util';
import { getter, setter } from './store';

import { activity, app, banner, getTask, signConfig, taskPlatform, taskReceiveDetail, user } from './api';
import { _tc, transformMoney } from './util';
import { setter } from './store';
import toast from './toast';
import { N } from './router';
import { dyCrack } from '../crack/dy';
export const updateUser = (callback) => {
    user().then(res => _tc(() => {
        if (!res.error && res.data) {
            console.log(res, 'user');
            setter([['user', formatUserInfo(res.data)]], true);
            callback && callback();
        }
    }));
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
        data.myGrade = gradeSettingObj[rangeLevel(data.user_level, gradeRange.get())];
        return data;
    } catch (e) {
        return data;
    }
}
export const updateApp = () => {
    app().then(res => _tc(() => {
        if (!res.error && res.data) {
            console.log(res, 'app');
            setter([['app', (res.data)]], true);
        }
    }));
};

export const updateBanner = () => {
    banner().then(res => _tc(() => {
        if (!res.error && res.data) {
            console.log(res, 'banner');
            setter([['banner', res.data]], true);
        }
    }));
};
export const updateActivity = () => {
    activity().then(res => _tc(() => {
        if (!res.error && res.data) {
            console.log(res, 'activity');
            setter([['activity', res.data]]);
            setter([['activityObj', formatActivity(res.data)]], true);
        }
    }));
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
    signConfig().then(res => _tc(() => {
        if (!res.error && res.data) {
            console.log(res, 'signConfig');
            setter([['signConfig', formatSignConfig(res.data)]], true);
        }
    }));
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
    taskPlatform().then(res => _tc(() => {
        console.log(res, 'taskPlatform');
        if (!res.error && res.data) {
            setter([['taskPlatform', (res.data)]], true);
        }
    }));
};
function taskDetail (receive_task_id) {
    taskReceiveDetail(receive_task_id).then(r => {
        if (r.error) {
            toast(r.msg || '当前做任务人数过多！稍后再试！');
        } else {
            const { data: detail } = r;
            const { home_url, platform_category } = detail;
            if (platform_category === 1) {
                dyCrack(home_url).then(account => {
                    console.log(account);
                    N.navigate('TaskDetailPage', { detail, account: account.liked ? account : undefined });
                }).catch(e => {
                    N.navigate('TaskDetailPage', { detail, account: undefined });
                });
            } else {
                N.navigate('TaskDetailPage', { detail, account: undefined });
            }
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
    gradeSetting().then(res => _tc(() => {
        console.log(res, 'getGradeSetting');
        if (!res.error && res.data) {
            setter([['gradeSetting', (formatGrade(res.data))]], true);
            setter([['gradeRange', (formatGradeRange(res.data))]], true);
        }
    }));
};
function formatGrade (array) {
    try {
        const gradeObj = {};
        array.forEach(item => {
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
    getSecondIncome().then(res => {
        console.log(res, '领取的金币');
    });
}
