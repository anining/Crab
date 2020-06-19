import React, { Component } from 'react';
import {
    DeviceEventEmitter, Dimensions,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { css } from '../../assets/style/css';
import activity8 from '../../assets/icon/activity/activity8.png';
import activity9 from '../../assets/icon/activity/activity9.png';
import activity13 from '../../assets/icon/activity/activity13.png';
import Header from '../../components/Header';
import header3 from '../../assets/icon/header/header3.png';
import ImageAuto from '../../components/ImageAuto';
import activity6 from '../../assets/icon/activity/activity6.png';
const { height, width } = Dimensions.get('window');
export default class DailyRedPackagePage extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidMount () {
    }

    render () {
        return <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#f8f8f8' }]}>
            <ScrollView style={[{ flex: 1, backgroundColor: '#FF6123', ...css.pr }]}>
                <ImageAuto source={activity8} style={{
                    width: width,
                    ...css.pa,
                    zIndex: -1
                }}/>
                <Header color={'#fff'} label={'天天领红包'} style={{ backgroundColor: 'rgba(0,0,0,0)', borderBottomWidth: 0 }} icon={header3}/>
                <View style={[styles.allRedPackWrap, css.pr]}>
                    <ImageAuto source={activity9} style={[css.pa, styles.arpImage]}/>
                    <View style={[styles.arpInnerWrap]}>

                    </View>
                </View>
                <ImageAuto source={activity13} style={{
                    width: width * 0.94,
                    ...css.auto
                }}/>
            </ScrollView>
        </SafeAreaView>;
    }
}
const styles = StyleSheet.create({
    allRedPackWrap: {
        height: 240,
        marginTop: width * 0.5,
        width: width * 0.94,
        ...css.auto,
        marginBottom: 20
    },
    arpImage: {
        left: width * 0.09,
        top: -width * 0.15,
        width: width * 0.75
    },
    arpInnerWrap: {
        backgroundColor: '#FEEAC5',
        borderRadius: 8,
        height: 240,
        overflow: 'hidden',
        paddingVertical: 20,
        width: '100%'
    },
    dmWrap: {
        height: 1281 / 1125 * width,
        width: width
    },
});
