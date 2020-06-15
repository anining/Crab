import * as U from 'karet.util';
import store from './store';

class router {
    constructor (navigation, filterRouters, authRouterName) {
        this.filterRouters = filterRouters;
        this.navigation = navigation;
        this.authRouterName = authRouterName;
        this.navigate = this.navigate.bind(this);
        this.goBack = this.goBack.bind(this);
        this.push = this.push.bind(this);
        this.replace = this.replace.bind(this);
        this.popToTop = this.popToTop.bind(this);
    }

    filterRouteName (routeName) {
        return this.filterRouters.includes(routeName);
    }

    // reset
    // pop
    // setParams
    // dispatch
    // isFocused
    // canGoBack
    // addListener
    // removeListener
    // dangerouslyGetParent
    // dangerouslyGetState
    // setOptions

    popToTop (authorization = U.view(['authorization'], store).get()) {
        if (authorization) {
            this.navigation.popToTop();
        } else {
            this.navigation.replace(this.authRouterName);
        }
    }

    replace (routeName, params = {}, authorization = U.view(['authorization'], store).get()) {
        // if (this.filterRouteName(routeName) || authorization) {
        //     this.navigation.replace(routeName, { ...params });
        // } else {
        //     this.navigation.replace(this.authRouterName);
        // }
        this.navigation.replace(routeName, { ...params });
    }

    push (routeName, params = {}, authorization = U.view(['authorization'], store).get()) {
        if (this.filterRouteName(routeName) || authorization) {
            this.navigation.push(routeName, { ...params });
        } else {
            this.navigation.replace(this.authRouterName);
        }
    }

    navigate (routeName, params = {}, authorization = U.view(['authorization'], store).get()) {
        if (this.filterRouteName(routeName) || authorization) {
            this.navigation.navigate(routeName, { ...params });
        } else {
            this.navigation.replace(this.authRouterName);
        }
    }

    goBack (key) {
        this.navigation.goBack(key);
    }
}

let N = null;
const proxyRouter = (() => {
    return (navigation, filterRouters, authRouterName) => {
        if (!N && navigation && filterRouters && authRouterName) {
            // eslint-disable-next-line new-cap
            N = new router(navigation, filterRouters, authRouterName);
        }
        return N;
    };
})();

export { proxyRouter, N };
