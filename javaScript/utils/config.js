import * as DeviceInfo from 'react-native-device-info';
import { API_URI_OBJ, PRIVATE_KEY_OBJ, REDIRECT_URI_OBJ } from './apiConfig';
const VERSION_CODE_RegExp = new RegExp(/\./g);
/**
 *Production Staging**/
export const DEVELOPER = 'Production'; // 测试 Staging 正式 Production
export const UA_ID = 10011;
export const API_URL = API_URI_OBJ[DEVELOPER];
export const PRIVATE_KEY = PRIVATE_KEY_OBJ[DEVELOPER]; // 网络接口请求key
export const REDIRECT_URI = REDIRECT_URI_OBJ[DEVELOPER]; // 绑定微信回掉域名
export const VERSION_CODE = parseInt(DeviceInfo.getVersion().replace(VERSION_CODE_RegExp, '')); // 版本号
export const SYSTEM_VERSION = parseInt(DeviceInfo.getSystemVersion()); // 系统版本
