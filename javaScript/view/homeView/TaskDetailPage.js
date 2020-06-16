import React, { useState } from 'react';
import {
    SafeAreaView,
    Image,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    Dimensions,
} from 'react-native';
import { css } from '../../assets/style/css';
import task1 from '../../assets/icon/task/task1.png';
import task2 from '../../assets/icon/task/task2.png';
import task3 from '../../assets/icon/task/task3.png';
import task4 from '../../assets/icon/task/task4.png';
import task5 from '../../assets/icon/task/task5.png';
import task6 from '../../assets/icon/task/task6.png';
import task7 from '../../assets/icon/task/task7.png';
import task8 from '../../assets/icon/task/task8.png';

const { width } = Dimensions.get('window');
export default function TaskDetailPage () {
    const [name, setName] = useState('');
    return (
        <SafeAreaView style={[css.safeAreaView, styles.safeAreaView]}>
            <ScrollView>
                <View style={styles.endTimeView}>
                    <View style={styles.endTimeViewItem}>
                        <Text style={{ color: '#222', fontSize: 16, fontWeight: '500' }}>剩余时间：<Text style={{ color: '#FF6C00', fontSize: 16, fontWeight: '500' }}>00:00:00</Text></Text>
                        <TouchableOpacity onPress={() => {

                        }} style={styles.giveUpBtn}>
                            <Text style={{ color: '#868686', fontSize: 12, lineHeight: 28, textAlign: 'center' }}>放弃任务</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.endTimeViewItem}>
                        <Text style={{ color: '#555', fontSize: 12 }}>审核时间：24小时内审核</Text>
                        <Text style={{ color: '#999', fontSize: 12 }}>超时未提交自动放弃任务</Text>
                    </View>
                </View>
                <View style={styles.taskDetail}>
                    <View style={styles.taskDetailTop}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={task4} style={{ height: 14, width: 14, marginRight: 5 }}/>
                            <Text style={{ color: '#222', fontSize: 16, fontWeight: '500' }}>音符点赞</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={task7} style={{ height: 20, width: 19, marginRight: 5 }}/>
                            <Text style={{ color: '#FF6C00', fontSize: 24 }}>8000<Text style={{ fontSize: 14 }}>金币</Text></Text>
                        </View>
                    </View>
                    <View style={styles.taskDetailBottom}>
                        <View style={styles.taskDetailBottomView}>
                            <Text style={{ color: '#222', fontSize: 14 }}>做单账号：<Text style={{ color: '#262626', fontSize: 14, fontWeight: '500' }}>音符任务专号</Text></Text>
                            <Text style={{ color: '#999999', fontSize: 12 }}>账号任务通过率：<Text style={{ color: '#FF6C00', fontSize: 14, fontWeight: '500' }}>20%</Text></Text>
                        </View>
                        <View style={styles.taskDetailBottomView}>
                            <Text style={{ color: '#999', fontSize: 12 }}>通过率低于20%时，建议切换账号做单。</Text>
                            <TouchableOpacity onPress={() => {

                            }} style={styles.changeNumber}>
                                <Text style={{ color: '#FF6C00', fontSize: 12, lineHeight: 28, textAlign: 'center' }}>切换账号</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.taskClaim}>
                    <View style={styles.taskClaimTop}>
                        <Image source={task4} style={{ height: 14, width: 14, marginRight: 5 }}/>
                        <Text style={{ color: '#222222', fontSize: 16, fontWeight: '500' }}>做单要求</Text>
                    </View>
                    <Text style={{ lineHeight: 50, paddingLeft: 10, color: '#FF4700', fontSize: 14 }}>· <Text style={{ color: '#666' }}>请围绕商品的质量和评价。</Text></Text>
                </View>
                <View style={styles.taskCourse}>
                    <View style={[styles.taskDetailTop, { height: 52 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={task6} style={{ height: 14, width: 14, marginRight: 5 }}/>
                            <Text style={{ color: '#222', fontSize: 16, fontWeight: '500' }}>做单教程</Text>
                        </View>
                        <TouchableOpacity onPress={() => {

                        }}>
                            <Text style={{ color: '#FF6C00', fontSize: 12 }}>帮助中心</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ padding: 10, }}>
                        <Text style={{ color: '#222', fontSize: 13, lineHeight: 30 }}>第一步：通过链接<Text style={{ color: '#FF6C00' }}>https://www.baidu.com</Text>打开抖音</Text>
                        <Text style={{ color: '#222', fontSize: 13, lineHeight: 30 }}>第二步：如图评论视频</Text>
                        <Image source={task1} style={{ height: 199, width: 156, marginTop: 10 }}/>
                    </View>
                </View>
                <View style={styles.taskUpload}>
                    <View style={[styles.taskDetailTop, { height: 52 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={task5} style={{ height: 14, width: 14, marginRight: 5 }}/>
                            <Text style={{ color: '#222', fontSize: 16, fontWeight: '500' }}>提交审核</Text>
                        </View>
                        <TouchableOpacity onPress={() => {

                        }}>
                            <Text style={{ color: '#FF6C00', fontSize: 12 }}>帮助中心</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ padding: 10, }}>
                        <Text style={{ color: '#222', fontSize: 13, lineHeight: 30 }}>第3步：截图提交</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Image source={task1} style={{ height: 199, width: 156, marginTop: 10 }}/>
                            <Image source={task1} style={{ height: 199, width: 156, marginTop: 10 }}/>
                        </View>
                        <Text style={{ color: '#222', fontSize: 14, lineHeight: 30 }}>（请按照示例上传截图）</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                            <Text style={{ color: '#222', fontSize: 14 }}>你的抖音名称：</Text>
                            <TextInput
                                style={styles.input}
                                maxLength={20}
                                placeholder={'请输入抖音名称'}
                                placeholderTextColor={'#FF7008'}
                                onChangeText={name => setName(name)}/>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity onPress={() => {

            }} style={{ position: 'absolute', bottom: '29%', right: 10 }}>
                <Image source={task2} style={{ height: 70, width: 84 }}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {

            }} style={{ position: 'absolute', bottom: '15%', right: 10 }}>
                <Image source={task3} style={{ height: 70, width: 84 }}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {

            }} style={{ backgroundColor: '#FF3E00', height: 44, width: width - 20, position: 'absolute', bottom: '15%', right: 10 }}>
                <Text style={{ color: '#fff', fontSize: 17, lineHeight: 44, textAlign: 'center', fontWeight: '500' }}>提交任务</Text>
            </TouchableOpacity>
        </SafeAreaView>
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
        minWidth: 222,
        paddingLeft: 15,
        paddingRight: 15
    },
    safeAreaView: {
        backgroundColor: '#F8F8F8',
        paddingLeft: 10,
        paddingRight: 10
    },
    taskClaim: {
        backgroundColor: '#fff',
        borderRadius: 8,
        height: 100,
        marginTop: 15,
        width: '100%'
    },
    taskClaimTop: {
        alignItems: 'center',
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: '50%',
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
        minHeight: 350,
        paddingBottom: 50,
        width: '100%'
    }
});
