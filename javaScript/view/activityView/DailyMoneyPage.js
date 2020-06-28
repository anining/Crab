import React, { useState, useEffect } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View, ImageBackground, DeviceEventEmitter, TouchableOpacity } from 'react-native';
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
import { activityDetail, withdrawLogsLatest } from '../../utils/api';
const { width } = Dimensions.get('window');

function DailyMoneyPage (props) {
    const { activityId, pageInfo } = props.route.params;
    const { log, user_history } = pageInfo;
    const { money, invalid_time } = log;
    const [withdrawLogs, setWithdrawLogs] = useState([]);

    useEffect(() => {
        withdrawLogsLatest().then(r => {
            !r.error && setWithdrawLogs(r.data);
        });
    }, []);

    // useEffect(() => {
    //     _activityDetail();
    // }, []);
    //
    // function _activityDetail () {
    //     console.log(activityId);
    //     console.log(pageInfo);
    //     activityDetail(activityId).then(r => {
    //         console.log(r);
    //     });
    // }

    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#f8f8f8' }]}>
            <ScrollView style={{ flex: 1, backgroundColor: '#EA251E' }}>
                <ImageBackground source={activity5} style={[styles.dmWrap]}>
                    <Header color={'#fff'} label={'天天领现金'} style={{ backgroundColor: 'rgba(0,0,0,0)', borderBottomWidth: 0 }} icon={header3} headerRight={
                        <Text style={{ color: '#fff' }}>活动规则</Text>
                    } onPress={() => {
                        DeviceEventEmitter.emit('showPop',
                            <TouchableOpacity onPress={() => { DeviceEventEmitter.emit('hidePop'); }}>
                                <ImageAuto source={activity6} width={width * 0.8}/>
                            </TouchableOpacity>
                        );
                    }}/>
                    <Lamp LampList={withdrawLogs}/>
                    <View style={[css.flex, css.fw, styles.redPackageWrap, css.afs]}>
                        <CountDown time={+new Date(invalid_time)} style={{ color: Number(money) >= 30 ? 'rgba(225,48,32,1)' : '#999', fontSize: 13, lineHeight: 70 }} millisecond={true} tips={Number(money) >= 30 ? '后未提现现金将失效' : '后现金失效'}/>
                        <Text style={styles.redMaxText}> {money} <Text style={{ fontSize: 20 }}>元</Text></Text>
                        <Animatable.View useNativeDriver={true} iterationCount="infinite" animation="pulse" style={[css.auto]}>
                            <Shadow style={[styles.shareBtn]}>
                                <Text style={styles.shareBtnText} onPress={() => {
                                    DeviceEventEmitter.emit('showPop', {
                                        dom: <PopupView/>,
                                        close,
                                    });
                                    return;
                                    if (Number(money) >= 30) {

                                    }
                                }}>提现到我的钱包</Text>
                            </Shadow>
                        </Animatable.View>
                        <Text style={styles.dmMinTips} numberOfLines={1}>满30元既可以提现到钱包</Text>
                    </View>
                </ImageBackground>
                <RenderList history={user_history}/>
                <Text style={styles.bottomTips}>参与更多送钱活动~</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

function PopupView () {
    return (
        <Text>111</Text>
    );
}

function RenderList ({ history }) {
    console.log(history);
    if (!history.length) {
        return <></>;
    }
    const view = [];
    history.forEach(item => {
        view.push(
            <View style={[styles.recordItemWrap, css.flex, css.sp]}>
                <ImageAuto source={answer3} width={40}/>
                <View style={[css.flex, css.fw, styles.riwInfoWrap, css.js]}>
                    <Text numberOfLine={1} style={[styles.riwText, { fontSize: 13 }]}>sandily</Text>
                    <Text numberOfLine={1} style={styles.riwText}>打开红包</Text>
                </View>
                <Text style={styles.riwMoneyText}>+22.9元</Text>
            </View>
        );
    });
    return (
        <View style={styles.recordWrap}>
            <Text style={styles.recordTitleText}>累计记录 <Text style={styles.rttMinTitle}> 每单任务通过，可以累计额外的金币哦</Text></Text>
            {view}
        </View>
    );
}

const styles = StyleSheet.create({
    bottomTips: {
        color: '#FFFFD9A0',
        fontSize: 12,
        lineHeight: 70,
        textAlign: 'center'
    },
    dmMinTips: {
        color: 'rgba(255,255,255,1)',
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
        width: width * 0.94,
        ...css.auto,
        marginTop: 20,
        padding: 15
    },
    redMaxText: {
        color: '#E13020',
        fontSize: 50,
        fontWeight: '900',
        lineHeight: width * 0.17,
        marginBottom: width * 0.17,
        textAlign: 'center',
        width: '100%'
    },
    redPackageWrap: {
        height: width * 0.72,
        width: '80%',
        ...css.auto,
        paddingHorizontal: 10
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
        borderRadius: 22,
        height: 44,
        width: width * 0.63
    },
    shareBtnText: {
        backgroundColor: '#FFE164',
        borderRadius: 22,
        color: '#E13120',
        fontSize: 15,
        fontWeight: '600',
        height: '100%',
        lineHeight: 44,
        overflow: 'hidden',
        textAlign: 'center',
        width: '100%'
    }
});

export default DailyMoneyPage;
