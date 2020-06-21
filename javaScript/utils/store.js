import * as U from 'karet.util';
import asyncStorage from './asyncStorage';
import { DEFAULT_USER } from './data';

const localStore = {
    user: DEFAULT_USER,
    app: null,
    authorization: null,
    channel: 'default',
    banner: null,
    balance_rate: 10000,
};
const store = U.atom(localStore);

function setter (items = [], storage = false) {
    items.forEach(item => {
        U.set(U.view([item[0]], store), item[1]);
        storage && asyncStorage.setItem(item[0], item[1]);
    });
}

function getter (items = []) {
    const object = {};
    items.forEach(item => {
        const local = [...item.split('.')];
        const pop = [...local].pop();
        object[pop] = U.view(local, store);
    });
    return object;
}

function clear () {
    asyncStorage.clear();
    setter([
        ['user', DEFAULT_USER],
        ['app', null],
        ['authorization', null]
    ]);
}

export { store, setter, getter, clear };
