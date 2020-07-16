import { useState, useEffect } from 'react';
import * as React from 'karet';
import * as R from 'kefir.ramda';
import {
    Dimensions,
    Image,
    SafeAreaView,
    FlatList,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    DeviceEventEmitter,
    RefreshControl, InteractionManager,
} from 'react-native';
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
import moment from 'moment';
import { _if, _tc, _toFixed, bannerAction, djangoTime, toGoldCoin, transformMoney } from '../../utils/util';
import Button from '../../components/Button';
import { N } from '../../utils/router';
import { getter, store } from '../../utils/store';
import { getNewUserTask, giveUp, newUserTask, sign, signLogs, taskReceive } from '../../utils/api';
import Choice from '../../components/Choice';
import * as U from 'karet.util';
import asyncStorage from '../../utils/asyncStorage';
import pop3 from '../../assets/icon/pop/pop3.png';
import { getActivityDetail, getTaskPlatform, task, updateSecondIncome, updateUser } from '../../utils/update';
import toast from '../../utils/toast';
import { getGlobal, getPath } from '../../global/global';

// btnStatus: 状态: 1进行中2待领取3已完成4敬请期待5去摸鱼夺宝6去绑定
const { width } = Dimensions.get('window');
const { banner, signConfig, activityObj, openid, authorization, today_pass_num, taskPlatform, user_id, signDayNumber } = getter(['banner', 'signConfig', 'authorization', 'activityObj', 'user.openid', 'user.today_pass_num', 'user.user_id', 'taskPlatform', 'signDayNumber']);
const NEW_USER_TASK_TYPE = {
    1: {
        label: '看视频领金币',
        icon: answer1,
        path: 'NoviceVideoPage'
    },
    2: {
        label: '绑定微信领金币',
        icon: answer3,
        path: 'WeChatBindPage'
    },
    3: {
        label: '摸鱼夺宝得奖励',
        icon: answer13,
        path: 'TaskDetailPage'
    }
};
function AnswerPage () {
    const [signDay, setSignDay] = useState(0);
    const [isSign, setIsSign] = useState(false);
    const [newUser, setNewUser] = useState([]);
    const [refreshing] = useState(false);
    let reloadEmitter;
    const book = 1;
    let scrollToListener;
    let scrollViewRef;
    !authorization.get() && N.replace('VerificationStackNavigator');
    useEffect(() => {
        InteractionManager.runAfterInteractions(async () => {
            _tc(async () => {
                await init();
                reloadEmitter = DeviceEventEmitter.addListener('reloadAnswer', async () => {
                    await init();
                });
                scrollToListener = DeviceEventEmitter.addListener('answerScroll', (res) => {
                    viewScroll(res);
                });
            });
        });
        return () => {
            reloadEmitter && reloadEmitter.remove();
            scrollToListener && scrollToListener.remove();
        };
    }, []);

    function viewScroll (res) {
        InteractionManager.runAfterInteractions(() => {
            if (scrollViewRef && res) {
                if (res === 'end') {
                    scrollViewRef.scrollToEnd({ animated: true, duration: 500 });
                } else {
                    scrollViewRef.scrollTo(0, res, true);
                }
            }
        });
    }

    async function init () {
        await _signLogs();
        await _newUserTask();
        await getTaskPlatform();
    }

    async function _signLogs () {
        const ret = await signLogs();
        if (!ret.error && ret.data.length) {
            setSignDay(ret.data.length);
            setIsSign(Boolean(ret.data.filter(item => new Date(item.created_at).getDay() === (new Date().getDay())).length));
        }
    }

    async function _newUserTask () {
        const balances = [];
        const finish = [];
        const types = [];
        const localUserData = [];
        newUserTask().then(ret => {
            if (!ret.error) {
                const localData = ret.data.map(task => {
                    const { add_balance, task_type } = task;
                    balances[task_type] = ((balances[task_type] || 0) * 100 + add_balance * 100) / 100;
                    return task;
                });
                localData.forEach(item => {
                    const { is_finish, task_type } = item;
                    if (!is_finish) {
                        finish[task_type] = true;
                    }
                    if (!types[task_type]) {
                        types[task_type] = true;
                        localUserData.push(Object.assign(item, { add_balance: balances[task_type] }));
                    }
                });
                setNewUser(localUserData.map(item => {
                    const { task_type } = item;
                    return Object.assign(item, {
                        is_finish: !finish[task_type]
                    });
                }));
            }
        });
    }

    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: '#fff' }]} >
            <ScrollView style={{ flex: 1 }} ref={ref => {
                ref && (scrollViewRef = ref);
            } } refreshControl={
                <RefreshControl
                    refreshing={false}
                    onRefresh={async () => {
                        await init();
                        updateUser();
                    }}
                    colors={['#c8b799', '#ffa11b']}
                    tintColor={'#ffa11b'}
                    size={10}
                />
            }>
                <View style={{ width, height: 30, backgroundColor: '#fff' }}/>
                <Slider data={banner.get()} height={width * 0.29} autoplay={true} onPress={item => bannerAction(item.category, item.link, item.title)}/>
                <View style={styles.answerWrap}>
                    <ComTitle title={'每日签到'} minTitle={<Text style={[css.minTitle, css.sy]}>连续签到得 <Text style={[{ color: '#FF6C00' }, css.sy]}>兑换免手续费特权卡!</Text></Text>}/>
                    <RenderDaySign isSign={isSign} signDay={signDay} setSignDay={setSignDay}/>
                </View>
                {_if(getPath(['configObj', 'app_other_info', 'value', 'zoneOfAction'], getGlobal('app')), res => <View style={[styles.answerWrap, { borderTopWidth: 15, borderTopColor: '#f8f8f8' }]}>
                    <ComTitle title={'火爆活动'}/>
                    <RenderActivity zoneOfAction={res}/>
                </View>)}
                <Reward newUser={newUser} _newUserTask={_newUserTask}/>
                <RenderTaskView />
            </ScrollView>
        </SafeAreaView>
    );
}

function Reward ({ newUser = [], _newUserTask }) {
    if (newUser.filter(item => !item.is_finish).length) {
        return (
            <View style={[styles.answerWrap, { borderTopWidth: 15, borderTopColor: '#f8f8f8' }]}>
                <ComTitle title={'新手福利'}/>
                <RenderNewList list={newUser} _newUserTask={_newUserTask}/>
            </View>
        );
    }
    return <></>;
}

function RenderDaySign ({ signDay, isSign, setSignDay }) {
    const [signBtnText, setSignBtnText] = useState('签到');
    const [hadSign, setHadSign] = useState(false);
    const view = [];
    const nowTime = moment(new Date()).format('MM-DD');
    useEffect(() => {
        if (isSign || (signDayNumber.get() === nowTime)) {
            setSignBtnText('已签到');
            setHadSign(true);
        }
    }, []);

    async function _sign (callback) {
        try {
            const ret = await sign();
            callback && callback();
            if (ret && !ret.error) {
                if (ret.data && ret.data.prop) {
                    DeviceEventEmitter.emit('showPop', <Choice info={{
                        icon: pop5,
                        tips: <Text>签到成功! 您成功获得<Text style={{ color: '#FF6C00' }}>{ret.data.prop.label}</Text> </Text>,
                        minTips: '请在"我的-立即兑换-金币记录"查看收益详情',
                        type: 'oneBtn',
                        rt: '我知道了',
                    }}/>);
                } else {
                    DeviceEventEmitter.emit('showPop', <Choice info={{
                        icon: pop5,
                        tips: <Text>签到成功! 您成功获得<Text style={{ color: '#FF6C00' }}>{transformMoney(ret.data.add_balance, 0)}金币</Text> </Text>,
                        minTips: '请在"我的-立即兑换-金币记录"查看收益详情',
                        type: 'oneBtn',
                        rt: '我知道了',
                    }}/>);
                }
                setSignDay(signDay + 1);
                setSignBtnText('已签到');
                setHadSign(true);
                asyncStorage.setItem('signDayNumber', nowTime);
            } else if (ret.error === 3) {
                setSignBtnText('已签到');
                setHadSign(true);
            } else if (ret.error === 8) {
                DeviceEventEmitter.emit('answerScroll', 'end');
                DeviceEventEmitter.emit('comTitlePop', {
                    key: 'taskTips', str: '通过10次"摸鱼夺宝"后即可签到~'
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    view.push(
        <RenderSignList signDay={signDay} key="RenderDaySign-1"/>
    );
    view.push(
        <View style={[css.flex, css.sp, styles.signAllWrap]} key="RenderDaySign-2">
            <View style={[css.flex, css.fw, styles.signTipsWrap]}>
                <Text style={[styles.signTipsText, styles.maxSTT]}>完成进度: <Text style={{ color: '#FF6C00' }} karet-lift>{U.ifElse(R.equals(today_pass_num, undefined), 0, today_pass_num)}</Text>/10</Text>
                <Text style={[styles.signTipsText, { ...css.sy }]}>通过10次"摸鱼夺宝"即可签到</Text>
            </View>
            <Button key={`${signBtnText}${signDay}`} width={120} name={signBtnText} disable={hadSign} shadow={'#ff0008'} onPress={async (callback) => {
                await _sign(callback);
            }}/>
        </View>
    );
    return <>{view}</>;
}

function RenderSignList ({ signDay }) {
    try {
        const view = [];
        const signConfigObj = signConfig.get();
        for (const day in signConfigObj) {
            const item = signConfigObj[day];
            view.push(
                <View key={`sign${day}`} style={[css.flex, css.fw, styles.signItemWrap, { backgroundColor: day <= signDay ? '#FF9C00' : '#F0F0F0' }]}>
                    <Text style={[styles.signText, { color: day <= signDay ? '#fff' : '#353535', }]}>{_if(item.add_balance, res => transformMoney(res, 0), () => '特权卡')}</Text>
                    <ImageAuto key={`${day}img`} source={item.prop ? item.prop.icon : day <= signDay ? answer11 : answer9} width={width * 0.08}/>
                    <Text style={[styles.signText, { color: day <= signDay ? '#fff' : '#353535', lineHeight: 18 }]}>{day}天</Text>
                </View>
            );
        }
        return (
            <View key={'dayList'} style={[styles.signAllTopWrap, css.flex]}>
                {view}
            </View>
        );
    } catch (e) {
        return <View/>;
    }
}

function RenderActivity ({ zoneOfAction }) {
    try {
        const view = [];
        const rightView = [];
        zoneOfAction.forEach((item) => {
            if (item.direction === 'left') {
                view.push(
                    <TouchableOpacity onPress={() => {
                        if (item.path === 'OpenMoneyPage') {
                            getActivityDetail();
                        } else {
                            _tc(() => N.navigate(item.path, { activityId: item.activity_id }));
                        }
                    }} key={item.path}>
                        <ImageAuto source={item.image} width={width * 0.9 * 0.48}/>
                    </TouchableOpacity>
                );
            }
        });
        zoneOfAction.forEach((item) => {
            if (item.direction === 'right') {
                rightView.push(
                    <TouchableOpacity style={{
                        marginBottom: 10
                    }} onPress={() => {
                        if (item.path === 'OpenMoneyPage') {
                            getActivityDetail();
                        } else {
                            _tc(() => N.navigate(item.path, { activityId: item.activity_id }));
                        }
                    }} key={item.path}>
                        <ImageAuto source={item.image} style={{
                            width: width * 0.9 * 0.48
                        }}/>
                    </TouchableOpacity>
                );
            }
        });
        view.push(
            <View style={[css.flex, css.fw, styles.activityRight]} key={'appPage'}>
                {rightView}
            </View>,
        );
        return <View style={[css.flex, css.sp, { paddingHorizontal: 10, paddingTop: 15 }]} key={'activity'}>{view}</View>;
    } catch (e) {
        return <Text>{JSON.stringify(e)}</Text>;
    }
}

function RenderNewList ({ list = [], _newUserTask }) {
    const view = [];

    list.forEach((item, index) => {
        const { new_user_task_id, task_type, add_balance, is_finish } = item;
        view.push(
            <View style={[styles.answerItemWrap, css.flex, css.sp, { borderBottomWidth: index + 1 >= list.length ? 0 : 1 }]} key={new_user_task_id}>
                <View style={[css.flex, styles.aiwLeft, css.js]}>
                    <ImageAuto source={NEW_USER_TASK_TYPE[task_type].icon} width={40}/>
                    <View style={[css.flex, css.fw, styles.aiwText]}>
                        <View style={[css.flex, css.js, { width: '100%' }]}>
                            <Text style={[styles.labelText, { width: 'auto' }]} numberOfLines={1}>{NEW_USER_TASK_TYPE[task_type].label}</Text>
                            <Text style={styles.labelMoney} numberOfLines={1}> +{_toFixed(toGoldCoin(add_balance), 0)}</Text>
                            <ImageAuto source={answer14} width={20}/>
                        </View>
                        <Text style={[styles.labelText, styles.labelMinTitle, { color: '#999' }]} numberOfLines={1}>{NEW_USER_TASK_TYPE[task_type].label}</Text>
                    </View>
                </View>
                <RenderNewBtn _newUserTask={_newUserTask} item={item}/>
            </View>
        );
    });
    return <>{view}</>;
}

function RenderNewBtn ({ item, _newUserTask }) {
    const { new_user_video } = getter(['new_user_video']);
    const { is_finish, task_type, new_user_task_id, add_balance } = item;

    function getReward () {
        getNewUserTask(new_user_task_id).then(r => {
            if (!r.error) {
                _newUserTask();
                DeviceEventEmitter.emit('showPop',
                    <Choice info={{
                        icon: pop3,
                        tips: '太棒了～',
                        minTips: `你成功获得${transformMoney(add_balance, 0)}金币`,
                        type: 1,
                        rt: '我知道了',
                        fontSize: 15
                    }} />);
            }
        });
    }

    const view = U.mapValue(id => <>{
        U.mapValue(v => {
            const localArray = [false, v, id, false];
            const status = is_finish ? 3 : localArray[task_type] ? 2 : 5;
            const btnText = is_finish ? '已完成' : localArray[task_type] ? '领取奖励' : '去完成';
            const path = NEW_USER_TASK_TYPE[task_type].path;
            switch (status) {
            case 2:return <Text style={styles.todoTaskText} onPress={getReward}>{btnText}</Text>;
            case 5:return (
                <Text style={styles.todoTaskText} onPress={ () => {
                    if (path === 'TaskDetailPage') {
                        const localTaskPlatform = taskPlatform.get() || [];
                        const local = localTaskPlatform.filter(platform => platform.accounts.length || !platform.need_bind);
                        if (local.length) {
                            task(local[0].platform_category);
                        } else {
                            N.navigate('AccountHomePage');
                        }
                    } else {
                        N.navigate(path);
                    }
                }}>{btnText}</Text>
            );
            default:return <Shadow style={styles.todoBtn} color={'#d43912'}><Text style={styles.todoBtnText}>{btnText}</Text></Shadow>;
            }
        }, new_user_video)
    }</>, openid);

    return <>{view}</>;
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
                <ComTitle title={'摸鱼夺宝'} emitterKey={'taskTips'} canTips={true}/>
                <RenderList />
            </View>
        </>
    );
}

function RenderList () {
    function searchAccount (accounts, need_bind) {
        let name = '绑定账号';
        let btnText = '绑定账号';
        let btnStatus = 6;
        if (need_bind) {
            accounts.forEach(account => {
                const { is_current, nickname } = account;
                if (is_current) {
                    name = `账号：${nickname}`;
                    btnText = '摸鱼夺宝';
                    btnStatus = 5;
                }
            });
        } else {
            name = '';
            btnText = '摸鱼夺宝';
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
        const { minTitle, label, icon } = U.destructure(item);
        return (
            <View style={[styles.answerItemWrap, css.flex, css.sp, { borderBottomWidth: index + 1 >= taskPlatform.get().length ? 0 : 0.5 }]} key={`${index}list`}>
                <View style={[css.flex, styles.aiwLeft, css.js]}>
                    <Image karet-lift source={U.template({ uri: icon })} style={{ width: 40, height: 40 }}/>
                    <View style={[css.flex, css.fw, styles.aiwText, { paddingLeft: 0, justifyContent: 'flex-start' }]}>
                        <Text karet-lift style={styles.KLabelText } numberOfLines={1}>{label}</Text>
                        {U.ifElse(R.equals(minTitle, ''), <></>, <Text karet-lift style={styles.KLabelMinTitle} numberOfLines={1}>{minTitle}</Text>)}
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
        taskReceive(1, 1, 1).then(r => {
            if (!r.error) {
                const { data } = r;
                if (data.length) {
                    DeviceEventEmitter.emit('showPop', <Choice info={{
                        icon: pop8,
                        tips: '您正在参与摸鱼夺宝',
                        rt: '继续',
                        lt: '放弃',
                        rc: () => {
                            task(platform_category);
                        },
                        lc: () => {
                            data.forEach(task => {
                                giveUp(task.receive_task_id).then(r => {
                                    !r.error && toast('放弃成功');
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
        paddingLeft: 10,
        textAlign: 'left',
        width: '100%',
        ...css.sy,
        marginTop: -6
    },
    KLabelText: {
        color: '#222',
        paddingLeft: 10,
        textAlign: 'left',
        width: 'auto'
    },
    activityRight: {
        height: '100%',
        marginLeft: width * 0.9 * 0.05,
        width: width * 0.9 * 0.48
    },
    aiwLeft: {
        height: '100%',
        overflow: 'hidden',
        width: width * 0.9 - 80,
    },
    aiwText: {
        height: '100%',
        overflow: 'hidden',
        paddingBottom: 5,
        paddingLeft: 10,
        width: width * 0.9 - 120
    },
    answerItemWrap: {
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 0.5,
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
        ...css.sy,
        marginTop: -10
    },
    labelMoney: {
        color: '#FF6C00',
        fontSize: 14,
        fontWeight: '900',
    },
    labelText: {
        color: '#222',
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
