import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    Image,
    Linking,
    Text,
    BackHandler,
    Dimensions,
    View,
    TouchableOpacity,
    ImageBackground,
    StyleSheet,
    ScrollView,
    TextInput,
    DeviceEventEmitter
} from 'react-native';
import { css } from '../../assets/style/css';
import task4 from '../../assets/icon/task/task4.png';
import task5 from '../../assets/icon/task/task5.png';
import task6 from '../../assets/icon/task/task6.png';
import task7 from '../../assets/icon/task/task7.png';
import task8 from '../../assets/icon/task/task8.png';
import task9 from '../../assets/icon/task/task9.png';
import task12 from '../../assets/icon/task/task12.png';
import task17 from '../../assets/icon/task/task17.png';
import Upload from '../../components/Upload';
import { N } from '../../utils/router';
import { activityDetail, getTask, giveUp, taskReceive, taskReceiveDetail, taskSubmit } from '../../utils/api';
import {
    djangoTime,
    getUrl,
    requestPermission,
    saveBase64ImageToCameraRoll,
    toGoldCoin,
    transformMoney,
} from '../../utils/util';
import { captureRef } from 'react-native-view-shot';
import Choice from '../../components/Choice';
import pop3 from '../../assets/icon/pop/pop3.png';
import Header from '../../components/Header';
import { getter, store } from '../../utils/store';
import * as U from 'karet.util';
import { useFocusEffect } from '@react-navigation/native';
import toast from '../../utils/toast';
import { updateUser } from '../../utils/update';
import Button from '../../components/Button';
import CountDown from '../../components/CountDown';
import Clipboard from '@react-native-community/clipboard';

const { total_task_num, today_pass_num, activityObj } = getter(['user.total_task_num', 'activityObj', 'user.today_pass_num']);
const { width } = Dimensions.get('window');
const MENU_STATUS = {
    1: {
        text: '提交',
        color: '#fff',
        disabled: false
    },
    4: {
        text: '审核中',
        disabled: true
    },
    5: {
        text: '已通过',
        disabled: true
    },
    6: {
        text: '未通过',
        disabled: true
    }
};

function TaskDetailPage (props) {
    const [sRef, setSRef] = useState();
    const [detail, setDetail] = useState(props.route.params.detail);
    const [num, setNum] = useState(0);
    const [submits, setSubmits] = useState([]);

    useEffect(() => {
        const { course, status, submit_values = [] } = detail;
        const { submit = [] } = course;
        if (status !== 1 && submit_values && submit.length === submit_values.length) {
            setSubmits(submit.map((item, index) => Object.assign({ progress: undefined, uri: submit_values[index].uri, data: '', mime: '' }, item)));
        } else {
            setSubmits(submit.map(item => Object.assign({ progress: undefined, uri: '', data: '', mime: '' }, item)));
        }
    }, [detail]);

    useEffect(() => {
        try {
            activityDetail(activityObj.get()[1].activity_id).then(r => {
                if (!r.error) {
                    const { logs, setting } = r.data;
                    const { rule } = setting;
                    format(rule, logs);
                }
            });
        } catch (e) {
            console.log(e);
        }
    }, []);

    useFocusEffect(() => {
        const onBackPress = () => {
            if (detail.status === 1) {
                backClick();
                return true;
            } else {
                updateUser();
            }
        };
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    });

    function refresh () {
        const { receive_task_id } = detail;
        taskReceiveDetail(receive_task_id).then(r => {
            if (r.error) {
                N.goBack();
            } else {
                setDetail(r.data);
            }
        });
    }

    function format (rule, logs) {
        let level = 0;
        logs.forEach(log => {
            if (Number(log.level) > level) {
                level = Number(log.level);
            }
        });
        if (level === 0) {
            setNum(Number(rule[1].need_task_num));
        } else if (level === rule.length) {
            setNum(999999);
        } else {
            setNum(Number(rule[level + 1].need_task_num));
        }
    }

    function backClick () {
        const { status } = detail;
        if (status === 1) {
            const number = Number(today_pass_num.get()) - num < 0 ? num - Number(today_pass_num.get()) : false;
            if (number) {
                DeviceEventEmitter.emit('showPop',
                    <Choice info={{
                        icon: pop3,
                        tips: `再参与 ${number} 次就可以拆红包了`,
                        minTips: '您确定要返回首页(自动放弃)吗？',
                        lt: '返回首页',
                        lc: () => {
                            giveUp(detail.receive_task_id).then(() => {
                                taskReceive(1, 10, 1).then(() => updateUser());
                            });
                            updateUser();
                            N.goBack();
                        },
                        rt: '继续'
                    }} />);
            } else {
                taskReceive(1, 10, 1).then(() => updateUser());
                N.goBack();
            }
        } else {
            N.goBack();
        }
    }

    return (
        <SafeAreaView style={[css.safeAreaView]}>
            <Header label={'摸鱼夺宝'} backOnPress={backClick}/>
            <ScrollView style={{ backgroundColor: '#F8F8F8' }} ref={r => {
                r && setSRef(r);
            }}>
                <EndTimeView detail={detail}/>
                <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                    <DetailView refresh={refresh} detail={detail}/>
                    <ClaimView detail={detail}/>
                    <CourseView setSubmits={setSubmits} submits={submits} detail={detail}/>
                    <Btn setSubmits={setSubmits} submits={submits} sRef={sRef} detail={detail} setDetail={setDetail}/>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function EndTimeView ({ detail }) {
    const { status, finish_deadline, audit_type, receive_task_id } = detail;
    // const AUDIT_TYPE = ['普通审核', '接口审核', '通用审核', '不审核'];
    const AUDIT_TYPE = ['24小时内审核', '24小时内审核', '24小时内审核', '24小时内审核'];

    function apiGiveUp () {
        DeviceEventEmitter.emit('showPop', {
            dom: <Choice info={{
                icon: pop3,
                tips: '赏金近在咫尺啦~',
                minTips: '确定要放弃吗？',
                lt: '放弃',
                rt: '继续',
                lc: () => {
                    giveUp(receive_task_id).then(r => {
                        if (!r.error) {
                            toast('放弃成功');
                            N.goBack();
                        }
                    });
                },
                rc: () => {}
            }} />,
            close: () => {

            }
        });
    }

    if (status !== 1) {
        return <></>;
    }
    return (
        <ImageBackground source={task12} style={styles.endTimeView}>
            <View style={styles.endTimeViewItem}>
                <View style={[{ flexDirection: 'row', marginTop: 5 }]}>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>剩余时间：</Text>
                    <CountDown time={+new Date(djangoTime(finish_deadline))} style={{ color: '#FF6C00', fontSize: 16, fontWeight: '500' }} key={receive_task_id} callback={() => N.goBack()}/>
                </View>
                <TouchableOpacity onPress={apiGiveUp} style={styles.giveUpBtn}>
                    <Text style={{ color: '#fff', fontSize: 12, lineHeight: 28, textAlign: 'center' }}>放弃</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.endTimeViewItem}>
                <Text style={{ color: '#fff', fontSize: 12 }}>审核时间：{AUDIT_TYPE[audit_type] || '普通审核'}</Text>
                <Text style={{ color: '#fff', fontSize: 12 }}>超时未提交自动放弃</Text>
            </View>
        </ImageBackground>
    );
}

function DetailView ({ refresh, detail }) {
    const { task_category_label, unit_money, nickname, success_rate, status } = detail;
    if (!nickname) {
        return (
            <View style={[styles.taskDetailTop, { borderBottomWidth: 0, height: 150 * 40 / 100, backgroundColor: '#fff', borderRadius: 8, marginTop: 15 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={task4} style={{ height: 14, width: 14, marginRight: 5 }}/>
                    <Text style={{ color: '#222', fontSize: 16, fontWeight: '500' }}>{task_category_label}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={task7} style={{ height: 20, width: 19, marginRight: 5 }}/>
                    <Text style={{ color: '#FF6C00', fontSize: 24 }}>{transformMoney(unit_money, 0)}<Text style={{ fontSize: 14 }}> 金币</Text></Text>
                </View>
            </View>
        );
    }
    return (
        <View style={styles.taskDetail}>
            <View style={styles.taskDetailTop}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={task4} style={{ height: 14, width: 14, marginRight: 5 }}/>
                    <Text style={{ color: '#222', fontSize: 16, fontWeight: '500' }}>{task_category_label}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={task7} style={{ height: 20, width: 19, marginRight: 5 }}/>
                    <Text style={{ color: '#FF6C00', fontSize: 24 }}>{transformMoney(unit_money, 0)}<Text style={{ fontSize: 14 }}> 金币</Text></Text>
                </View>
            </View>
            <View style={styles.taskDetailBottom}>
                <View style={styles.DetailBV}>
                    <Text style={{ color: '#222' }}>账号：<Text style={{ color: '#262626', fontSize: 14, fontWeight: '500' }}>{nickname}</Text></Text>
                    <Text style={{ color: '#999', fontSize: 12 }}>账号通过率：<Text style={{ color: '#FF6C00', fontSize: 14, fontWeight: '500' }}>{Number.parseInt(success_rate * 100) || 0}%</Text></Text>
                </View>
                <View style={styles.DetailBV}>
                    <Text style={{ color: '#999', fontSize: 12 }}>通过率低于20%时，建议切换账号。</Text>
                    <TouchableOpacity onPress={() => {
                        status === 1 && N.navigate('AccountHomePage', { refresh });
                    }} style={[styles.changeNumber, { borderColor: status === 1 ? '#FF6C00' : '#ABABAB' }]}>
                        <Text style={{ color: status === 1 ? '#FF6C00' : '#4F4F4F', fontSize: 12, lineHeight: 28, textAlign: 'center' }}>切换账号</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

function ClaimView ({ detail }) {
    const { description } = detail;
    if (!description) {
        return <></>;
    }
    return (
        <View style={styles.taskClaim}>
            <View style={styles.taskClaimTop}>
                <Image source={task9} style={{ height: 14, width: 14, marginRight: 5 }}/>
                <Text style={{ color: '#222', fontSize: 16, fontWeight: '500' }}>参与要求</Text>
            </View>
            <Text numberOfLines={1} style={{ lineHeight: 50, paddingLeft: 10, color: '#FF4700' }}>· <Text style={{ color: '#666' }}>{description || '暂无要求'}</Text></Text>
        </View>
    );
}

function CourseView ({ setSubmits, submits = [], detail }) {
    const { course, status } = detail;
    const { task = [] } = course;
    const submitView = [];
    const taskView = [];
    let view;

    submits.forEach((submit, index) => {
        const { type, label } = submit;
        if (type === 'image') {
            submitView.push(<RenderImg index={index} status={status} key={label} item={submit} setSubmits={setSubmits} submits={submits}/>);
        } else if (type === 'text') {
            submitView.push(<RenderInput submits={submits} index={index} status={status} setSubmits={setSubmits} item={submit} key={label}/>);
        }
    });

    task.forEach(item => {
        taskView.push(<RenderView status={status} key={item.label} item={item}/>);
    });
    if (taskView.length) {
        view = (
            <View style={styles.taskCourse}>
                <View style={[styles.taskDetailTop, { height: 52 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={task6} style={{ height: 14, width: 14, marginRight: 5 }}/>
                        <Text style={{ color: '#222', fontSize: 16, fontWeight: '500' }}>参与教程</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        status === 1 && N.navigate('HelpCenterPage');
                    }}>
                        <Text style={{ color: status === 1 ? '#FF6C00' : '#4F4F4F', fontSize: 12 }}>帮助中心</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ padding: 10 }}>
                    {taskView}
                </View>
            </View>
        );
    } else {
        view = <></>;
    }
    return (
        <>
            {view}
            <View style={styles.taskUpload}>
                <View style={[styles.taskDetailTop, { height: 52 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={task5} style={{ height: 14, width: 14, marginRight: 5 }}/>
                        <Text style={{ color: '#222', fontSize: 16, fontWeight: '500' }}>提交审核</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        status === 1 && N.navigate('HelpCenterPage');
                    }}>
                        <Text style={{ color: status === 1 ? '#FF6C00' : '#4F4F4F', fontSize: 12 }}>帮助中心</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ padding: 10, }}>
                    {submitView}
                </View>
            </View>
        </>
    );
}

function RenderView ({ status, item }) {
    const { type, label, content } = item;
    const [view, setView] = useState();

    function save () {
        try {
            if (view) {
                requestPermission(() => {
                    captureRef(view, {
                        format: 'jpg',
                        quality: 1.0,
                        result: 'base64'
                    }).then(
                        uri => {
                            saveBase64ImageToCameraRoll(uri, () => toast('保存成功,请到相册查看!'), () => toast('保存失败!'));
                        },
                        () => {
                            toast('保存失败');
                        },
                    );
                }, () => {
                    toast('保存失败');
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    if (type === 'text') {
        return <TransformUrlView status={status} content={content} label={label}/>;
    } else if (type === 'schema') {
        return (
            <>
                <Text style={styles.taskCourseText}>{label}</Text>
                <Text style={[styles.saveBtnText, { width: 120, textAlign: 'center' }]} onPress={() => {
                    try {
                        status === 1 && Linking.openURL(content).then(r => { console.log(r); }).catch(e => { console.log(e); toast('打开失败'); });
                    } catch (e) {
                        console.log(e);
                        toast('打开失败');
                    }
                }}>打开该应用</Text>
            </>
        );
    }
    return (
        <>
            <Text style={styles.taskCourseText}>{label}</Text>
            <TouchableOpacity onPress={() => {
                if (status === 1) {
                    DeviceEventEmitter.emit('showPop', {
                        dom: <Image source={{ uri: content }} style={[styles.saveBtn, { width: 312, height: 398, backgroundColor: '#fff' }]}/>,
                        close: () => {}
                    });
                }
            }} style={{ marginTop: 10, marginBottom: 10 }}>
                <ImageBackground source={{ uri: content }} style={styles.saveBtn} ref={ref => setView(ref)}>
                    <TouchableOpacity onPress={() => {
                        status === 1 && save();
                    }} style={{ marginBottom: '10%' }}>
                        <Text style={styles.saveBtnText}>保存图片</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </TouchableOpacity>
        </>
    );
}

function RenderInput ({ index, status, item, setSubmits, submits = [] }) {
    const { label, content } = item;
    const localSubmits = [...submits];

    return (
        <View style={{ marginTop: 20 }}>
            <Text style={{ color: '#222' }}>{label}</Text>
            <TextInput
                editable={status === 1}
                style={styles.input}
                value={localSubmits[index].uri}
                maxLength={50}
                placeholder={content}
                onChangeText={text => {
                    localSubmits[index].uri = text;
                    setSubmits(localSubmits);
                }}
                placeholderTextColor={'#FF7008'}/>
        </View>
    );
}

function RenderImg ({ index, status, item, setSubmits, submits = [] }) {
    const { label, content } = item;

    return (
        <>
            <Text style={styles.taskCourseText}>{label}</Text>
            <RenderImage index={index} setSubmits={setSubmits} submits={submits} status={status} content={content}/>
            <Text style={{ color: '#222', lineHeight: 30 }}>（请按照示例上传截图）</Text>
        </>
    );
}

function TransformUrlView ({ content, status, label }) {
    const url = getUrl(content);
    if (url) {
        const textArray = content.split(url);
        return (
            <Text selectable={true} style={styles.taskCourseText}>{label}<Text style={{ color: '#FF6C00' }}>{textArray[0]} <Text onPress={() => {
                try {
                    status === 1 && Linking.openURL(url).then(r => { console.log(r); });
                } catch (e) {
                    console.log(e);
                    toast('打开失败');
                }
            }} style={{ color: 'red' }}> {url} </Text> {textArray[1]}</Text></Text>
        );
    } else {
        return <Text selectable={true} style={styles.taskCourseText}>{label}<Text style={{ color: '#FF6C00' }}>{content}</Text></Text>;
    }
}

function RenderImage ({ index, status, content, setSubmits, submits = [] }) {
    const { uri, mime, data } = submits[index];
    const view = <Image source={status === 1 ? (mime && data) ? { uri: `data:${mime};base64,${data}` } : task8 : { uri }} style={ styles.uploadImage}/>;

    const { progress } = submits[index];
    const progressText = status === 1 ? progress ? isNaN(progress) ? progress : `${progress} %` : '等待上传' : '';
    return (
        <View style={[css.flexRCSB, { alignItems: 'flex-start' }]}>
            <TouchableOpacity onPress={() => {
                if (status === 1) {
                    DeviceEventEmitter.emit('showPop', {
                        dom: <Image source={{ uri: content }} style={[styles.saveBtn, { width: 312, height: 398, backgroundColor: '#fff' }]}/>,
                        close: () => {}
                    });
                }
            }} style={{ marginTop: 10 }}>
                <Image source={{ uri: content }} style={[styles.uploadImage, { marginTop: 0 }]}/>
            </TouchableOpacity>
            <View>
                <Upload children={view} editable={status === 1} images={submits} setImages={setSubmits} index={index}/>
                <Text style={styles.progress}>{progressText}</Text>
            </View>
        </View>
    );
}

function UserPop ({ view }) {
    return (
        <ImageBackground source={task17} style={{ width: width * 0.8, height: width * 0.8 * (1245 / 999), position: 'relative' }}>
            {view}
        </ImageBackground>
    );
}

function Btn ({ sRef, detail, setDetail, setSubmits, submits }) {
    const { status, receive_task_id, platform_category } = detail;

    function getApiTask (callback, isBack = true) {
        DeviceEventEmitter.emit('hidePop');
        getTask(platform_category).then(r => {
            callback && callback();
            if (!r.error) {
                isBack && toast('提交成功 自动参与下一个');
                taskReceiveDetail(r.data.receive_task_id).then(response => {
                    if (response.error) {
                        N.goBack();
                    } else {
                        setDetail(response.data);
                        sRef && sRef.scrollTo({ x: 0, y: 0, animated: true });
                    }
                });
            } else {
                toast('已经没有了');
                isBack && N.goBack();
            }
        });
    }

    function showPop (type, number, callback) {
        const state = U.atom(true);
        let view;

        switch (type) {
        case 1:view = (
            <>
                <Text style={styles.userPopTitle}>恭喜您，额外获得</Text>
                <Text style={styles.userPopTips}>{toGoldCoin(number)}<Text style={{ fontSize: 20 }}> 金币</Text></Text>
                <Text style={styles.userPopText}>马上就可以兑换啦</Text>
                <TouchableOpacity style={styles.userPopBtn} onPress={() => {
                    state.get() && getApiTask(callback);
                    U.set(state, false);
                }}>
                    <Text style={{ color: '#E14000', fontSize: 22, fontWeight: '500' }}>继续领钱</Text>
                </TouchableOpacity>
            </>
        ); break;
        case 2:view = (
            <>
                <Text style={styles.userPopTitle}>你太棒了！</Text>
                <Text style={[styles.userPopText, { top: '40%' }]}>再做 <Text style={{ color: '#FF3B00', fontSize: 18 }}>{number}单</Text> 就能获得全部奖励啦</Text>
                <Text style={[styles.userPopText, { top: '50%' }]}>再接再厉哦~</Text>
                <TouchableOpacity style={styles.userPopBtn} onPress={() => {
                    state.get() && getApiTask(callback);
                    U.set(state, false);
                }}>
                    <Text style={{ color: '#E14000', fontSize: 22, fontWeight: '500' }}>继续领钱</Text>
                </TouchableOpacity>
            </>
        ); break;
        default:view = (
            <>
                <Text style={styles.userPopTitle}>哇！太厉害了！</Text>
                <Text style={[styles.userPopText, { top: '40%' }]}>你已经获得全部奖励了</Text>
                <Text style={[styles.userPopText, { top: '50%' }]}>快去兑换试试吧~</Text>
                <TouchableOpacity style={styles.userPopBtn} onPress={() => {
                    U.set(state, false);
                    DeviceEventEmitter.emit('hidePop');
                    N.navigate('WithdrawPage');
                    getApiTask(callback, false);
                }}>
                    <Text style={{ color: '#E14000', fontSize: 22, fontWeight: '500' }}>去兑换</Text>
                </TouchableOpacity>
            </>
        );
        }
        DeviceEventEmitter.emit('showPop', {
            dom: <UserPop view={view}/>,
            close: () => {
                state.get() && getApiTask(callback);
                U.set(state, false);
            }
        });
    }

    function checkWindow (money, callback) {
        const total = total_task_num.get();
        if (total === 0) {
            showPop(1, money, callback);
        } else if (total === 5) {
            showPop(2, 10 - total, callback);
        } else if (total === 10) {
            showPop(3, 0, callback);
        } else {
            getApiTask(callback);
        }
        updateUser();
    }

    function submit (callback) {
        const localContent = submits.filter(item => item.uri);
        if (localContent.length !== submits.length) {
            callback();
            toast('请填写完整的名称和执行图!');
            return;
        }
        taskSubmit(receive_task_id, localContent.map(item => Object.assign(item, { data: '', mime: '', content: '', label: '', progress: '', type: '' }))).then(r => {
            if (!r.error) {
                try {
                    const { add_balance } = r.data;
                    setSubmits(submits.map(item => Object.assign({ progress: undefined, uri: '', data: '', mime: '' }, item)));
                    U.set(U.view(['user', 'today_pass_num'], store), Number.parseInt(today_pass_num.get()) + 1);
                    checkWindow(add_balance || 0, callback);
                } catch (e) {
                    toast('已经没有了');
                    N.goBack();
                }
            } else {
                sRef && sRef.scrollTo({ x: 0, y: 0, animated: true });
                callback();
            }
        });
    }

    return (
        <View style={styles.submitBtn}>
            <Button name={MENU_STATUS[status].text} onPress={callback => {
                submit(callback);
            }} disable={MENU_STATUS[status].disabled}/>
        </View>
    );
}

const styles = StyleSheet.create({
    DetailBV: {
        alignItems: 'center',
        flexDirection: 'row',
        height: '40%',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%'
    },
    changeNumber: {
        borderRadius: 14,
        borderWidth: 1,
        height: 28,
        width: 72
    },
    endTimeView: {
        height: width * (291 / 1125),
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        width
    },
    endTimeViewItem: {
        alignItems: 'center',
        flexDirection: 'row',
        height: '40%',
        justifyContent: 'space-between'
    },
    giveUpBtn: {
        borderColor: '#fff',
        borderRadius: 15,
        borderWidth: 1,
        height: 30,
        marginTop: 5,
        width: 80
    },
    input: {
        backgroundColor: '#FFF1E7',
        borderRadius: 8,
        height: 44,
        marginBottom: 10,
        marginTop: 10,
        minWidth: 222,
        paddingLeft: 15,
        paddingRight: 15
    },
    progress: {
        color: '#FF6C00',
        fontSize: 12,
        textAlign: 'center',
        transform: [{ translateY: 25 }]
    },
    saveBtn: {
        alignItems: 'center',
        borderColor: '#E1E1E1',
        borderRadius: 6,
        borderWidth: 1,
        height: 199,
        justifyContent: 'flex-end',
        width: 156
    },
    saveBtnText: {
        backgroundColor: '#FF6C00',
        borderRadius: 3,
        color: '#fff',
        fontSize: 14,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5
    },
    submitBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        marginTop: 15,
        width: '100%'
    },
    submitBtnText: {
        fontSize: 17,
        fontWeight: '500',
        lineHeight: 44,
        textAlign: 'center'
    },
    taskClaim: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginTop: 15,
        width: '100%'
    },
    taskClaimTop: {
        alignItems: 'center',
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: 40,
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%'
    },
    taskCourse: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginTop: 15,
        width: '100%'
    },
    taskCourseText: {
        color: '#222',
        fontSize: 13,
        lineHeight: 30
    },
    taskDetail: {
        backgroundColor: '#fff',
        borderRadius: 8,
        height: 150,
        marginTop: 15,
        width: '100%'
    },
    taskDetailBottom: {
        alignItems: 'center',
        height: '60%',
        justifyContent: 'center',
        width: '100%'
    },
    taskDetailTop: {
        alignItems: 'center',
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: '40%',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%'
    },
    taskUpload: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginTop: 15,
        width: '100%'
    },
    uploadImage: {
        borderColor: '#E1E1E1',
        borderRadius: 6,
        borderWidth: 1,
        height: 199,
        marginTop: 10,
        width: 156
    },
    userPopBtn: {
        alignItems: 'center',
        backgroundColor: '#FFE062',
        borderRadius: 30,
        bottom: '12%',
        height: 50,
        justifyContent: 'center',
        left: '15%',
        position: 'absolute',
        width: '70%'
    },
    userPopText: {
        color: '#80120F',
        fontSize: 16,
        marginTop: '5%',
        position: 'absolute',
        textAlign: 'center',
        top: '50%',
        width: '100%'
    },
    userPopTips: {
        color: '#FF3B00',
        fontSize: 30,
        fontWeight: '500',
        position: 'absolute',
        textAlign: 'center',
        top: '40%',
        width: '100%'
    },
    userPopTitle: {
        color: '#80120F',
        fontSize: 21,
        fontWeight: '500',
        position: 'absolute',
        textAlign: 'center',
        top: '30%',
        width: '100%'
    }
});

export default TaskDetailPage;
