import * as U from 'karet.util';
import asyncStorage from './asyncStorage';

const localStore = {
    userPhone: '未登录',
    userNickName: '未登录',
    userAvatar: 'https://ali.rn.libragx.com/avatar21.png',
    userInviteCode: '4sada54da',
    authorization: null,
    userBalance: 0,
    userTodayIncome: 0,
    userTotalIncome: 0,
    channel: 'master',
    userId: '',
};

const store = U.atom(localStore);

function setter (items = [], storage = true) {
    items.forEach(item => {
        U.set(U.view([item[0]], store), item[1]);
        storage && asyncStorage.setItem(item[0], item[1]);
    });
}

function getter (items = []) {
    const object = {};
    items.forEach(item => {
        object[item] = U.view([item], store);
    });
    return object;
}

function clear () {
    asyncStorage.clear();
    setter([
        ['userPhone', '未登录'],
        ['userTodayIncome', 0],
        ['userTotalIncome', 0],
        ['userBalance', 0],
        ['userNickName', '未登录'],
        ['userAvatar', 'https://ali.rn.libragx.com/avatar21.png'],
        ['userInviteCode', '未登录'],
        ['userId', '未登录']
    ]);
}

export { store, setter, getter, clear };
