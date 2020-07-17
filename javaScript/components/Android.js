import { Platform, NativeModules } from 'react-native';

let android = {};
try {
    if (Platform.OS === 'ios') {
        android.promiseGetChannel = () => new Promise((resolve, reject) => {
            resolve({ channel: 'ios_crab' });
        });
    } else {
        NativeModules.TransmitModule && (android = NativeModules.TransmitModule);
    }
} catch (e) {
    console.log(e);
}
export default android;
