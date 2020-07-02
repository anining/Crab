import React, { useState } from 'react';
import { SafeAreaView, Image, Linking, Text, Dimensions, View, TouchableOpacity, ImageBackground, StyleSheet, ScrollView, TextInput, DeviceEventEmitter } from 'react-native';
import { css } from '../../assets/style/css';
import task4 from '../../assets/icon/task/task4.png';
import task5 from '../../assets/icon/task/task5.png';
import task6 from '../../assets/icon/task/task6.png';
import task7 from '../../assets/icon/task/task7.png';
import task8 from '../../assets/icon/task/task8.png';
import task9 from '../../assets/icon/task/task9.png';
import task12 from '../../assets/icon/task/task12.png';
import task13 from '../../assets/icon/task/task13.png';
import task14 from '../../assets/icon/task/task14.png';
import task15 from '../../assets/icon/task/task15.png';
import task16 from '../../assets/icon/task/task16.png';
import Upload from '../../components/Upload';
import { N } from '../../utils/router';
import { activityDetail, getTask, giveUp, taskReceiveDetail, taskSubmit } from '../../utils/api';
import { getUrl, requestPermission, transformMoney } from '../../utils/util';
import { captureRef } from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import Choice from '../../components/Choice';
import pop3 from '../../assets/icon/pop/pop3.png';
import Header from '../../components/Header';
import { getter, store } from '../../utils/store';
import * as U from 'karet.util';
import { useFocusEffect } from '@react-navigation/native';
import { Down } from '../../components/Down';
import toast from '../../utils/toast';
import asyncStorage from '../../utils/asyncStorage';
import { task } from '../../utils/update';
import Button from '../../components/Button';

const { user_id, today_pass_num, activityObj } = getter(['user.user_id', 'activityObj', 'user.today_pass_num']);
const { width } = Dimensions.get('window');
const MENU_STATUS = {
    1: {
        text: '提交任务',
        color: '#fff'
    },
    4: {
        text: '审核中',
        disabled: false
    },
    5: {
        text: '已通过',
        disabled: false
    },
    6: {
        text: '未通过',
        disabled: false
    }
};

function TaskDetailPage (props) {
    const [name, setName] = useState(props.route.params.detail.nickname || '');
    const [sRef, setSRef] = useState();
    const [detail, setDetail] = useState(props.route.params.detail);
    const [account, setAccount] = useState(props.route.params.account);
    const [progress, setProgress] = useState('等待上传');
    const [images, setImages] = useState(detail.images || []);
    const [num, setNum] = useState(0);
    const [change, setChange] = useState(1);

    useFocusEffect(() => {
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
                            giveUp(detail.receive_task_id);
                            N.goBack();
                        },
                        rt: '继续任务'
                    }} />);
            } else {
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
                    <TitleView detail={detail} account={account}/>
                    <DetailView detail={detail} account={account} change={change}/>
                    <ClaimView detail={detail}/>
                    <CourseView name={name} detail={detail} progress={progress} setProgress={setProgress} setName={setName} setImages={setImages} images={images} />
                    <Btn sRef={sRef} setProgress={setProgress} setName={setName} setImages={setImages} detail={detail} name={name} account={account} images={images} setChange={setChange} setDetail={setDetail} setAccount={setAccount}/>
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
                    <Down time={finish_deadline} style={{ color: '#FF6C00', fontSize: 16, fontWeight: '500' }}/>
                </View>
                <TouchableOpacity activeOpacity={1} onPress={apiGiveUp} style={styles.giveUpBtn}>
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

function TitleView ({ detail, account }) {
    const { task_category_label, unit_money } = detail;
    if (!account) {
        return <></>;
    }
    return (
        <View style={[styles.taskDetail, styles.titleView]}>
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

function DetailView ({ detail, account, change }) {
    const { task_category_label, unit_money, nickname, success_rate, status } = detail;
    const view = change === 2 ? <Text style={styles.taskDetailB}>没有检测到账号信息变化！请确认账号的健康状态！</Text> : <></>;
    if (account) {
        const { focus, follower, liked, userTab, likeTab } = account;
        return (
            <View style={styles.taskDetail}>
                <View style={styles.taskDetailT}>
                    <Text style={{ color: '#222', fontSize: 14 }}>做单账号：<Text style={{ color: '#262626', fontSize: 14, fontWeight: '500' }}>{nickname}</Text></Text>
                    <Text style={{ color: '#999', fontSize: 12 }}>账号任务通过率：<Text style={{ color: '#FF6C00', fontSize: 14, fontWeight: '500' }}>{Number.parseInt(success_rate * 100) || 0}%</Text></Text>
                </View>
                <View style={styles.taskDetailBottom}>
                    <View style={[styles.taskDetailBottomView, { height: change === 2 ? 137.5 : 187.5 }]}>
                        <View style={{ height: '65%', flexDirection: 'row', flexWrap: 'wrap' }}>
                            <View style={styles.accountItem}>
                                <Image source={task13} style={styles.accountView}/>
                                <Text style={{ color: '#555' }}>关注：<Text style={{ color: '#333' }}>{focus}</Text></Text>
                            </View>
                            <View style={styles.accountItem}>
                                <Image source={task14} style={styles.accountView}/>
                                <Text style={{ color: '#555' }}>喜欢：<Text style={{ color: '#333' }}>{liked}</Text></Text>
                            </View>
                            <View style={styles.accountItem}>
                                <Image source={task15} style={styles.accountView}/>
                                <Text style={{ color: '#555' }}>粉丝：<Text style={{ color: '#333' }}>{follower}</Text></Text>
                            </View>
                            <View style={styles.accountItem}>
                                <Image source={task16} style={styles.accountView}/>
                                <Text style={{ color: '#555' }}>作品：<Text style={{ color: '#333' }}>{userTab}</Text></Text>
                            </View>
                        </View>
                        <View style={styles.taskDetailVB}>
                            <Text style={{ fontSize: 12, color: '#999' }}>通过率低于20%时，建议切换账号做单。</Text>
                            <TouchableOpacity activeOpacity={1} onPress={() => {
                                N.navigate('AccountHomePage');
                            }} style={styles.taskDetailVBBtn}>
                                <Text style={{ color: '#fff' }}>切换账号</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {view}
                </View>
            </View>
        );
    }
    return (
        <View style={[styles.taskDetail, { height: 150 }]}>
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
            <View style={[styles.taskDetailBottom, { height: '60%', justifyContent: 'center' }]}>
                <View style={styles.DetailBV}>
                    <Text style={{ color: '#222' }}>做单账号：<Text style={{ color: '#262626', fontSize: 14, fontWeight: '500' }}>{nickname}</Text></Text>
                    <Text style={{ color: '#999', fontSize: 12 }}>账号任务通过率：<Text style={{ color: '#FF6C00', fontSize: 14, fontWeight: '500' }}>{Number.parseInt(success_rate * 100) || 0}%</Text></Text>
                </View>
                <View style={styles.DetailBV}>
                    <Text style={{ color: '#999', fontSize: 12 }}>通过率低于20%时，建议切换账号做单。</Text>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        status === 1 && N.navigate('AccountHomePage');
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

function CourseView ({ detail, name, setName, images, setProgress, progress, setImages }) {
    const { course, status } = detail;
    const { submit = [], task = [] } = course;
    const submitView = [];
    const taskView = [];
    submit.forEach((item, index) => {
        submitView.push(<RenderView inputName={name} length={submit.length} progress={progress} setProgress={setProgress} index={index} status={status} setName={setName} images={images} setImages={setImages} name="submit" key={item.label} item={item}/>);
    });
    task.forEach((item, index) => {
        taskView.push(<RenderView inputName={name} length={task.length} progress={progress} setProgress={setProgress} index={index} status={status} images={images} setImages={setImages} setName={setName} name="task" key={item.label} item={item}/>);
    });
    return (
        <>
            <View style={styles.taskCourse}>
                <View style={[styles.taskDetailTop, { height: 52 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={task6} style={{ height: 14, width: 14, marginRight: 5 }}/>
                        <Text style={{ color: '#222', fontSize: 16, fontWeight: '500' }}>做单教程</Text>
                    </View>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
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
                    <TouchableOpacity activeOpacity={1} onPress={() => {
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

function RenderView ({ name, inputName, length, index, setImages, setProgress, progress, status, images, item, setName }) {
    const { type, label, content } = item;
    const [view, setView] = useState();

    function save () {
        requestPermission(() => {
            if (view) {
                captureRef(view, {
                    format: 'jpg',
                    quality: 1.0,
                }).then(
                    uri => {
                        CameraRoll.saveToCameraRoll(uri)
                            .then(() => toast('保存成功,请到相册查看'))
                            .catch(() => toast('保存失败'));
                    },
                    () => () => toast('保存失败'),
                );
            }
        }).then(r => console.log(r));
    }

    if (name === 'task') {
        if (type === 'text') {
            return <TransformUrlView status={status} content={content} label={label}/>;
        }
        return (
            <>
                <Text style={styles.taskCourseText}>{label}</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    if (status === 1) {
                        DeviceEventEmitter.emit('showPop', {
                            dom: <Image source={{ uri: content }} style={[styles.saveBtn, { width: 312, height: 398, backgroundColor: '#fff' }]}/>,
                            close: () => {}
                        });
                    }
                }} style={{ marginTop: 10 }}>
                    <ImageBackground source={{ uri: content }} style={styles.saveBtn} ref={ref => setView(ref)}>
                        <TouchableOpacity activeOpacity={1} onPress={() => {
                            status === 1 && save();
                        }} style={{ marginBottom: '10%' }}>
                            <Text style={styles.saveBtnText}>保存图片</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </TouchableOpacity>
            </>
        );
    } else {
        if (type === 'text') {
            return (
                <View style={{ marginTop: 20 }}>
                    <Text style={{ color: '#222', fontSize: 14 }}>{label}</Text>
                    <TextInput
                        editable={status === 1}
                        style={styles.input}
                        maxLength={20}
                        value={inputName}
                        placeholder={content}
                        placeholderTextColor={'#FF7008'}
                        onChangeText={name => setName(name)}/>
                </View>
            );
        }
        return (
            <>
                <Text style={styles.taskCourseText}>{label}</Text>
                <RenderImage length={length} images={images} setProgress={setProgress} progress={progress} index={index} setImages={setImages} status={status} sourceImage={content}/>
                <Text style={{ color: '#222', fontSize: 14, lineHeight: 30 }}>（请按照示例上传截图）</Text>
            </>
        );
    }
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

function RenderImage ({ images, length, progress, setProgress, index, setImages, status, sourceImage }) {
    const view = <Image source={status === 1 ? images[index] ? { uri: `data:${images[index].mime};base64,${images[index].data}` } : task8 : { uri: images[index] }} style={ styles.uploadImage}/>;
    return (
        <View style={[css.flexRCSB, { alignItems: 'flex-start' }]}>
            <TouchableOpacity activeOpacity={1} onPress={() => {
                if (status === 1) {
                    DeviceEventEmitter.emit('showPop', {
                        dom: <Image source={{ uri: sourceImage }} style={[styles.saveBtn, { width: 312, height: 398, backgroundColor: '#fff' }]}/>,
                        close: () => {}
                    });
                }
            }} style={{ marginTop: 10 }}>
                <Image source={{ uri: sourceImage }} style={[styles.uploadImage, { marginTop: 0 }]}/>
            </TouchableOpacity>
            <View>
                <Upload children={view} setProgress={setProgress} editable={status === 1} images={images} setImages={setImages} length={length}/>
                <Text style={styles.progress}>{progress}{isNaN(progress) ? '' : '%'}</Text>
            </View>
        </View>
    );
}

function Btn ({ images, sRef, setName, account, detail, setProgress, setImages, name, setChange, setDetail, setAccount }) {
    const { status, nickname, home_url, receive_task_id, platform_category } = detail;

    function submit (callback) {
        const localImages = images.map(image => image.uri);
        if (!localImages.length || !(name || nickname)) {
            callback();
            toast('请填写完整的名称和执行图!');
            return;
        }
        taskSubmit(receive_task_id, localImages, name || nickname).then(r => {
            if (!r.error) {
                setName('');
                setProgress('等待上传');
                setImages([]);
                sRef && sRef.scrollTo({ x: 0, y: 0, animated: true });
                U.set(U.view(['user', 'today_pass_num'], store), Number.parseInt(today_pass_num.get()) + 1);
                // 缓存用于新手福利判断
                asyncStorage.setItem(`NEW_USER_TASK_TYPE3${user_id.get()}`, 'true');
                getTask(platform_category).then(r => {
                    callback();
                    if (!r.error) {
                        toast('提交任务成功!自动继续下一个任务!');
                        taskReceiveDetail(r.data.receive_task_id).then(response => {
                            if (response.error) {
                                N.goBack();
                            } else {
                                setDetail(response.data);
                                setAccount(undefined);
                            }
                        });
                    }
                });
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
    accountItem: {
        alignItems: 'center',
        flexDirection: 'row',
        height: '50%',
        justifyContent: 'center',
        width: '50%'
    },
    accountView: {
        height: 20,
        marginRight: 5,
        width: 20
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
        height: 250,
        marginTop: 15,
        width: '100%'
    },
    taskDetailB: {
        borderTopColor: '#F2F2F2',
        borderTopWidth: 1,
        color: '#FF3154',
        fontWeight: '500',
        lineHeight: 50,
        textAlign: 'center',
        width: '100%'
    },
    taskDetailBottom: {
        alignItems: 'center',
        height: '75%',
        justifyContent: 'space-between',
        width: '100%'
    },
    taskDetailBottomView: {
        height: 137.5,
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%'
    },
    taskDetailT: {
        alignItems: 'center',
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: '25%',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
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
    taskDetailVB: {
        alignItems: 'center',
        flexDirection: 'row',
        height: '35%',
        justifyContent: 'space-between'
    },
    taskDetailVBBtn: {
        alignItems: 'center',
        backgroundColor: '#ff6c00',
        borderRadius: 14,
        height: 28,
        justifyContent: 'center',
        width: 72
    },
    taskUpload: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginTop: 15,
        width: '100%'
    },
    titleView: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 60,
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%'
    },
    uploadImage: {
        borderColor: '#E1E1E1',
        borderRadius: 6,
        borderWidth: 1,
        height: 199,
        marginTop: 10,
        width: 156
    }
});

export default TaskDetailPage;
