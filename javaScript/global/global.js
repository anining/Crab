/* 不同的页面，都监听一次改变 */
import AsyncStorage from '@react-native-community/async-storage';

const localObj = {};
let global = null;

/* 实现多页面双向绑定 */
function proxy (key) {
    if (global && key in global) {
        let val = global[key];
        Object.defineProperty(global, key, {
            get: function () {
                return val;
            },
            set: function (newValue) {
                try {
                    if (newValue !== val) {
                        if (localObj[key]) {
                            localObj[key].forEach(local => {
                                /* 防止已经记录注册的页面已经被注销，通知出错 */
                                if (local.setState) {
                                    local.setState({
                                        [key]: newValue,
                                    });
                                }
                            });
                        }
                        val = newValue;
                        this[key] = newValue;
                    }
                } catch (e) {
                    console.log(e);
                }
            },
        });
    }
}

function clearLocal (local) {
    try {
        const componentWillUnmount = local.componentWillUnmount
            ? local.componentWillUnmount
            : () => {};
        local.componentWillUnmount = () => {
            componentWillUnmount.call(local);
            local.setState = () => {
                return null;
            };
        };
    } catch (e) {
        console.log(e);
    }
}

export function bindData (key, local) {
    if (global && key in global) {
        // eslint-disable-next-line no-unsafe-negation
        if (!localObj[key] || !localObj[key] instanceof Array) {
            localObj[key] = [local];
            clearLocal(local);
        } else {
            localObj[key].push(local);
        }
        proxy(key);
        return global[key];
    } else {
        console.log(`${key} key not in global`);
        return {};
    }
}

export function setGlobal (key, value, callback) {
    if (global && key in global) {
        console.log(`全局设置${key}`, value);
        global[key] = value;
        if (callback) {
            callback();
        }
    } else {
        console.log(`${key} key not in global`);
    }
}

export function getGlobal (key) {
    if (global && key in global) {
        return global[key];
    } else {
        console.log(`${key} key not in global`);
        return {};
    }
}

export function setDefaultGlobal (value) {
    if (!global) {
        global = value;
    }
}

export function setGlobalStorage (key, value, otherKey) {
    try {
        if ((typeof key === 'string') && value) {
            setGlobal(key, value);
            AsyncStorage.setItem(otherKey || key, JSON.stringify(value));
        }
    } catch (e) {
        console.log(e);
    }
}

export function getPath (path, obj, defaultValue) {
    try {
        let ret = obj;
        path.forEach((keyName) => {
            ret = ret[keyName];
        });
        return ret || defaultValue;
    } catch (e) {
        return defaultValue;
    }
}
