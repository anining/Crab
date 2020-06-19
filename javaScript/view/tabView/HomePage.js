import React, { Component } from 'react';
import { SafeAreaView, View, Dimensions, DeviceEventEmitter, Text, StyleSheet } from 'react-native';
import { css } from '../../assets/style/css';
import Android from '../../components/Android';
import LottieView from 'lottie-react-native';
import data from '../../lottie/data';
import data3 from '../../lottie/data3';
import data4 from '../../lottie/data4';
import Button from '../../components/Button';
import WebView from 'react-native-webview';
import { dyCrack } from '../../crack/dy';

const { height, width } = Dimensions.get('window');
export default class HomePage extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.state = {};
    }

    async componentDidMount () {
        // const FETCH_DATA = await fetch('https://www.iesdouyin.com/share/user/72611237713');
        // const DATA_TEXT = await FETCH_DATA.text();
        // console.log(DATA_TEXT);
        // console.log(DATA_TEXT.indexOf('focus block'), DATA_TEXT.indexOf('follower block'), DATA_TEXT.indexOf('liked-num block'));
        const ret = await dyCrack('https://www.iesdouyin.com/share/user/72611237713');
        console.log(ret, 'react-native, 获取用户抖音数据');
    }

    render () {
        return (
            <SafeAreaView style={css.safeAreaView}>
                <Button onPress={(callback) => {
                    setTimeout(() => {
                        callback && callback();
                    }, 2000);
                }}/>
                <LottieView
                    style={{ width: 180, height: 'auto' }}
                    imageAssetsFolder={'lottie4'}
                    source={data4}
                    loop={true}
                    autoPlay={true}
                    speed={1}
                />
                <LottieView
                    style={{ width: '100%', height: 'auto' }}
                    imageAssetsFolder={'lottie3'}
                    source={data3}
                    loop={true}
                    autoPlay={true}
                    speed={1}
                />
                {/* <WebView source={{ uri: 'https://www.iesdouyin.com/share/user/72611237713' }} injectedJavaScript={'(function() {window.ReactNativeWebView.postMessage(document.querySelector(\'body\').innerHTML)})()'} onMessage={(e) => { */}
                {/*    // console.log(e.nativeEvent.data, '???前端'); */}
                {/*    const DATA_TEXT = e.nativeEvent.data; */}
                {/*    console.log(DATA_TEXT.indexOf('focus block'), DATA_TEXT.indexOf('follower block'), DATA_TEXT.indexOf('liked-num block')); */}
                {/* }}/> */}
                {/* <Text>homepage</Text> */}
                {/* <View style={[css.flex, css.pr]}> */}
                {/*    <View style={[css.pa, { */}
                {/*        top: 20, */}
                {/*    }]}> */}
                {/*        /!* 参考文档https://github.com/oblador/react-native-animatable *!/ */}
                {/*        <Animatable.Text useNativeDriver={true} iterationDelay={3000} iterationCount="infinite" animation="tada" style={{ */}
                {/*            width: 100, */}
                {/*            height: 40, */}
                {/*            color: '#fff', */}
                {/*            fontSize: 12, */}
                {/*            backgroundColor: '#dc4a1d', */}
                {/*            textAlign: 'center', */}
                {/*            lineHeight: 40, */}
                {/*            borderRadius: 20, */}
                {/*            overflow: 'hidden', */}
                {/*        }} onPress={() => { */}
                {/*            DeviceEventEmitter.emit('showPop'); */}
                {/*        }}>买买买！</Animatable.Text> */}
                {/*    </View> */}
                {/* </View> */}
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({

});
