import React, { Component } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    DeviceEventEmitter,
    TouchableOpacity
} from 'react-native';
import { css } from '../../assets/style/css';
import ImageAuto from '../../components/ImageAuto';
import activity3 from '../../assets/icon/activity/activity3.png';
import activity4 from '../../assets/icon/activity/activity4.png';
import activity5 from '../../assets/icon/activity/activity5.png';
import activity6 from '../../assets/icon/activity/activity6.png';
import activity7 from '../../assets/icon/activity/activity7.png';
import answer3 from '../../assets/icon/answer/answer3.png';
import header3 from '../../assets/icon/header/header3.png';
import Header from '../../components/Header';
import Lamp from '../../components/Lamp';
import CountDown from '../../components/CountDown';
import Shadow from '../../components/Shadow';
import LinearGradient from 'react-native-linear-gradient';
import Choice from '../../components/Choice';
import pop1 from '../../assets/icon/pop/pop1.png';
import * as Animatable from 'react-native-animatable';
import { _gv } from '../../utils/util';
import { activityDetail } from '../../utils/api';
const { height, width } = Dimensions.get('window');
export default class DailyMoneyPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            pageInfo: _gv(this.props, 'route.params.pageInfo')
        };
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

    render () {
        return <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#f8f8f8' }]}>
            <ScrollView style={[{ flex: 1, backgroundColor: '#EA251E' }]}>
                <ImageBackground source={activity5} style={[styles.dmWrap]}>
                    <Header color={'#fff'} label={'天天领现金'} style={{ backgroundColor: 'rgba(0,0,0,0)', borderBottomWidth: 0 }} icon={header3} headerRight={
                        <Text style={{ color: '#fff' }}>活动规则</Text>
                    } onPress={() => {
                        DeviceEventEmitter.emit('showPop',
                            <TouchableOpacity activeOpacity={1} onPress={() => { DeviceEventEmitter.emit('hidePop'); }}>
                                <ImageAuto source={activity6} width={width * 0.8}/>
                            </TouchableOpacity>
                        );
                    }}/>
                    <Lamp/>
                    <View style={[css.flex, css.fw, styles.redPackageWrap, css.afs]}>
                        <CountDown time={+new Date('2020/06/20')} style={{ color: '#999', fontSize: 13 }} millisecond={true} tips={'后现金消失'}/>
                        <Text style={styles.redMaxText}> 29.69 <Text style={{ fontSize: 20 }}>元</Text></Text>
                        <Animatable.View useNativeDriver={true} iterationCount="infinite" animation="pulse" style={[css.auto]}>
                            <Shadow style={[styles.shareBtn]}>
                                <Text style={styles.shareBtnText} onPress={() => {
                                    // tips={'您有一个任务'}
                                    DeviceEventEmitter.emit('showPop', <Choice info={{
                                        icon: pop1,
                                        tips: '您有一个任务',
                                        minTips: '你好。。。。',
                                        lt: '放弃任务',
                                        lc: () => {},
                                        rt: '继续任务',
                                        rc: () => {},
                                    }} />);
                                }}>提现到我的钱包</Text>
                            </Shadow>
                        </Animatable.View>
                        <Text style={styles.dmMinTips} numberOfLines={1}>满30元既可以提现到钱包</Text>
                    </View>
                </ImageBackground>
                <View style={styles.recordWrap}>
                    <Text style={styles.recordTitleText}>
                        累计记录
                        <Text style={styles.rttMinTitle}>（任务通过可以累计额外的零钱哦）</Text>
                    </Text>
                    <View style={[styles.recordItemWrap, css.flex, css.sp]}>
                        <ImageAuto source={answer3} width={40}/>
                        <View style={[css.flex, css.fw, styles.riwInfoWrap, css.js]}>
                            <Text numberOfLine={1} style={[styles.riwText, { fontSize: 13 }]}>sandily</Text>
                            <Text numberOfLine={1} style={styles.riwText}>打开红包</Text>
                        </View>
                        <Text style={styles.riwMoneyText}>+22.9元</Text>
                    </View>
                    <View style={[styles.recordItemWrap, css.flex, css.sp]}>
                        <ImageAuto source={answer3} width={40}/>
                        <View style={[css.flex, css.fw, styles.riwInfoWrap, css.js]}>
                            <Text numberOfLine={1} style={[styles.riwText, { fontSize: 13 }]}>官方运营商</Text>
                            <Text numberOfLine={1} style={styles.riwText}>打开红包</Text>
                        </View>
                        <Text style={styles.riwMoneyText}>+22.9元</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>;
    }
}
const styles = StyleSheet.create({
    dmMinTips: {
        color: '#ffebe1',
        fontSize: 11,
        marginTop: 10
    },
    dmWrap: {
        height: 1377 / 1125 * width,
        width: width
    },
    recordItemWrap: {
        height: 50,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '100%'
    },
    recordTitleText: {
        color: '#FFD9A0',
        fontSize: 16,
        lineHeight: 30,
        marginBottom: 10
    },
    recordWrap: {
        backgroundColor: '#F3462D',
        borderRadius: 4,
        height: 200,
        width: width * 0.94,
        ...css.auto,
        marginTop: 20,
        padding: 15
    },
    redMaxText: {
        // backgroundColor: 'red',
        color: '#E13020',
        fontSize: 50,
        fontWeight: '900',
        lineHeight: width * 0.33,
        textAlign: 'center',
        width: '100%',
        // eslint-disable-next-line react-native/sort-styles
        marginBottom: width * 0.07
    },
    redPackageWrap: {
        height: width * 0.72,
        width: '80%',
        ...css.auto,
        marginTop: width * 0.03,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    riwInfoWrap: {
        flex: 1,
        height: '100%',
        paddingLeft: 15
    },
    riwMoneyText: {
        color: '#FFE47E',
        fontSize: 14
    },
    riwText: {
        color: '#fff',
        fontSize: 11,
        lineHeight: 20,
        width: '100%',
    },
    rttMinTitle: {
        color: '#FAB4AB',
        fontSize: 12
    },
    shareBtn: {
        borderRadius: 25,
        height: 50,
        width: width * 0.65
    },
    shareBtnText: {
        backgroundColor: '#FFE164',
        borderRadius: 25,
        color: '#E13120',
        fontSize: 16,
        fontWeight: '600',
        height: '100%',
        lineHeight: 50,
        overflow: 'hidden',
        textAlign: 'center',
        width: '100%'
    }
});
