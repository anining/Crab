import AsyncStorage from '@react-native-community/async-storage';

export default class asyncStorage {
    static getItem = (key) => {
        try {
            return JSON.parse(AsyncStorage.getItem(key));
        } catch (e) {
            return AsyncStorage.getItem(key);
        }
    };

    static setItem = (key, value) => {
        try {
            if (typeof value === 'string') {
                AsyncStorage.setItem(key, JSON.stringify(value));
            } else {
                AsyncStorage.setItem(key, value);
            }
        } catch (e) {
            console.log(e);
        }
    };

    //清空全部的AsyncStorage数据
    static clear = () => AsyncStorage.clear();

    //获取所有本应用可以访问到的数据
    static getAllKeys = () => AsyncStorage.getAllKeys();

    //清除所有进行中的查询操作
    static flushGetRequests = () => AsyncStorage.flushGetRequests();

    //获取 keys 所包含的所有字段的值
    static multiGet = (keys) => AsyncStorage.multiGet(keys);
}
