import React, { useState, useEffect } from 'react';
import { DeviceEventEmitter, Dimensions, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { css } from '../../assets/style/css';
import activity8 from '../../assets/icon/activity/activity8.png';
import activity9 from '../../assets/icon/activity/activity9.png';
import activity10 from '../../assets/icon/activity/activity10.png';
import activity11 from '../../assets/icon/activity/activity11.png';
import activity12 from '../../assets/icon/activity/activity12.png';
import activity13 from '../../assets/icon/activity/activity13.png';
import task11 from '../../assets/icon/task/task11.png';
import Header from '../../components/Header';
import header3 from '../../assets/icon/header/header3.png';
import ImageAuto from '../../components/ImageAuto';
import CountDown from '../../components/CountDown';
import { N } from '../../utils/router';
import { activityDetail, getReceiveTaskAward } from '../../utils/api';
import { djangoTime, transformMoney } from '../../utils/util';
import { getter } from '../../utils/store';

const { width } = Dimensions.get('window');
const { today_pass_num, activityObj } = getter(['user.today_pass_num', 'activityObj']);

function DailyRedPackagePage (props) {
    const { activityId = (activityObj.get() || {})[1].activity_id } = props.route.params;
    const [rule, setRule] = useState([]);
    const [endDatetime, setEndDatetime] = useState('2020/12/12');

    useEffect(() => {
        detail();
    }, []);

    function format (rule, logs) {
        const arr = [];
        for (const r in rule) {
            const obj = { isOpen: false };
            logs.forEach(log => {
                if (Number(log.level) === Number(r)) {
                    obj.isOpen = true;
                }
            });
            arr.push(Object.assign({ level: Number(r) }, obj, rule[r]));
        }
        return arr;
    }

    function detail () {
        activityDetail(activityId).then(r => {
            try {
                const { data, error } = r;
                if (error) {
                    N.goBack();
                } else {
                    const { logs, setting, end_datetime } = data;
                    setEndDatetime(end_datetime);
                    const { rule } = setting;
                    setRule(format(rule, logs));
                }
            } catch (e) {
                N.goBack();
            }
        });
    }

    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#f8f8f8' }]}>
            <ScrollView style={[{ flex: 1, backgroundColor: '#FF6123', ...css.pr }]}>
                <ImageAuto source={activity8} style={{ width: width, ...css.pa, zIndex: -1 }}/>
                <Header color={'#fff'} label={'天天领红包'} style={{ backgroundColor: 'rgba(0,0,0,0)', borderBottomWidth: 0 }} icon={header3}/>
                <View style={[styles.allRedPackWrap, css.pr]}>
                    <ImageBackground source={activity9} style={[css.pa, styles.arpImage, css.flex]}>
                        <View style={[styles.activeTitleWrap, css.flex, css.fw]}>
                            <Text style={styles.atwTitle}>活动倒计时</Text>
                            <CountDown time={new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600000 - 1} type="timestamp" style={{ color: '#fff', fontSize: 15, letterSpacing: 4 }}/>
                        </View>
                    </ImageBackground>
                    <RenderRedItem rule={rule} activityId={activityId} detail={detail}/>
                </View>
                <ImageAuto source={activity13} style={{ width: width * 0.94, ...css.auto }}/>
                <View style={{ height: 20 }}/>
            </ScrollView>
        </SafeAreaView>
    );
}

function RenderRedItem ({ rule, activityId, detail }) {
    const view = [];

    function ReceiveTaskAward (level) {
        getReceiveTaskAward(level, activityId).then(r => {
            if (!r.error) {
                detail();
                const { add_balance } = r.data;
                DeviceEventEmitter.emit('showPop', { dom: <Popup money={add_balance} twice={level === 6 ? 0 : rule[level - 1].min_add_balance}/> });
            }
        });
    }

    rule.forEach(item => {
        const { min_add_balance, isOpen, level, need_task_num } = item;
        view.push(
            <TouchableOpacity activeOpacity={1} onPress={() => {
                if (!isOpen && Number(need_task_num) <= Number(today_pass_num.get())) {
                    ReceiveTaskAward(level);
                }
            }} key={need_task_num} >
                <RenderBg isOpen={isOpen} last={level === rule.length} min_add_balance={min_add_balance} today_pass_num={today_pass_num} need_task_num={need_task_num}/>
            </TouchableOpacity>
        );
    });
    return (
        <View style={[styles.arpInnerWrap, css.flex, css.fw, css.sp]}>
            {view}
        </View>
    );
}

function RenderBg ({ isOpen, last, today_pass_num, need_task_num, min_add_balance }) {
    const source = last ? activity11 : activity10;
    if (isOpen) {
        return (
            <ImageBackground source={activity12} style={[styles.redItemBg, css.flex, css.afs, css.fw]}>
                <Text style={[styles.redItemText, { fontSize: 13, lineHeight: 70, color: '#FF4A0A', fontWeight: '800' }]} numberOfLines={1}>已领取</Text>
            </ImageBackground>
        );
    }
    return (
        <ImageBackground source={source} style={[styles.redItemBg, css.flex, css.afs, css.fw]}>
            <Text style={[styles.redItemText, { color: 'rgba(255,255,255,.7)' }]} numberOfLines={1}>最低{transformMoney(min_add_balance)}金币</Text>
            <Text style={[styles.redItemText]} numberOfLines={1}>完成进度<Text style={{ color: last ? '#FE2E43' : '#fff' }}>{today_pass_num.get()}</Text>/{need_task_num}</Text>
        </ImageBackground>
    );
}

function Popup ({ money = 0, twice = 0 }) {
    if (twice) {
        return (
            <ImageBackground source={task11} style={{ height: width * 0.8 * 416 / 322, width: width * 0.8 }}>
                <Text numberOfLines={1} style={styles.popupTitle}>{money} <Text style={{ fontSize: 18, fontWeight: '400' }}>元</Text></Text>
                <Text numberOfLines={1} style={styles.popupText}>加油哦！再做10个任务</Text>
                <Text numberOfLines={1} style={styles.popupText}>至少还能再开<Text style={{ color: '#FF3B00' }}>{twice}元</Text></Text>
            </ImageBackground>
        );
    } else {
        return (
            <ImageBackground source={task11} style={{ height: width * 0.8 * 416 / 322, width: width * 0.8 }}>
                <Text numberOfLines={1} style={styles.popupTitle}>{money} <Text style={{ fontSize: 18, fontWeight: '400' }}>元</Text></Text>
                <Text numberOfLines={1} style={styles.popupText}>您太棒了！</Text>
                <Text numberOfLines={1} style={styles.popupText}>您打开了今天的全部红包！</Text>
                <Text numberOfLines={1} style={styles.popupText}>快去参加其他活动吧~</Text>
            </ImageBackground>
        );
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
        paddingBottom: 10,
        paddingHorizontal: 20,
        paddingTop: 30,
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
    popupText: {
        color: '#80120F',
        fontSize: 16,
        lineHeight: 25,
        textAlign: 'center'
    },
    popupTitle: {
        color: '#FF3B00',
        fontSize: 36,
        fontWeight: '600',
        lineHeight: 70,
        marginTop: '30%',
        textAlign: 'center'
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
    }
});

export default DailyRedPackagePage;
