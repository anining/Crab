import { useState, useEffect } from 'react';
import * as React from 'karet';
import * as R from 'kefir.ramda';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { css } from '../../assets/style/css';
import Slider from '../../components/Slider';
import ComTitle from '../../components/ComTitle';
import ImageAuto from '../../components/ImageAuto';
import answer1 from '../../assets/icon/answer/answer1.png';
import answer3 from '../../assets/icon/answer/answer3.png';
import answer5 from '../../assets/icon/answer/answer5.png';
import answer6 from '../../assets/icon/answer/answer6.png';
import answer8 from '../../assets/icon/answer/answer8.png';
import answer9 from '../../assets/icon/answer/answer9.png';
import answer11 from '../../assets/icon/answer/answer11.png';
import answer13 from '../../assets/icon/answer/answer13.png';
import answer14 from '../../assets/icon/answer/answer14.png';
import pop5 from '../../assets/icon/pop/pop5.png';
import pop8 from '../../assets/icon/pop/pop8.png';
import Shadow from '../../components/Shadow';
import { _if, _tc, bannerAction, transformMoney } from '../../utils/util';
import Button from '../../components/Button';
import { N } from '../../utils/router';
import { getter, store } from '../../utils/store';
import { getNewUserTask, giveUp, newUserTask, sign, signLogs, taskReceive } from '../../utils/api';
import Choice from '../../components/Choice';
import * as U from 'karet.util';
import asyncStorage from '../../utils/asyncStorage';
import pop3 from '../../assets/icon/pop/pop3.png';
import { getTaskPlatform, task } from '../../utils/update';
import toast from '../../utils/toast';

// btnStatus: 状态: 1进行中2待领取3已完成4敬请期待5去做任务6去绑定
const { width } = Dimensions.get('window');
const { banner, signConfig, activityObj, openid, authorization, today_task_num, taskPlatform, user_id } = getter(['banner', 'signConfig', 'authorization', 'activityObj', 'user.openid', 'user.today_task_num', 'user.user_id', 'taskPlatform']);
const NEW_USER_TASK_TYPE = {
    1: {
        label: '看视频领金币',
        icon: answer1,
        path: ''
    },
    2: {
        label: '绑定账号领金币',
        icon: answer3,
        path: 'AccountHomePage'
    },
    3: {
        label: '做任务得奖励',
        icon: answer13,
        path: ''
    }
};

function AnswerPage () {
    const [signDay, setSignDay] = useState(0);
    const [newUser, setNewUser] = useState([]);

    !authorization.get() && N.replace('VerificationStackNavigator');

    useEffect(() => {
        init();
    }, []);

    async function init () {
        await _signLogs();
        await _newUserTask();
        await getTaskPlatform();
    }

    async function _signLogs () {
        const ret = await signLogs();
        !ret.error && setSignDay(ret.data.length);
    }

    async function _newUserTask () {
        // asyncStorage.setItem(`NEW_USER_TASK_TYPE1${user_id.get()}`, 'true');
        // asyncStorage.setItem(`NEW_USER_TASK_TYPE2${user_id.get()}`, 'true');
        // asyncStorage.setItem(`NEW_USER_TASK_TYPE3${user_id.get()}`, 'true');
        const local1 = await asyncStorage.getItem(`NEW_USER_TASK_TYPE1${user_id.get()}`);
        const local3 = await asyncStorage.getItem(`NEW_USER_TASK_TYPE3${user_id.get()}`);
        const localArray = [false, local1, openid.get(), local3];
        const ret = await newUserTask();
        if (!ret.error) {
            const localData = ret.data.map(task => {
                const { add_balance, is_finish, new_user_task_id, task_type } = task;
                return {
                    balance: add_balance,
                    id: new_user_task_id,
                    label: NEW_USER_TASK_TYPE[task_type].label,
                    minTitle: NEW_USER_TASK_TYPE[task_type].label,
                    icon: NEW_USER_TASK_TYPE[task_type].icon,
                    path: NEW_USER_TASK_TYPE[task_type].path,
                    btnText: is_finish ? '已完成' : localArray[task_type] ? '领取奖励' : '去完成',
                    btnStatus: is_finish ? 3 : localArray[task_type] ? 2 : 5,
                };
            });
            setNewUser(localData);
        }
    }

    return (
        <SafeAreaView style={[{ flex: 1, paddingTop: 20, backgroundColor: '#fff' }]}>
            <ScrollView style={{ flex: 1, paddingTop: 20 }}>
                <Slider data={banner.get()} height={width * 0.29} autoplay={true} onPress={item => bannerAction(item.category, item.link, item.title)}/>
                <View style={styles.answerWrap}>
                    <ComTitle title={'每日签到'} minTitle={<Text style={css.minTitle}>连续签到得 <Text style={{ color: '#FF6C00' }}>提现免手续费特权卡!</Text></Text>}/>
                    <RenderDaySign signDay={signDay} setSignDay={setSignDay}/>
                </View>
                <View style={[styles.answerWrap, { borderTopWidth: 15, borderTopColor: '#f8f8f8' }]}>
                    <ComTitle title={'火爆活动'}/>
                    <RenderActivity />
                </View>
                <Reward newUser={newUser} _newUserTask={_newUserTask}/>
                <RenderTaskView />
            </ScrollView>
        </SafeAreaView>
    );
}

function Reward ({ newUser = [], _newUserTask }) {
    const localNewUser = newUser.filter(item => item.btnStatus !== 3);

    if (localNewUser.length) {
        return (
            <View style={[styles.answerWrap, { borderTopWidth: 15, borderTopColor: '#f8f8f8' }]}>
                <ComTitle title={'新手福利'}/>
                <RenderNewList list={newUser} _newUserTask={_newUserTask}/>
            </View>
        );
    }
    return <></>;
}

function RenderDaySign ({ signDay, setSignDay }) {
    const [signBtnText, setSignBtnText] = useState('签到领钱');
    const [hadSign, setHadSign] = useState(false);
    const view = [];

    async function _sign () {
        const ret = await sign();
        if (ret && !ret.error) {
            if (ret.prop) {
                DeviceEventEmitter.emit('showPop', <Choice info={{
                    icon: pop5,
                    tips: <Text>签到成功! 您成功获得<Text style={{ color: '#FF6C00' }}>{ret.prop.label}</Text> </Text>,
                    minTips: '请在"我的-我的背包"查看收益详情',
                    type: 'oneBtn',
                    rt: '我知道了',
                }}/>);
            } else {
                DeviceEventEmitter.emit('showPop', <Choice info={{
                    icon: pop5,
                    tips: <Text>签到成功! 您成功获得<Text style={{ color: '#FF6C00' }}>{transformMoney(ret.data.add_balance)}金币</Text> </Text>,
                    minTips: '请在"我的-我的背包"查看收益详情',
                    type: 'oneBtn',
                    rt: '我知道了',
                }}/>);
            }
            setSignDay(signDay + 1);
            setSignBtnText('已签到');
            setHadSign(true);
        } else if (ret.error === 3) {
            setSignBtnText('已签到');
            setHadSign(true);
        }
    }

    view.push(
        <RenderSignList signDay={signDay} key="RenderDaySign-1"/>
    );
    view.push(
        <View style={[css.flex, css.sp, styles.signAllWrap]} key="RenderDaySign-2">
            <View style={[css.flex, css.fw, styles.signTipsWrap]}>
                <Text style={[styles.signTipsText, styles.maxSTT]}>完成进度: <Text style={{ color: '#FF6C00' }}>{today_task_num.get() || 0}</Text>/10</Text>
                <Text style={[styles.signTipsText]}>提交并通过10单任务即可签到</Text>
            </View>
            <Button key={`${signBtnText}${signDay}`} width={120} name={signBtnText} disable={hadSign} shadow={'#ff0008'} onPress={async (callback) => {
                await _sign();
                callback();
            }}/>
        </View>
    );
    return <>{view}</>;
}

function RenderSignList ({ signDay }) {
    const view = [];
    const signConfigObj = signConfig.get();
    for (const day in signConfigObj) {
        const item = signConfigObj[day];
        view.push(
            <View key={`sign${day}`} style={[css.flex, css.fw, styles.signItemWrap, { backgroundColor: day <= signDay ? '#FF9C00' : '#F0F0F0' }]}>
                <Text style={[styles.signText, { color: day <= signDay ? '#fff' : '#353535', }]}>{_if(item.add_balance, res => transformMoney(res))}</Text>
                <ImageAuto source={item.prop ? item.prop.icon : day <= signDay ? answer11 : answer9} width={item.prop ? width * 0.055 : width * 0.07}/>
                <Text style={[styles.signText, { color: day <= signDay ? '#fff' : '#353535', lineHeight: 18 }]}>{day}天</Text>
            </View>
        );
    }
    return (
        <View key={'dayList'} style={[styles.signAllTopWrap, css.flex]}>
            {view}
        </View>
    );
}

function RenderActivity () {
    const view = [];
    view.push(
        <TouchableOpacity activeOpacity={1} onPress={() => {
            _tc(() => N.navigate('DailyRedPackagePage', { activityId: (activityObj.get() || {})[1].activity_id }));
        }} key={'DailyRedPackagePage'}>
            <ImageAuto source={answer5} width={width * 0.9 * 0.48}/>
        </TouchableOpacity>,
    );
    view.push(
        <View style={[css.flex, css.fw, styles.activityRight]} key={'appPage'}>
            <TouchableOpacity activeOpacity={1} style={styles.arItemWrap} onPress={() => N.navigate('SharePage')} key={'SharePage'}>
                <ImageAuto source={answer6} width={width * 0.9 * 0.48}/>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} style={styles.arItemWrap} onPress={() => {
                _tc(() => N.navigate('OpenMoneyPage', { activityId: (activityObj.get() || {})[2].activity_id }));
            }} key={'OpenMoneyPage'}>
                <ImageAuto source={answer8} width={width * 0.9 * 0.48}/>
            </TouchableOpacity>
        </View>,
    );
    return <View style={[css.flex, css.sp, { paddingHorizontal: 10 }]} key={'activity'}>{view}</View>;
}

function RenderNewList ({ list = [], _newUserTask }) {
    const view = [];

    list.forEach((item, index) => {
        const { minTitle, btnStatus, icon, balance, label, id } = item;
        view.push(
            <View style={[styles.answerItemWrap, css.flex, css.sp, { borderBottomWidth: index + 1 >= list.length ? 0 : 1 }]} key={id}>
                <View style={[css.flex, styles.aiwLeft, css.js]}>
                    <ImageAuto source={icon} width={40}/>
                    <View style={[css.flex, css.fw, styles.aiwText]}>
                        <View style={[css.flex, css.js, { width: '100%' }]}>
                            <Text style={[styles.labelText, { width: 'auto' }]} numberOfLines={1}>{label}</Text>
                            <Text style={styles.labelMoney} numberOfLines={1}> +{balance}</Text>
                            <ImageAuto source={answer14} width={20}/>
                        </View>
                        <Text style={[styles.labelText, styles.labelMinTitle, { color: btnStatus === 5 ? '#999' : '#53C23B' }]} numberOfLines={1}>{minTitle}</Text>
                    </View>
                </View>
                <RenderNewBtn _newUserTask={_newUserTask} item={item}/>
            </View>
        );
    });
    return <>{view}</>;
}

function RenderNewBtn ({ item, _newUserTask }) {
    const { btnStatus, btnText, path, id, balance } = item;

    function getReward () {
        getNewUserTask(id).then(r => {
            if (!r.error) {
                _newUserTask();
                DeviceEventEmitter.emit('showPop',
                    <Choice info={{
                        icon: pop3,
                        tips: '太棒了～',
                        minTips: `你成功获得${balance}奖励`,
                        type: 1,
                        rt: '我知道了',
                        fontSize: 15
                    }} />);
            }
        });
    }

    switch (btnStatus) {
    // 领取奖励
    case 2:return <Text style={styles.todoTaskText} karet-lift onPress={getReward}>{btnText}</Text>;
    // 去完成
    case 5:return <Text style={styles.todoTaskText} onPress={ () => { N.navigate(path); }}>{btnText}</Text>;
    // 已完成
    default:return <Shadow style={styles.todoBtn} color={'#d43912'}><Text style={styles.todoBtnText}>{btnText}</Text></Shadow>;
    }
}

function RenderTaskView () {
    const authorization = U.view(['authorization'], store).get();

    if (!authorization) {
        return <></>;
    }
    return (
        <>
            <View style={{ height: 15, backgroundColor: '#f8f8f8' }}/>
            <View style={[styles.answerWrap, { borderBottomWidth: 20, borderBottomColor: '#f8f8f8' }]}>
                <ComTitle title={'领金币'}/>
                <RenderList />
            </View>
        </>
    );
}

function RenderList () {
    function searchAccount (accounts, need_bind) {
        let name = '绑定做单账号';
        let btnText = '绑定账号';
        let btnStatus = 6;
        if (need_bind) {
            accounts.forEach(account => {
                const { is_current, nickname } = account;
                if (is_current) {
                    name = `做单账号：${nickname}`;
                    btnText = '去做任务';
                    btnStatus = 5;
                }
            });
        } else {
            name = '';
            btnText = '去做任务';
            btnStatus = 5;
        }

        return { name, btnText, btnStatus };
    }

    const localTaskPlatform = U.mapValue(platform => platform.map(item => {
        const { need_bind, accounts } = item;
        const { name, btnText, btnStatus } = searchAccount(accounts, need_bind);
        return { minTitle: name, btnText, btnStatus, ...item };
    }), taskPlatform);

    const view = U.mapElems((item, index) => {
        const { minTitle, btnStatus, money, label, icon } = U.destructure(item);
        return (
            <View style={[styles.answerItemWrap, css.flex, css.sp, { borderBottomWidth: index + 1 >= taskPlatform.get().length ? 0 : 1 }]} key={`${index}list`}>
                <View style={[css.flex, styles.aiwLeft, css.js]}>
                    <Image karet-lift source={U.template({ uri: icon })} style={{ width: 40, height: 40 }}/>
                    <View style={[css.flex, css.fw, styles.aiwText]}>
                        <View style={[css.flex, css.js, { width: '100%' }]}>
                            <Text karet-lift style={styles.KLabelText } numberOfLines={1}>{label}</Text>
                            <Text karet-lift style={styles.labelMoney} numberOfLines={1}> +{money}</Text>
                            <ImageAuto source={answer14} width={20}/>
                        </View>
                        <Text karet-lift style={U.template([styles.KLabelMinTitle, { color: U.ifElse(R.equals(btnStatus, 5), '#999', '#53C23B') }])} numberOfLines={1}>{minTitle}</Text>
                    </View>
                </View>
                <RenderBtn item={item}/>
            </View>
        );
    }, localTaskPlatform);

    return <>{view}</>;
}

function RenderBtn ({ item }) {
    function check (platform_category) {
        taskReceive(1, 10, 1).then(r => {
            if (!r.error) {
                const { data } = r;
                if (data.length) {
                    DeviceEventEmitter.emit('showPop', <Choice info={{
                        icon: pop8,
                        tips: '您有一个任务在进行，最多只能同时领取一个任务！',
                        rt: '继续任务',
                        lt: '放弃任务',
                        rc: () => {
                            task(platform_category);
                        },
                        lc: () => {
                            data.forEach(task => {
                                giveUp(task.receive_task_id).then(r => {
                                    !r.error && toast('放弃任务成功!');
                                });
                            });
                        }
                    }}/>);
                } else {
                    task(platform_category);
                }
            }
        });
    }

    const view = U.mapValue(i => {
        const { btnStatus, btnText, platform_category } = i;
        switch (btnStatus) {
        case 2:
        case 5:
            return <Text style={styles.todoTaskText} onPress={() => {
                check(platform_category);
            }}>{btnText}</Text>;
        case 6:
            return <Text style={[styles.todoTaskText, { borderColor: '#53C23B', color: '#53C23B' }]} onPress={() => { N.navigate('AccountHomePage'); }}>{btnText}</Text>;
        default:
            return <Shadow style={styles.todoBtn} color={'#d43912'}><Text style={styles.todoBtnText}>{btnText}</Text></Shadow>;
        }
    }, item);
    return <>{view}</>;
}

const styles = StyleSheet.create({
    KLabelMinTitle: {
        color: '#999',
        fontSize: 11,
        lineHeight: 22,
        textAlign: 'left',
        width: '100%',
    },
    KLabelText: {
        color: '#222',
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'left',
        width: 'auto'
    },
    activityRight: {
        height: '100%',
        marginLeft: width * 0.9 * 0.05,
    },
    aiwLeft: {
        height: '100%',
        overflow: 'hidden',
        width: width * 0.9 - 80,
    },
    aiwText: {
        height: '100%',
        overflow: 'hidden',
        paddingLeft: 10,
        width: width * 0.9 - 120,
    },
    answerItemWrap: {
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        height: 65,
        paddingHorizontal: 10,
        width: width * 0.9,
        ...css.auto,
        backgroundColor: '#fff',
    },
    answerWrap: {
        backgroundColor: '#fff',
        height: 'auto',
        minHeight: 100,
        paddingHorizontal: 10,
        paddingVertical: 15,
        width: '100%'
    },
    arItemWrap: {
        height: 'auto',
        marginBottom: width * 0.05,
        width: '100%',
    },
    labelMinTitle: {
        color: '#999',
        fontSize: 11,
    },
    labelMoney: {
        color: '#FF6C00',
        fontSize: 14,
        fontWeight: '900',
    },
    labelText: {
        color: '#222',
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'left',
        width: '100%',
    },
    maxSTT: {
        color: '#222',
        fontSize: 13,
        fontWeight: '900',
    },
    signAllTopWrap: {
        marginTop: 15,
    },
    signAllWrap: {
        height: 70,
        marginTop: 10,
        paddingHorizontal: 5,
    },
    signItemWrap: {
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        height: 70,
        marginRight: width * 0.9 * 0.01,
        overflow: 'hidden',
        width: width * 0.9 * 0.132,
    },
    signText: {
        color: '#666',
        fontSize: 10,
        lineHeight: 12,
        textAlign: 'center',
        width: '100%',
    },
    signTipsText: {
        color: '#353535',
        fontSize: 12,
        lineHeight: 22,
        textAlign: 'left',
        width: '100%',
    },
    signTipsWrap: {
        height: '100%',
        width: width * 0.9 - 120,
    },
    todoBtn: {
        borderRadius: 13,
        height: 26,
        width: 70,
    },
    todoBtnText: {
        backgroundColor: '#FF3E00',
        borderRadius: 12,
        color: '#fff',
        fontSize: 12,
        height: 26,
        lineHeight: 26,
        textAlign: 'center',
        width: '100%',
    },
    todoTaskText: {
        borderColor: '#FF3B00',
        borderRadius: 13,
        borderWidth: 1,
        color: '#FF3B00',
        fontSize: 12,
        height: 26,
        lineHeight: 26,
        textAlign: 'center',
        width: 70,
    }
});

export default AnswerPage;
