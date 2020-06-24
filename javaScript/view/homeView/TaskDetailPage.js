import React, { useState } from 'react';
import {
    SafeAreaView,
    Image,
    Linking,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    StyleSheet,
    ScrollView,
    TextInput,
    BackHandler,
    DeviceEventEmitter,
} from 'react-native';
import { css } from '../../assets/style/css';
import task2 from '../../assets/icon/task/task2.png';
import task3 from '../../assets/icon/task/task3.png';
import task4 from '../../assets/icon/task/task4.png';
import task5 from '../../assets/icon/task/task5.png';
import task6 from '../../assets/icon/task/task6.png';
import task7 from '../../assets/icon/task/task7.png';
import task8 from '../../assets/icon/task/task8.png';
import task9 from '../../assets/icon/task/task9.png';
import Upload from '../../components/Upload';
import { N } from '../../utils/router';
import { giveUp, taskSubmit } from '../../utils/api';
import toast from '../../utils/toast';
import { getUrl, requestPermission, transformMoney } from '../../utils/util';
import { captureRef } from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import Choice from '../../components/Choice';
import pop3 from '../../assets/icon/pop/pop3.png';
import pop11 from '../../assets/icon/pop/pop11.png';
import pop9 from '../../assets/icon/pop/pop9.png';
import pop12 from '../../assets/icon/pop/pop12.png';
import Header from '../../components/Header';
import { getter, store } from '../../utils/store';
import * as U from 'karet.util';
import { useFocusEffect } from '@react-navigation/native';
import { Down } from '../../components/Down';

export default function TaskDetailPage (props) {
    const { detail } = props.route.params;
    const { images: submitImages } = detail;
    const [images, setImages] = useState([]);
    const [name, setName] = useState('');
    submitImages && setImages(submitImages);

    useFocusEffect(() => {
        const onBackPress = () => {
            const { status } = detail;
            if (status === 1) {
                backClick();
                return true;
            }
        };
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    });

    function backClick () {
        const { status } = detail;
        if (status === 1) {
            const { activityObj } = getter(['activityObj']);
            const { today_pass_num } = getter(['user.today_pass_num']);
            console.log(activityObj.get());
            const number = today_pass_num.get() - 1 < 1 ? 1 : today_pass_num.get() - 1;
            DeviceEventEmitter.emit('showPop', <Choice info={{
                icon: pop3,
                tips: `再做 ${number} 个任务就可以拆红包了！`,
                minTips: '您确定要返回首页(自动放弃任务)吗？',
                lt: '返回首页',
                lc: () => {
                    N.goBack();
                },
                rt: '继续任务'
            }} />);
        }
    }

    return (
        <SafeAreaView style={[css.safeAreaView]}>
            <Header label={'任务信息'} backOnPress={() => {
                backClick();
            }}/>
            <View style={ styles.safeAreaView}>
                <ScrollView>
                    <EndTimeView detail={detail}/>
                    <DetailView detail={detail}/>
                    <ClaimView detail={detail}/>
                    <CourseView detail={detail} setName={setName} setImages={setImages} images={images}/>
                    <Btn detail={detail} name={name} images={images}/>
                </ScrollView>
                <TouchableOpacity onPress={() => {}} style={{ position: 'absolute', bottom: '29%', right: 10 }}>
                    <Image source={task2} style={{ height: 70, width: 84 }}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {}} style={{ position: 'absolute', bottom: '15%', right: 10 }}>
                    <Image source={task3} style={{ height: 70, width: 84 }}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

function EndTimeView ({ detail }) {
    const { status, finish_deadline, audit_type, receive_task_id } = detail;
    const AUDIT_TYPE = ['', '接口审核', '通用审核', '不审核'];
    function apiGiveUp () {
        DeviceEventEmitter.emit('showPop', <Choice info={{
            icon: pop3,
            tips: '赏金近在咫尺啦~',
            minTips: '确定要放弃任务吗？',
            lt: '放弃任务',
            lc: () => {
                giveUp(receive_task_id).then(r => {
                    if (r.error) {
                        toast(r.msg || '操作失败');
                    } else {
                        toast('操作成功');
                        N.goBack();
                    }
                });
            },
            rt: '继续任务'
        }} />);
    }

    if (status === 1) {
        return (
            <View style={styles.endTimeView}>
                <View style={styles.endTimeViewItem}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#222', fontSize: 16, fontWeight: '500' }}>剩余时间：</Text>
                        <Down time={finish_deadline} style={{ color: '#FF6C00', fontSize: 16, fontWeight: '500' }}/>
                    </View>
                    <TouchableOpacity onPress={() => {
                        apiGiveUp();
                    }} style={styles.giveUpBtn}>
                        <Text style={{ color: '#868686', fontSize: 12, lineHeight: 28, textAlign: 'center' }}>放弃任务</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.endTimeViewItem}>
                    <Text style={{ color: '#555', fontSize: 12 }}>审核时间：{AUDIT_TYPE[audit_type]}</Text>
                    <Text style={{ color: '#999', fontSize: 12 }}>超时未提交自动放弃任务</Text>
                </View>
            </View>
        );
    }
    return <></>;
}

function DetailView ({ detail }) {
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
                    <Text style={{ color: '#FF6C00', fontSize: 24 }}>{transformMoney(unit_money)}<Text style={{ fontSize: 14 }}>金币</Text></Text>
                </View>
            </View>
            <View style={styles.taskDetailBottom}>
                <View style={styles.taskDetailBottomView}>
                    <Text style={{ color: '#222', fontSize: 14 }}>做单账号：<Text style={{ color: '#262626', fontSize: 14, fontWeight: '500' }}>{nickname}</Text></Text>
                    <Text style={{ color: '#999', fontSize: 12 }}>账号任务通过率：<Text style={{ color: '#FF6C00', fontSize: 14, fontWeight: '500' }}>{Number.parseInt(success_rate * 100) || 0}%</Text></Text>
                </View>
                <View style={styles.taskDetailBottomView}>
                    <Text style={{ color: '#999', fontSize: 12 }}>通过率低于20%时，建议切换账号做单。</Text>
                    <TouchableOpacity onPress={() => {
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
            <Text style={{ lineHeight: 50, paddingLeft: 10, color: '#FF4700', fontSize: 14 }}>· <Text style={{ color: '#666' }}>{description || '暂无要求'}</Text></Text>
        </View>
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
            }} style={{ color: 'red' }}>{url}</Text> {textArray[1]}</Text></Text>
        );
    } else {
        return <Text style={styles.taskCourseText}>{label}<Text style={{ color: '#FF6C00' }}>{content}</Text></Text>;
    }
}

function RenderView ({ name, setImages, status, images, item, setName }) {
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
    } else {
        if (type === 'text') {
            return (
                <View style={{ marginTop: 20 }}>
                    <Text style={{ color: '#222', fontSize: 14 }}>{label}</Text>
                    <TextInput
                        editable={status === 1}
                        style={styles.input}
                        maxLength={20}
                        placeholder={content}
                        placeholderTextColor={'#FF7008'}
                        onChangeText={name => setName(name)}/>
                </View>
            );
        }
        return (
            <>
                <Text style={styles.taskCourseText}>{label}</Text>
                <RenderImage images={images} setImages={setImages} status={status} sourceImage={content}/>
                <Text style={{ color: '#222', fontSize: 14, lineHeight: 30 }}>（请按照示例上传截图）</Text>
            </>
        );
    }
}

function CourseView ({ detail, setName, images, setImages }) {
    const { course, status } = detail;
    const { submit = [], task = [] } = course;
    const submitView = [];
    const taskView = [];
    submit.forEach(item => {
        const { label } = item;
        submitView.push(<RenderView status={status} setName={setName} images={images} setImages={setImages} name="submit" key={label} item={item}/>);
    });
    task.forEach(item => {
        const { label } = item;
        taskView.push(<RenderView status={status} images={images} setImages={setImages} setName={setName} name="task" key={label} item={item}/>);
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

function Btn ({ images, detail, name }) {
    const { status, nickname, receive_task_id, success_rate } = detail;
    const { success_rate_threshold } = getter(['app.success_rate_threshold']);

    function submit () {
        taskSubmit(receive_task_id, images, name || nickname).then(r => {
            if (r.error) {
                DeviceEventEmitter.emit('showPop', <Choice info={{
                    icon: pop12,
                    tips: 'r.msg' || '提交失败',
                    type: 'oneBtn',
                    rt: '我知道了'
                }} />);
            } else {
                const { today_pass_num } = getter(['user.today_pass_num']);
                U.set(U.view(['user', 'today_pass_num'], store), Number.parseInt(today_pass_num.get()) + 1);
                if (Number(success_rate_threshold) > Number(success_rate)) {
                    DeviceEventEmitter.emit('showPop', <Choice info={{
                        icon: pop9,
                        tips: '您的账号可能已经不健康',
                        minTips: '提交的任务可能会不通过！建议更换账号做单,您可以重新打开链接复查做单结果',
                        type: 'oneBtn',
                        rc: () => {
                            N.goBack();
                        },
                        rt: '我知道了'
                    }} />);
                } else {
                    DeviceEventEmitter.emit('showPop', <Choice info={{
                        icon: pop11,
                        tips: '提交任务成功，请耐心等待审核！',
                        type: 'oneBtn',
                        rc: () => {
                            N.goBack();
                        },
                        rt: '我知道了'
                    }} />);
                }
            }
        });
    }

    const MENU_STATUS = {
        1: {
            text: '提交任务',
            color: '#fff',
            backgroundColor: '#FF3E00',
            disabled: true
        },
        4: {
            text: '审核中',
            color: '#4F4F4F',
            backgroundColor: '#ABABAB',
            disabled: false
        },
        5: {
            text: '已通过',
            color: '#4F4F4F',
            backgroundColor: '#ABABAB',
            disabled: false
        },
        6: {
            text: '未通过',
            color: '#4F4F4F',
            backgroundColor: '#ABABAB',
            disabled: false
        }
    };
    return (
        <TouchableOpacity onPress={() => {
            if (MENU_STATUS[status].disabled) {
                submit();
            }
        }} style={[styles.submitBtn, { backgroundColor: MENU_STATUS[status].backgroundColor }]}>
            <Text style={[styles.submitBtnText, { color: MENU_STATUS[status].color }]}>{MENU_STATUS[status].text}</Text>
        </TouchableOpacity>
    );
}

function RenderImage ({ images, setImages, status, sourceImage }) {
    const view = <Image source={task8} style={ styles.uploadImage}/>;
    if (images.length && status !== 1) {
        const localImages = images;
        const uri = localImages.shift();
        setImages(localImages);
        return (
            <View style={css.flexRCSB}>
                <TouchableOpacity onPress={() => {
                    if (status === 1) {
                        DeviceEventEmitter.emit('showPop', {
                            dom: <Image source={{ uri: sourceImage }} style={[styles.saveBtn, { width: 312, height: 398, backgroundColor: '#fff' }]}/>,
                            close: () => {}
                        });
                    }
                }} style={{ marginTop: 10 }}>
                    <Image source={{ uri: sourceImage }} style={[styles.uploadImage, { marginTop: 0 }]}/>
                </TouchableOpacity>
                <Image source={{ uri }} style={ styles.uploadImage}/>
            </View>
        );
    }
    return (
        <View style={css.flexRCSB}>
            <TouchableOpacity onPress={() => {
                if (status === 1) {
                    DeviceEventEmitter.emit('showPop', {
                        dom: <Image source={{ uri: sourceImage }} style={[styles.saveBtn, { width: 312, height: 398, backgroundColor: '#fff' }]}/>,
                        close: () => {}
                    });
                }
            }} style={{ marginTop: 10 }}>
                <Image source={{ uri: sourceImage }} style={[styles.uploadImage, { marginTop: 0 }]}/>
            </TouchableOpacity>
            <Upload children={view} editable={status === 1} images={images} setImages={setImages}/>
        </View>
    );
}

const styles = StyleSheet.create({
    changeNumber: {
        borderRadius: 14,
        borderWidth: 1,
        height: 28,
        width: 72
    },
    endTimeView: {
        backgroundColor: '#fff',
        borderRadius: 8,
        height: 85,
        justifyContent: 'center',
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%'
    },
    endTimeViewItem: {
        alignItems: 'center',
        flexDirection: 'row',
        height: '40%',
        justifyContent: 'space-between'
    },
    giveUpBtn: {
        backgroundColor: '#eee',
        borderRadius: 14,
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
    safeAreaView: {
        backgroundColor: '#F8F8F8',
        paddingLeft: 10,
        paddingRight: 10
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
        borderRadius: 22,
        height: 44,
        marginBottom: 100,
        marginTop: 20
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
    taskDetailBottomView: {
        alignItems: 'center',
        flexDirection: 'row',
        height: '40%',
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
    }
});
