import { activity, app, banner, getTask, signConfig, taskPlatform, taskReceiveDetail, user } from './api';
import { _tc, transformMoney } from './util';
import { setter } from './store';
import toast from './toast';
import { N } from './router';
import { dyCrack } from '../crack/dy';
export const updateUser = (callback) => {
    user().then(res => _tc(() => {
        if (!res.error && res.data) {
            const { data } = res;
            const { balance, today_income, total_income } = data;
            data.today_income = transformMoney(today_income);
            data.total_income = transformMoney(total_income);
            data.balance = transformMoney(balance);
            console.log(res, 'user');
            setter([['user', data]], true);
            callback && callback();
        }
    }));
};
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
