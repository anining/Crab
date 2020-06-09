class router {
  constructor(navigation, filterRouters, authRouterName, authorization) {
    this.filterRouters = filterRouters;
    this.navigation = navigation;
    this.authRouterName = authRouterName;
    this.authorization = authorization;
    this.navigate = this.navigate.bind(this);
  }

  filterRouteName(routeName) {
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

  popToTop() {
    if (this.authorization) {
      this.navigation.popToTop();
    } else {
      this.navigation.replace(this.authRouterName);
    }
  }

  replace(routeName, params = {}) {
    if (this.filterRouteName(routeName) || this.authorization) {
      this.navigation.replace(routeName, {...params});
    } else {
      this.navigation.replace(this.authRouterName);
    }
  }

  push(routeName, params = {}) {
    if (this.filterRouteName(routeName) || this.authorization) {
      this.navigation.push(routeName, {...params});
    } else {
      this.navigation.replace(this.authRouterName);
    }
  }

  navigate(routeName, params = {}) {
    if (this.filterRouteName(routeName) || this.authorization) {
      this.navigation.navigate(routeName, {...params});
    } else {
      this.navigation.replace(this.authRouterName);
    }
  }

  goBack(key) {
    this.navigation.goBack(key);
  }
}

let N = null;
const proxyRouter = (() => {
  return (navigation, filterRouters, authRouterName, authorization) => {
    if (!N && navigation && filterRouters && authRouterName) {
      N = new router(navigation, filterRouters, authRouterName, authorization);
    }
    return N;
  };
})();

export {proxyRouter, N};
