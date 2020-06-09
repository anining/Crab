import store from './store';
import * as U from 'karet.util';

export const initializationStore = keys => {
  const localStore = store.get();
  keys.forEach(key => {
    localStore[key[0]] = key[1];
  });
  U.set(store, localStore);
};

