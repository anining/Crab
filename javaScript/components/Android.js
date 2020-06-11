import { NativeModules } from 'react-native';

let android = {};
try {
    NativeModules.TransmitModule && (android = NativeModules.TransmitModule);
} catch (e) {
    console.log(e);
}
export default android;
