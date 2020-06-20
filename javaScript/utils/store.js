import * as U from 'karet.util';
import asyncStorage from './asyncStorage';

const localStore = {
    userPhone: 16620466044,
    userNickName: 'Ryan',
    userAvatar: 'https://ali.rn.libragx.com/avatar21.png',
    userInviteCode: '4sada54da',
    authorization: null,
    userBalance: 0,
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

export { store, setter, getter };
