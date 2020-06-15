import React from 'react';
import { SafeAreaView, Text, DeviceEventEmitter, BackHandler, NativeModules } from 'react-native';
import { css } from '../../assets/style/css';
import Android from '../../components/Android';

export default function HomePage () {
    try {
        // this.nativeNoticeListener = DeviceEventEmitter.addListener(
        //     'nativeNotice',
        //     event => {
        //         console.log(event);
        //     },
        // );
        // NativeModules.SecVerifyModule && NativeModules.SecVerifyModule.isVerifySupport();
        (async () => {
            const ret = await Android.promiseGetMobId();
            console.log(ret);
        })();
    } catch (e) {
        console.log(e);
    }
    return (
        <SafeAreaView style={css.safeAreaView}>
            <Text>HomePage</Text>
        </SafeAreaView>
    );
}
