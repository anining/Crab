import React, { useState, useEffect } from 'react';
import { SafeAreaView, Image, Linking, Text, BackHandler, Dimensions, View, TouchableOpacity, ImageBackground, StyleSheet, ScrollView, TextInput, DeviceEventEmitter } from 'react-native';
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
import { djangoTime, getUrl, requestPermission, saveBase64ImageToCameraRoll, transformMoney } from '../../utils/util';
import { captureRef } from 'react-native-view-shot';
import Choice from '../../components/Choice';
import pop3 from '../../assets/icon/pop/pop3.png';
import Header from '../../components/Header';
import { getter, store } from '../../utils/store';
import * as U from 'karet.util';
import { useFocusEffect } from '@react-navigation/native';
import toast from '../../utils/toast';
import asyncStorage from '../../utils/asyncStorage';
import { updateUser } from '../../utils/update';
import Button from '../../components/Button';
import CountDown from '../../components/CountDown';

const { user_id, total_task_num, today_pass_num, activityObj } = getter(['user.user_id', 'user.total_task_num', 'activityObj', 'user.today_pass_num']);
const { width } = Dimensions.get('window');
const MENU_STATUS = {
    1: {
        text: '提交任务',
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
        const { course } = detail;
        const { submit = [] } = course;
        setSubmits(submit.map(item => Object.assign({ progress: undefined, uri: '', data: '', mime: '' }, item)));
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
                        tips: `再做 ${number} 个任务就可以拆红包了！`,
                        minTips: '您确定要返回首页(自动放弃任务)吗？',
                        lt: '返回首页',
                        lc: () => {
                            giveUp(detail.receive_task_id).then(() => {
                                taskReceive(1, 10, 1).then(() => updateUser());
                            });
                            updateUser();
                            N.goBack();
                        },
                        rt: '继续任务'
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
            <Header label={'任务信息'} backOnPress={backClick}/>
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
                minTips: '确定要放弃任务吗？',
                lt: '放弃任务',
                rt: '继续任务',
                lc: () => {
                    giveUp(receive_task_id).then(r => {
                        if (!r.error) {
                            toast('放弃任务成功!');
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
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>剩余时间：</Text>
                    <CountDown time={+new Date(djangoTime(finish_deadline))} style={{ color: '#FF6C00', fontSize: 16, fontWeight: '500' }}/>
                </View>
                <TouchableOpacity onPress={apiGiveUp} style={styles.giveUpBtn}>
                    <Text style={{ color: '#fff', fontSize: 12, lineHeight: 25, textAlign: 'center' }}>放弃任务</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.endTimeViewItem}>
                <Text style={{ color: '#fff', fontSize: 12 }}>审核时间：{AUDIT_TYPE[audit_type] || '普通审核'}</Text>
                <Text style={{ color: '#fff', fontSize: 12 }}>超时未提交自动放弃任务</Text>
            </View>
        </ImageBackground>
    );
}

function DetailView ({ refresh, detail }) {
    const { task_category_label, unit_money, nickname, success_rate, status } = detail;
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
                    <Text style={{ color: '#222' }}>做单账号：<Text style={{ color: '#262626', fontSize: 14, fontWeight: '500' }}>{nickname}</Text></Text>
                    <Text style={{ color: '#999', fontSize: 12 }}>账号任务通过率：<Text style={{ color: '#FF6C00', fontSize: 14, fontWeight: '500' }}>{Number.parseInt(success_rate * 100) || 0}%</Text></Text>
                </View>
                <View style={styles.DetailBV}>
                    <Text style={{ color: '#999', fontSize: 12 }}>通过率低于20%时，建议切换账号做单。</Text>
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
    return (
        <View style={styles.taskClaim}>
            <View style={styles.taskClaimTop}>
                <Image source={task9} style={{ height: 14, width: 14, marginRight: 5 }}/>
                <Text style={{ color: '#222', fontSize: 16, fontWeight: '500' }}>做单要求</Text>
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
    return (
        <>
            <View style={styles.taskCourse}>
                <View style={[styles.taskDetailTop, { height: 52 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={task6} style={{ height: 14, width: 14, marginRight: 5 }}/>
                        <Text style={{ color: '#222', fontSize: 16, fontWeight: '500' }}>做单教程</Text>
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
                            toast('保存失败!');
                        },
                    );
                }, () => {
                    toast('保存失败!');
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    if (type === 'text') {
        return <TransformUrlView status={status} content={content} label={label}/>;
    } else if (type === 'content') {
        return (
            <Text style={styles.taskCourseText}>{label}<Text onPress={() => {
                try {
                    status === 1 && Linking.openURL(content).then(r => { console.log(r); });
                } catch (e) {
                    console.log(e);
                    toast('打开失败');
                }
            }} style={{ color: '#FF6C00' }}> {content} </Text>
            </Text>
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
            }} style={{ marginTop: 10 }}>
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
            <Text style={styles.taskCourseText}>{label}<Text style={{ color: '#FF6C00' }}>{textArray[0]} <Text onPress={() => {
                try {
                    status === 1 && Linking.openURL(url).then(r => { console.log(r); });
                } catch (e) {
                    console.log(e);
                    toast('打开失败');
                }
            }} style={{ color: 'red' }}> {url} </Text> {textArray[1]}</Text></Text>
        );
    } else {
        return <Text style={styles.taskCourseText}>{label}<Text style={{ color: '#FF6C00' }}>{content}</Text></Text>;
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

    function getApiTask () {
        DeviceEventEmitter.emit('hidePop');
        getTask(platform_category).then(r => {
            if (!r.error) {
                toast('提交任务成功!自动继续下一个任务!');
                taskReceiveDetail(r.data.receive_task_id).then(response => {
                    if (response.error) {
                        N.goBack();
                    } else {
                        setDetail(response.data);
                    }
                });
            }
        });
    }

    function showPop (type, number) {
        const [isGet, setIsGet] = useState(true);
        let view;
        switch (type) {
        case 1:view = (
            <>
                <Text style={styles.userPopTitle}>恭喜您，额外获得</Text>
                <Text style={styles.userPopTips}>{number}<Text style={{ fontSize: 20 }}> 金币</Text></Text>
                <Text style={styles.userPopText}>马上就可以提现啦</Text>
                <TouchableOpacity style={styles.userPopBtn} onPress={() => {
                    isGet && getApiTask();
                    setIsGet(false);
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
                    isGet && getApiTask();
                    setIsGet(false);
                }}>
                    <Text style={{ color: '#E14000', fontSize: 22, fontWeight: '500' }}>继续领钱</Text>
                </TouchableOpacity>
            </>
        ); break;
        default:view = (
            <>
                <Text style={styles.userPopTitle}>哇！太厉害了！</Text>
                <Text style={[styles.userPopText, { top: '40%' }]}>你已经获得全部奖励了</Text>
                <Text style={[styles.userPopText, { top: '50%' }]}>快去提现试试吧~</Text>
                <TouchableOpacity style={styles.userPopBtn} onPress={() => {
                    setIsGet(false);
                    DeviceEventEmitter.emit('hidePop');
                    N.navigate('WithdrawPage');
                }}>
                    <Text style={{ color: '#E14000', fontSize: 22, fontWeight: '500' }}>去提现</Text>
                </TouchableOpacity>
            </>
        );
        }
        DeviceEventEmitter.emit('showPop', {
            dom: <UserPop view={view}/>,
            close: () => {
                isGet && getApiTask();
                setIsGet(false);
            }
        });
    }

    function checkWindow (money) {
        const total = total_task_num.get();
        if (total === 0) {
            showPop(1, money);
        } else if (total === 5) {
            showPop(2, 10 - total);
        } else if (total === 10) {
            showPop(3, 0);
        } else {
            getApiTask();
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
        taskSubmit(receive_task_id, localContent).then(r => {
            if (!r.error) {
                const { add_balance } = r.data;
                setSubmits(submits.map(item => Object.assign({ progress: undefined, uri: '', data: '', mime: '' }, item)));
                U.set(U.view(['user', 'today_pass_num'], store), Number.parseInt(today_pass_num.get()) + 1);
                // 缓存用于新手福利判断
                asyncStorage.setItem(`NEW_USER_TASK_TYPE3${user_id.get()}`, 'true');
                sRef && sRef.scrollTo({ x: 0, y: 0, animated: true });
                checkWindow(add_balance || 0);
                callback();
            } else {
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
        borderRadius: 14,
        borderWidth: 1,
        height: 28,
        width: 72
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
        width
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
        minHeight: 350,
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
