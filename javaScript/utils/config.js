import * as DeviceInfo from 'react-native-device-info';
import { API_URI_OBJ, PRIVATE_KEY_OBJ } from './apiConfig';
const VERSION_CODE_RegExp = new RegExp(/\./g);
/**
 *Production Staging**/
export const DEVELOPER = 'Staging'; // 测试 Staging 正式 Production
export const UA_ID = 10011;
export const API_URL = API_URI_OBJ[DEVELOPER];
export const PRIVATE_KEY = PRIVATE_KEY_OBJ[DEVELOPER];
export const VERSION_CODE = parseInt(DeviceInfo.getVersion().replace(VERSION_CODE_RegExp, ''));
export const SYSTEM_VERSION = parseInt(DeviceInfo.getSystemVersion());
export const REDIRECT_URI = DEVELOPER === 'Staging' ? 'https%3A%2F%2Fstagingb.libratb.com' : 'https%3A%2F%2Fbind.libratb.com';
