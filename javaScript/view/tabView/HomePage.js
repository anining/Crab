import React from 'react';
import { SafeAreaView, Text, DeviceEventEmitter, BackHandler, NativeModules } from 'react-native';
import { css } from '../../assets/style/css';
import Android from '../../components/Android';
import LottieView from 'lottie-react-native';
import data from '../../lottie/data';

export default function HomePage () {
    try {
        // this.nativeNoticeListener = DeviceEventEmitter.addListener(
        //     'nativeNotice',
        //     event => {
        //         console.log(event);
        //     },
        // );
        // NativeModules.SecVerifyModule && NativeModules.SecVerifyModule.isVerifySupport();
        // (async () => {
        //     const ret = await Android.verifyLogin();
        //     console.log(ret);
        //     // const ret = await Android.verifyLogin();
        //     // console.log(ret);ret
        // })();
    } catch (e) {
        console.log(e);
    }
    return (
        <SafeAreaView style={css.safeAreaView}>
            <LottieView
                style={{ width: '100%', height: 'auto', backgroundColor: 'red' }}
                imageAssetsFolder={'lottie'}
                source={data}
                loop={true}
                autoPlay={true}
                speed={1}
            />
        </SafeAreaView>
    );
}
