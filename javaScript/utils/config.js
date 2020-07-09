export const DEVELOPER = 'Production'; // 测试 Staging 正式 Production
export const CONSOLE_LOG = true; // true 代表开启console
export const UA_ID = 10011;
export const VERSION_CODE = 100;
export const API_URL = DEVELOPER === 'Production' ? 'https://realman.librags.com/api' : 'https://dev-realman.librags.com/api';
export const PRIVATE_KEY = DEVELOPER === 'Production' ? 'MPo2O8qZbItk6iEmyeICMOVLVSFAY1QV+uOJTt+Wi4c=' : '80TD9QXUGHOEZLkcmB5h3uSpWvqNlfoM';
