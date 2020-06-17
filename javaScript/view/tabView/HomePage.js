import React from 'react';
import { SafeAreaView, View, Dimensions, DeviceEventEmitter, Text, StyleSheet } from 'react-native';
import { css } from '../../assets/style/css';
import Android from '../../components/Android';
import LottieView from 'lottie-react-native';
import data from '../../lottie/data';
import data1 from '../../lottie/data1';
import * as Animatable from 'react-native-animatable';
import ListGeneral from '../../components/ListGeneral';
import ListHeader from '../../components/ListHeader';
import Button from '../../components/Button';

const { height, width } = Dimensions.get('window');
export default function HomePage () {
    return (
        <SafeAreaView style={css.safeAreaView}>
            <Button onPress={(callback) => {
                setTimeout(() => {
                    callback && callback();
                }, 2000);
            }}/>
            {/* <Text>homepage</Text> */}
            {/* <View style={[css.flex, css.pr]}> */}
            {/*    <LottieView */}
            {/*        style={{ width: '100%', height: 'auto', backgroundColor: '#5d6fff' }} */}
            {/*        imageAssetsFolder={'lottie1'} */}
            {/*        source={data1} */}
            {/*        loop={true} */}
            {/*        autoPlay={true} */}
            {/*        speed={1} */}
            {/*    /> */}
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
const styles = StyleSheet.create({

});
