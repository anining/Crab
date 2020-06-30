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
    ScrollView,
} from 'react-native';
import { css } from '../../assets/style/css';
import header3 from '../../assets/icon/header/header3.png';
import ImageAuto from '../../components/ImageAuto';
import activity6 from '../../assets/icon/activity/activity6.png';
import Header from '../../components/Header';
import { getNoteBook } from '../../utils/api';
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
                <Header color={'#fff'} label={'生词本'} style={{ backgroundColor: '#FED465', borderBottomWidth: 0 }} icon={header3}/>
                <Text>GlossaryPage</Text>
            </SafeAreaView>
        );
    }
}
