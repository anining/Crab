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
import { gameErrorLog } from '../../utils/api';
const { height, width } = Dimensions.get('window');
export default class RightProPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    async _gameErrorLog () {
        const ret = await gameErrorLog();
        if (ret && !ret.error) {
            console.log(ret, '打错题目记录');
        }
    }

    async componentDidMount () {
        await this._gameErrorLog();
    }

    render () {
        return (
            <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#FED465' }]}>
                <Header color={'#fff'} label={'答题正确率'} style={[{ backgroundColor: '#FED465', borderBottomWidth: 0 }, css.pa]} icon={header3}/>

            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    emptyText: {
        color: '#666',
        fontSize: 16,
        lineHeight: 40,
        textAlign: 'center',
        width: '100%',
        ...css.gf
    },
    glossaryInnerBox: {
        height: width * 1.25,
        left: width * 0.1,
        paddingLeft: 10,
        paddingTop: 20,
        top: width * 0.25,
        width: width * 0.8
    },
    glossaryWrap: {
        height: width * 2001 / 1125,
        width: width
    },
    idiomItemWrap: {
        borderColor: '#594134',
        borderRadius: 17,
        borderWidth: 1,
        height: 34,
        marginBottom: 10,
        marginLeft: width * 0.02,
        overflow: 'hidden',
        transform: [{ scale: 0.96 }],
        width: '30%',
    },
    lineIdiom: {
        fontSize: 15,
    },
});
