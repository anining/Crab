import React from 'react';
import { Dimensions, ScrollView, Text, ImageBackground, StyleSheet } from 'react-native';
import medal1 from '../../assets/icon/medal/medal1.png';
import { N } from '../../utils/router';
import { css } from '../../assets/style/css';
import header3 from '../../assets/icon/header/header3.png';
import Header from '../../components/Header';
import toast from '../../utils/toast';

const { width } = Dimensions.get('window');

function MyMedal () {
    return (
        <View>
            <ImageBackground source={medal1} style={styles.container} >
                <Header color={'#fff'} label={'五彩勋章'} style={[{ backgroundColor: 'rgba(0,0,0,0)', borderBottomWidth: 0 }, css.pa]} icon={header3}/>
                <Text style={{ flex: 1 }} onPress={() => {
                    toast('活动暂未开启，敬请期待');
                }}/>
                <Text style={[css.pa, styles.myModelBtn]} onPress={() => {
                    N.navigate('CardPackagePage');
                    toast('活动暂未开启，敬请期待');
                }}>合成</Text>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: width * (2343 / 1125),
        width,
    },
    myModelBtn: {
        height: width * 0.15,
        left: '50%',
        opacity: 0,
        top: '80%',
        transform: [{ translateX: -width * 0.32 }],
        width: width * 0.64
    }
});

export default MyMedal;
