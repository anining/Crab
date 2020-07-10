import React, { useState, useEffect } from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, View, ImageBackground, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import { css } from '../../assets/style/css';
import ImageAuto from '../../components/ImageAuto';
import activity3 from '../../assets/icon/activity/activity3.png';
import activity5 from '../../assets/icon/activity/activity5.png';
import activity6 from '../../assets/icon/activity/activity6.png';
import activity15 from '../../assets/icon/activity/activity15.png';
import activity17 from '../../assets/icon/activity/activity17.png';
import activity18 from '../../assets/icon/activity/activity18.png';
import header3 from '../../assets/icon/header/header3.png';
import Header from '../../components/Header';
import Lamp from '../../components/Lamp';
import CountDown from '../../components/CountDown';
import Shadow from '../../components/Shadow';
import * as Animatable from 'react-native-animatable';
import { getRedPackage, openRedPackage, withdrawLogsLatest } from '../../utils/api';
import { N } from '../../utils/router';
import { _toFixed, djangoTime, setAndroidTime } from '../../utils/util';

const { width,height } = Dimensions.get('window');

function DailyMoneyPage (props) {
    const { activityId = {}, pageInfo } = props.route.params;
    if (!activityId || !pageInfo) {
        N.goBack();
        return <></>;
    }
    const { log, user_history, title } = pageInfo;
    const { money, invalid_time } = log;
    const [withdrawLogs, setWithdrawLogs] = useState([]);

    useEffect(() => {
        withdrawLogsLatest().then(r => {
            !r.error && setWithdrawLogs(r.data);
        });
    }, []);

    async function _openRedPackage () {
        const ret = await openRedPackage(activityId);
        if (!ret.error) {
            const { money } = ret.data;
            DeviceEventEmitter.emit('showPop', {
                dom:
                  <ImageBackground source={activity17} style={styles.lastPop}>
                      <Text style={[styles.lastPopText, { fontSize: 17 }]}>{title}送给您<Text style={{ color: 'rgba(232,58,41,1)', fontSize: 19, fontWeight: '500' }}> {money} 元</Text></Text>
                      <Text style={[styles.lastPopText, { fontSize: 12, marginTop: '7%', color: 'rgba(53,53,53,1)' }]}>当前已累积金额</Text>
                      <Text style={[styles.lastPopText, { marginTop: '5%', fontSize: 38, fontWeight: '800', color: 'rgba(232,58,41,1)' }]}>0<Text style={{ fontSize: 15, fontWeight: '500' }}>元</Text></Text>
                  </ImageBackground>,
                close: () => {
                    N.navigate('AnswerPage');
                },
            });
        }
    }

    function apiRedPackage () {
        getRedPackage(activityId).then(r => {
            if (!r.error) {
                DeviceEventEmitter.emit('showPop', {
                    dom:
                      <ImageBackground source={activity3} style={styles.successPop}>
                          <Text style={[styles.successPopText, { fontSize: 20, fontWeight: '500', color: 'rgba(232,58,41,1)' }]}>恭喜您，提现成功！</Text>
                          <Text style={[styles.successPopText, { marginTop: '5%' }]}>现金已存入“我的 - 我的钱包”</Text>
                      </ImageBackground>,
                    close: () => _openRedPackage,
                });
            }
        });
    }

    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#f8f8f8' }]}>
            <ScrollView style={[{ flex: 1, backgroundColor: '#EA251E'},css.pr]}>
                <ImageBackground source={activity5} style={[styles.dmWrap, css.pr]}>
                    <Header color={'#fff'} label={'天天领现金'} style={{ backgroundColor: 'rgba(0,0,0,0)', borderBottomWidth: 0 }} icon={header3} headerRight={
                        <Text style={{ color: '#fff' }}>活动规则</Text>
                    } onPress={() => {
                        DeviceEventEmitter.emit('showPop',
                            <TouchableOpacity activeOpacity={1} onPress={() => { DeviceEventEmitter.emit('hidePop'); }}>
                                <ImageAuto source={activity6} width={width * 0.8}/>
                            </TouchableOpacity>
                        );
                    }}/>
                    <Lamp LampList={withdrawLogs}/>
                    <View style={[css.flex, css.fw, css.pa, styles.redPackageWrap, css.afs]}>
                        <CountDown time={+new Date(djangoTime(invalid_time))} style={{ color: Number(money) >= 30 ? 'rgba(225,48,32,1)' : '#999', fontSize: 13, lineHeight: 30 }} millisecond={true} tips={Number(money) >= 30 ? '后未提现现金将失效' : '后现金失效'}/>
                        <Text style={styles.redMaxText}> {money} <Text style={{ fontSize: 20 }}>元</Text></Text>
                        <Animatable.View useNativeDriver={true} iterationCount="infinite" animation="pulse" style={[css.auto]}>
                            <Shadow style={[styles.shareBtn]}>
                                <Text style={styles.shareBtnText} onPress={() => {
                                    if (Number(money) < 30) {
                                        DeviceEventEmitter.emit('showPop', {
                                            dom: <PopupView money={money}/>,
                                            close: () => {},
                                        });
                                    } else {
                                        apiRedPackage();
                                    }
                                }}>提现到我的钱包</Text>
                            </Shadow>
                        </Animatable.View>
                        <Text style={styles.dmMinTips} numberOfLines={1}>满30元既可以提现到钱包</Text>
                    </View>
                </ImageBackground>
                <RenderList history={user_history}/>
            </ScrollView>
        </SafeAreaView>
    );
}

function PopupView ({ money }) {
    const scale = (Number(money) / 30).toFixed(2);
    const localWidth = width * 0.9 * 0.64 * scale;
    const localLeft = width * 0.9 * (0.63 * scale + 0.05);
    return (
        <ImageBackground source={activity15} style={styles.popupView}>
            <View style={styles.progress} />
            <View style={[styles.progressT, { width: localWidth }]} />
            <ImageBackground source={activity18} style={[styles.popupBg, { left: localLeft }]}>
                <Text numberOfLines={1} style={styles.popText}>仅差{_toFixed(30 - money)}W金币</Text>
            </ImageBackground>
            <TouchableOpacity activeOpacity={1} onPress={() => {
                DeviceEventEmitter.emit('hidePop');
                N.navigate('AnswerPage');
                setAndroidTime(() => {
                    DeviceEventEmitter.emit('answerScroll', 'end');
                    DeviceEventEmitter.emit('comTitlePop', {
                        key: 'taskTips', str: '任意完成一单任务即可加速领红包~'
                    });
                }, 1000);
            }} style={styles.popupViewBtn}/>
        </ImageBackground>
    );
}

function RenderList ({ history }) {
    if (!history.length) {
        return <></>;
    }
    const view = [];
    history.forEach(item => {
        const { receive_task_red_package_log_item_id, source, add_money, avatar, label } = item;
        view.push(
            <View style={[styles.recordItemWrap, css.flex, css.sp]} key={receive_task_red_package_log_item_id}>
                <Image source={{ uri: avatar }} style={{ width: 40, height: 40, borderRadius: 20 }}/>
                <View style={[css.flex, css.fw, styles.riwInfoWrap, css.js]}>
                    <Text numberOfLine={1} style={[styles.riwText, { fontSize: 13 }]}>{label}</Text>
                    <Text numberOfLine={1} style={styles.riwText}>{source}</Text>
                </View>
                <Text style={styles.riwMoneyText}>+{add_money}元</Text>
            </View>
        );
    });
    return (
      <>
          <View style={styles.recordWrap}>
              <Text style={styles.recordTitleText}>累计记录 <Text style={styles.rttMinTitle}> 每单任务通过，可以累计额外的金币哦</Text></Text>
              {view}
          </View>
          <Text style={styles.bottomTips}>参与更多送钱活动~</Text>
      </>
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
        color: '#fff',
        fontSize: 11,
        marginTop: 10
    },
    dmWrap: {
        height: 2175 / 1125 * width,
        width: width
    },
    lastPop: {
        alignItems: 'center',
        height: width * 0.9 * (1035 / 1026),
        justifyContent: 'flex-start',
        position: 'relative',
        transform: [{ translateX: -width * 0.05 }],
        width: width * 0.9
    },
    lastPopText: {
        marginLeft: '10%',
        marginTop: '15%',
    },
    popText: {
        color: 'rgba(232,58,41,1)',
        fontSize: 12,
        lineHeight: 25,
        maxWidth: 110,
        textAlign: 'center'
    },
    popupBg: {
        bottom: '45%',
        height: 32,
        position: 'absolute',
        width: 110
    },
    popupView: {
        height: width * 0.9 * (1035 / 1026),
        position: 'relative',
        transform: [{ translateX: -width * 0.05 }],
        width: width * 0.9,
    },
    popupViewBtn: {
        bottom: '15%',
        height: '15%',
        left: '20%',
        position: 'absolute',
        width: '70%'
    },
    progress: {
        backgroundColor: 'rgba(255,255,255,0.47)',
        borderRadius: 6,
        bottom: '40%',
        height: 15,
        left: width * 0.9 * 0.23,
        position: 'absolute',
        width: width * 0.9 * 0.64,
    },
    progressT: {
        backgroundColor: 'rgba(253,205,1,1)',
        borderRadius: 6,
        bottom: '40%',
        height: 15,
        left: width * 0.9 * 0.23,
        maxWidth: width * 0.9 * 0.64,
        position: 'absolute'
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
        marginBottom: 10,
        borderBottomColor:'#FF966D',
        borderBottomWidth:1
    },
    recordWrap: {
        marginTop:-height*.47,
        marginLeft:'3%',
        backgroundColor: '#F3462D',
        borderRadius: 8,
        width: "94%",
        padding: 15
    },
    redMaxText: {
        color: '#E13020',
        fontSize: 50,
        fontWeight: '900',
        lineHeight: width * 0.2,
        marginBottom: width * 0.07,
        marginTop: width * 0.1,
        textAlign: 'center',
        width: '100%'
    },
    redPackageWrap: {
        height: width * 0.74,
        width: width * 0.8,
        ...css.auto,
        left: '50%',
        paddingHorizontal: 10,
        top: '18%',
        transform: [{ translateX: -width * 0.4 }]
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
    },
    successPop: {
        alignItems: 'center',
        height: width * 0.9 * (765 / 1011),
        justifyContent: 'flex-start',
        transform: [{ translateX: -width * 0.05 }],
        width: width * 0.9,
    },
    successPopText: {
        color: 'rgba(153,153,153,1)',
        fontSize: 12,
        marginLeft: '10%',
        marginTop: '15%'
    },
});

export default DailyMoneyPage;
