import React, { Component } from 'react';
import { SafeAreaView, View, Dimensions, DeviceEventEmitter, Text, StyleSheet } from 'react-native';
import { css } from '../../assets/style/css';
import Android from '../../components/Android';
import LottieView from 'lottie-react-native';
import data from '../../lottie/data';
import data5 from '../../lottie/data5';
import data4 from '../../lottie/data4';
import Button from '../../components/Button';
import WebView from 'react-native-webview';
import { dyCrack } from '../../crack/dy';
import { ksCrack } from '../../crack/ks';

const { height, width } = Dimensions.get('window');
export default class HomePage extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.state = {};
    }

    render () {
        return (
            <SafeAreaView style={css.safeAreaView}>
                <LottieView
                    style={{ width: '100%', height: 'auto' }}
                    imageAssetsFolder={'lottie5'}
                    source={data5}
                    loop={true}
                    autoPlay={true}
                    speed={1}
                />
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({

});
