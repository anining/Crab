class router {
  constructor(navigation, filterRouters, authRouterName) {
    this.filterRouters = filterRouters;
    this.navigation = navigation;
    this.authRouterName = authRouterName;
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

  // static popToTop() {
  // const navigation = Route.navigation;
  // (!navigation || routerName) && alert('404');
  // Router.navigation.navigate(routerName, {...params});
  // }

  // static replace() {
  // const navigation = Route.navigation;
  // (!navigation || routerName) && alert('404');
  // Router.navigation.navigate(routerName, {...params});
  // }

  // static push(name, params = {}) {
  // const navigation = Route.navigation;
  // (!navigation || !filterRouteName(name)) && alert('404');
  // Router.navigation.navigate(routerName, {...params});
  // }

  navigate(routeName, params = {}) {
    //false 从store中获取的token值
    if (this.filterRouteName(routeName) || true) {
      this.navigation.navigate(routeName, {...params});
    } else {
      this.navigation.replace(this.authRouterName);
    }
  }

  // static goBack() {
  //     const navigation = NavigationUtil.navigation;
  //     if (!navigation) {
  //         console.log('navigation undefined');
  //         return false;
  //     }
  //     navigation.goBack(key || null);
  // }
}

let N = null;
const proxyRouter = (() => {
  return (navigation, filterRouters, authRouterName) => {
    if (!N && navigation && filterRouters && authRouterName) {
      N = new router(navigation, filterRouters, authRouterName);
    }
    return N;
  };
})();

export {proxyRouter, N};
