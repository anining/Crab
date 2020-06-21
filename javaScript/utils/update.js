import { activity, app, banner, signConfig, user } from './api';
import { _tc, transformMoney } from './util';
import { setter } from './store';
export const updateUser = () => {
    user().then(res => _tc(() => {
        if (!res.error && res.data) {
            const { data } = res;
            const { balance, today_income, total_income } = data;
            data.today_income = transformMoney(today_income);
            data.total_income = transformMoney(total_income);
            data.balance = transformMoney(balance);
            setter([['user', data]]);
        }
    }));
};
export const updateApp = () => {
    app().then(res => _tc(() => {
        if (!res.error && res.data) {
            console.log(res, 'app');
            setter([['app', formatAppInfo(res.data)]]);
        }
    }));
};
function formatAppInfo (app) {
    try {
        setter([['balance_rate', app.balance_rate || 1000]]);
        return app;
    } catch (e) {
        return app;
    }
}
export const updateBanner = () => {
    banner().then(res => _tc(() => {
        if (!res.error && res.data) {
            console.log(res, 'banner');
            setter([['banner', res.data]]);
        }
    }));
};
export const updateActivity = () => {
    activity().then(res => _tc(() => {
        if (!res.error && res.data) {
            console.log(res, 'activity');
            setter([['activity', res.data]]);
            setter([['activityObj', formatActivity(res.data)]]);
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
            setter([['signConfig', formatSignConfig(res.data)]]);
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
