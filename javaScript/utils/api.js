import {transformFetch} from './util';

//login
function login(code) {
  return transformFetch('POST', '/login', {code});
}

export {login};
