import React, { useState } from 'react';
import { SafeAreaView, Image, Text, View, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
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
import CountDown from '../../components/CountDown';
import { giveUp, taskSubmit } from '../../utils/api';
import toast from '../../utils/toast';
import { transformMoney } from '../../utils/util';

export default function TaskDetailPage (props) {
    console.log(props.route.params.detail);
    const { status, finish_deadline, receive_task_id, course, task_category_label, nickname, description, success_rate } = props.route.params.detail;
    const [images, setImages] = useState([]);
    const [name, setName] = useState('');
    // const [sourceImages, setSourceImages] = useState([]);

    return (
        <SafeAreaView style={[css.safeAreaView, styles.safeAreaView]}>
            <ScrollView>
                <EndTimeView status={status} finish_deadline={finish_deadline} receive_task_id={receive_task_id}/>
                <DetailView task_category_label={task_category_label} success_rate={success_rate} nickname={nickname} status={status}/>
                <ClaimView description={description}/>
                <CourseView course={course} setName={setName} setImages={setImages} images={images}/>
                <Btn status={status} receive_task_id={receive_task_id} images={images} nickname={nickname}/>
            </ScrollView>
            <TouchableOpacity onPress={() => {}} style={{ position: 'absolute', bottom: '29%', right: 10 }}>
                <Image source={task2} style={{ height: 70, width: 84 }}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}} style={{ position: 'absolute', bottom: '15%', right: 10 }}>
                <Image source={task3} style={{ height: 70, width: 84 }}/>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

function EndTimeView ({ status, finish_deadline, receive_task_id }) {
    function apiGiveUp () {
        giveUp(receive_task_id)
            .then(r => {
                if (r.error) {
                    toast(r.msg || '操作失败');
                } else {
                    toast('操作成功');
                    N.goBack();
                }
            });
    }

    if (status === 1) {
        return (
            <View style={styles.endTimeView}>
                <View style={styles.endTimeViewItem}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#222', fontSize: 16, fontWeight: '500' }}>剩余时间：</Text>
                        <CountDown time={new Date(finish_deadline)} style={{ color: '#FF6C00', fontSize: 16, fontWeight: '500' }}/>
                    </View>
                    <TouchableOpacity onPress={() => {
                        apiGiveUp();
                    }} style={styles.giveUpBtn}>
                        <Text style={{ color: '#868686', fontSize: 12, lineHeight: 28, textAlign: 'center' }}>放弃任务</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.endTimeViewItem}>
                    <Text style={{ color: '#555', fontSize: 12 }}>审核时间：24小时内审核</Text>
                    <Text style={{ color: '#999', fontSize: 12 }}>超时未提交自动放弃任务</Text>
                </View>
            </View>
        );
    }
    return <></>;
}

function DetailView ({ task_category_label, nickname, success_rate, status }) {
    return (
        <View style={styles.taskDetail}>
            <View style={styles.taskDetailTop}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={task4} style={{ height: 14, width: 14, marginRight: 5 }}/>
                    <Text style={{ color: '#222', fontSize: 16, fontWeight: '500' }}>{task_category_label}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={task7} style={{ height: 20, width: 19, marginRight: 5 }}/>
                    {/* <Text style={{ color: '#FF6C00', fontSize: 24 }}>{transformMoney(unit_money)}<Text style={{ fontSize: 14 }}>金币</Text></Text> */}
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
                    }} style={styles.changeNumber}>
                        <Text style={{ color: '#FF6C00', fontSize: 12, lineHeight: 28, textAlign: 'center' }}>切换账号</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

function ClaimView ({ description }) {
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

function RenderView ({ name, setImages, images, type, label, content, setName }) {
    if (name === 'task') {
        if (type === 'text') {
            return <Text style={styles.taskCourseText}>{label}<Text style={{ color: '#FF6C00' }}>{content}</Text></Text>;
        }
        return (
            <>
                <Text style={styles.taskCourseText}>{label}</Text>
                <Image source={{ uri: content }} style={{ height: 199, width: 156, marginTop: 10 }}/>
            </>
        );
    } else {
        if (type === 'text') {
            return (
                <View style={{ marginTop: 20 }}>
                    <Text style={{ color: '#222', fontSize: 14 }}>{label}</Text>
                    <TextInput
                        style={styles.input}
                        maxLength={20}
                        placeholder={'请输入抖音名称'}
                        placeholderTextColor={'#FF7008'}
                        onChangeText={name => setName(name)}/>
                </View>
            );
        }
        return (
            <>
                <Text style={styles.taskCourseText}>{label}</Text>
                <RenderImage images={images} setImages={setImages} sourceImage={content}/>
                <Text style={{ color: '#222', fontSize: 14, lineHeight: 30 }}>（请按照示例上传截图）</Text>
            </>
        );
    }
}

function CourseView ({ course, setName, images, setImages }) {
    const { submit, task } = course;
    const submitView = [];
    const taskView = [];
    submit.forEach(item => {
        const { type, label, content } = item;
        submitView.push(<RenderView setName={setName} images={images} setImages={setImages} name="submit" key={label} type={type} label={label} content={content}/>);
    });
    task.forEach(item => {
        const { type, label, content } = item;
        taskView.push(<RenderView images={images} setImages={setImages} setName={setName} name="task" key={label} type={type} label={label} content={content}/>);
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
                        N.navigate('HelpCenterPage');
                    }}>
                        <Text style={{ color: '#FF6C00', fontSize: 12 }}>帮助中心</Text>
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
                        N.navigate('HelpCenterPage');
                    }}>
                        <Text style={{ color: '#FF6C00', fontSize: 12 }}>帮助中心</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ padding: 10, }}>
                    {submitView}
                </View>
            </View>
        </>
    );
}

function Btn ({ status, receive_task_id, images, nickname }) {
    function submit () {
        taskSubmit(receive_task_id, images, nickname).then(r => {
            if (r.error) {
                toast(r.msg || '操作失败');
            } else {
                toast('操作成功');
                N.goBack();
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

function RenderImage ({ images, setImages, sourceImage }) {
    const view = <Image source={task8} style={ styles.uploadImage}/>;
    return (
        <View style={css.flexRCSB}>
            <Image source={{ uri: sourceImage }} style={ styles.uploadImage}/>
            <Upload children={view} images={images} setImages={setImages}/>
        </View>
    );
}

const styles = StyleSheet.create({
    changeNumber: {
        borderColor: '#FF6C00',
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
        backgroundColor: '#D2D0D0',
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
    submitBtn: {
        borderRadius: 22,
        height: 44,
        marginBottom: 20,
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
        height: 199,
        marginTop: 10,
        width: 156
    }
});
