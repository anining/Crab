import { Component } from 'react';
import * as React from 'karet';
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { css } from '../../assets/style/css';
import header3 from '../../assets/icon/header/header3.png';
import ImageAuto from '../../components/ImageAuto';
import activity6 from '../../assets/icon/activity/activity6.png';
import Header, { MAIN_HEADER_HEIGHT } from '../../components/Header';
import { getNoteBook } from '../../utils/api';
import game65 from '../../assets/icon/game/game65.png';
const { height, width } = Dimensions.get('window');
export default class GlossaryPage extends Component {
// export default function GlossaryPage () {
    componentDidMount () {
        this._getNoteBook();
    }

    async _getNoteBook () {
        const ret = await getNoteBook();
        console.log(ret, '??');
        if (ret && !ret.error) {

        }
    }

    render () {
        return (
            <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#FED465' }]}>
                <Header color={'#fff'} label={'生词本'} style={[{ backgroundColor: '#FED465', borderBottomWidth: 0 }, css.pa]} icon={header3}/>
                <ImageBackground source={game65} style={[styles.glossaryWrap, css.pr]}>
                    <ScrollView style={[css.pa, styles.glossaryInnerBox]}>

                    </ScrollView>
                </ImageBackground>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    glossaryInnerBox: {
        backgroundColor: 'rgba(0,0,0,.2)',
        height: width * 1.25,
        left: width * 0.1,
        top: width * 0.25,
        width: width * 0.8
    },
    glossaryWrap: {
        height: width * 2001 / 1125,
        width: width
    }
});
