import React from 'react';
import { SafeAreaView, View, Text, BackHandler, NativeModules } from 'react-native';
import { css } from '../../assets/style/css';
import Android from '../../components/Android';
import LottieView from 'lottie-react-native';
import data from '../../lottie/data';
import data1 from '../../lottie/data1';
import * as Animatable from 'react-native-animatable';

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
    const zoomOut = {
        0: {
            opacity: 1,
            scale: 1,
        },
        0.5: {
            opacity: 1,
            scale: 0.3,
        },
        1: {
            opacity: 0,
            scale: 0,
        },
    };
    return (
        <SafeAreaView style={css.safeAreaView}>
            <LottieView
                style={{ width: '100%', height: 'auto', backgroundColor: '#fff' }}
                imageAssetsFolder={'lottie'}
                source={data}
                loop={true}
                autoPlay={true}
                speed={1}
            />
            <View style={[css.flex, css.pr]}>
                <LottieView
                    style={{ width: '100%', height: 'auto', backgroundColor: '#5d6fff' }}
                    imageAssetsFolder={'lottie1'}
                    source={data1}
                    loop={true}
                    autoPlay={true}
                    speed={1}
                />
                <View style={[css.pa, {
                    top: 20,
                }]}>
                    {/* 参考文档https://github.com/oblador/react-native-animatable */}
                    <Animatable.Text useNativeDriver={true} iterationCount={50} animation="tada" style={{
                        width: 100,
                        height: 40,
                        color: '#fff',
                        fontSize: 12,
                        backgroundColor: '#dc4a1d',
                        textAlign: 'center',
                        lineHeight: 40,
                        borderRadius: 20,
                        overflow: 'hidden',
                    }}>买买买！</Animatable.Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
