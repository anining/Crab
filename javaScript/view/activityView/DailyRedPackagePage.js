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
import activity10 from '../../assets/icon/activity/activity10.png';
import activity11 from '../../assets/icon/activity/activity11.png';
import activity13 from '../../assets/icon/activity/activity13.png';
import Header from '../../components/Header';
import header3 from '../../assets/icon/header/header3.png';
import ImageAuto from '../../components/ImageAuto';
import CountDown from '../../components/CountDown';
import { _gv } from '../../utils/util';
import {activityDetail} from '../../utils/api';
const { height, width } = Dimensions.get('window');
const redList = [{}, {}, {}, {}, {}, {}];
export default class DailyRedPackagePage extends Component {
    constructor (props) {
        super(props);
        this.state = {};
        this.active_id = _gv(this.props, 'route.params.activity_id');
    }

    componentDidMount () {
        // console.log(_gv(this.props, 'route.params.activity_id'));
        this._activityDetail();
    }

    async _activityDetail () {
        try {
            console.log(this.active_id, 'activity_id');
            const ret = await activityDetail(this.active_id);
            console.log(ret, '???');
        } catch (e) {
            console.log(e);
        }
    }

    _renderRedItem () {
        try {
            const view = [];
            redList.forEach((item, index) => {
                view.push(<TouchableOpacity activeOpacity={1} onPress={() => {}}>
                    <ImageBackground key={`${index}list`} source={activity10} style={[styles.redItemBg, css.flex, css.afs, css.fw]}>
                        <Text style={[styles.redItemText, {
                            color: 'rgba(255,255,255,.7)'
                        }]} numberOfLines={1}>最低6000金币</Text>
                        <Text style={[styles.redItemText]} numberOfLines={1}>完成进度10/200</Text>
                    </ImageBackground>
                </TouchableOpacity>);
            });
            return view;
        } catch (e) {
            console.log(e);
            return null;
        }
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
                    {/* 864 - 249 */}
                    <ImageBackground source={activity9} style={[css.pa, styles.arpImage, css.flex]}>
                        <View style={[styles.activeTitleWrap, css.flex, css.fw]}>
                            <Text style={styles.atwTitle}>活动倒计时</Text>
                            <CountDown time={+new Date('2020/06/21')} style={{ color: '#fff', fontSize: 15, letterSpacing: 4 }}/>
                        </View>
                    </ImageBackground>
                    {/* <ImageAuto source={activity9} style={[css.pa, styles.arpImage]}/> */}
                    <View style={[styles.arpInnerWrap, css.flex, css.fw, css.sp]}>
                        {this._renderRedItem()}
                    </View>
                </View>
                <ImageAuto source={activity13} style={{
                    width: width * 0.94,
                    ...css.auto
                }}/>
                <View style={{ height: 20 }}/>
            </ScrollView>
        </SafeAreaView>;
    }
}
const styles = StyleSheet.create({
    activeTitleWrap: {
        backgroundColor: '#F95433',
        height: '60%',
        width: '75%',
        ...css.auto,
        borderRadius: 100,
        marginBottom: '5%',
    },
    allRedPackWrap: {
        height: width * 0.85,
        marginTop: width * 0.5,
        width: width * 0.94,
        ...css.auto,
        marginBottom: 20
    },
    arpImage: {
        height: 249 / 864 * width * 0.75,
        left: width * 0.09,
        top: -width * 0.15,
        width: width * 0.75,
    },
    arpInnerWrap: {
        backgroundColor: '#FEEAC5',
        borderRadius: 8,
        height: '100%',
        overflow: 'hidden',
        paddingHorizontal: 20,
        // paddingVertical: 20,
        paddingTop: 30,
        // eslint-disable-next-line react-native/sort-styles
        paddingBottom: 10,
        width: '100%',
    },
    atwTitle: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '900',
        lineHeight: 25,
        textAlign: 'center',
        width: '100%'
    },
    dmWrap: {
        height: 1281 / 1125 * width,
        width: width
    },
    redItemBg: {
        height: width * 0.25 * 327 / 249,
        marginBottom: 10,
        paddingTop: 10,
        width: width * 0.25
    },
    redItemText: {
        color: '#fff',
        fontSize: 11,
        lineHeight: 30,
        textAlign: 'center',
        width: '90%',
        ...css.auto
    },
});
