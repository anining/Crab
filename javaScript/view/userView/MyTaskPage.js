import React, { useState } from 'react';
import { SafeAreaView, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { css } from '../../assets/style/css';
import Clipboard from '@react-native-community/clipboard';
import ListHeader from '../../components/ListHeader';
import ListGeneral from '../../components/ListGeneral';
import toast from '../../utils/toast';
import task10 from '../../assets/icon/task/task10.png';
import { N } from '../../utils/router';
import { activity, taskReceive } from '../../utils/api';
import { transformMoney } from '../../utils/util';
import CountDown from '../../components/CountDown';

const itemMarginTop = 10;
const HEADER_DATA = [
    {
        tabLabel: '进行中',
        type: 1,
        itemHeight: 265
    },
    {
        tabLabel: '审核中',
        type: 4,
        itemHeight: 208
    },
    {
        tabLabel: '已通过',
        type: 5,
        itemHeight: 208
    },
    {
        tabLabel: '未通过',
        type: 6,
        itemHeight: 240
    }
];

export default function MyTaskPage (props) {
    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#F8F8F8' }]}>
            <RenderHeader id={props.route.params.id}/>
        </SafeAreaView>
    );
}

function RenderHeader ({ id }) {
    const components = [];
    HEADER_DATA.forEach(header => {
        components.push(
            <View tabLabel={header.tabLabel} key={header.type}>
                <L type={header.type} itemHeight={header.itemHeight}/>
            </View>
        );
    });
    return (
        <ListHeader value={id}>
            {components}
        </ListHeader>
    );
}

function L ({ type, itemHeight }) {
    return (
        <View style={{ height: '100%' }}>
            <ListGeneral
                itemHeight={itemHeight}
                itemMarginTop={itemMarginTop}
                getList={async (page, num, callback) => {
                    taskReceive(page, num, type).then(r => {
                        console.log(r);
                        if (!r.error) {
                            callback(r.data);
                        }
                    });
                }}
                renderItem={item => {
                    const { receive_task_id, category, finish_deadline, account, money } = item;
                    return (
                        <>
                            <View style={[styles.itemView, { height: itemHeight }]} key={receive_task_id}>
                                <View style={styles.itemViewTop}>
                                    <Text style={{ color: '#353535', fontSize: 15, fontWeight: '500' }}>任务类型：{category}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={task10} style={{ height: 20, width: 19, marginRight: 5 }}/>
                                        <Text style={{ color: '#FF6C00', fontSize: 24, fontWeight: '600' }}>{transformMoney(money)}<Text style={{ fontSize: 14 }}>金币</Text></Text>
                                    </View>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    height: 25,
                                    marginTop: 15
                                }}>
                                    <Text style={styles.itemViewTopName}>做单账号：{account}</Text>
                                    {/*        <Text style={{ fontSize: 12, color: '#999' }}>{item.a ? '当前账号任务通过率：' : ''}<Text style={{ color: '#FF6C00' }}>{item.a}</Text></Text> */}
                                </View>
                                <View style={styles.itemViewCenter}>
                                    <Text style={{ color: '#353535', fontSize: 14 }}>接任务ID：{receive_task_id}</Text>
                                    <TouchableOpacity onPress={() => {
                                        Clipboard.setString(receive_task_id);
                                        toast('复制成功');
                                    }} style={styles.copyBtn}>
                                        <Text style={{ fontSize: 12, color: '#FF6C00', lineHeight: 25, textAlign: 'center' }}>复制ID值</Text>
                                    </TouchableOpacity>
                                </View>
                                <RenderItem type={type} receive_task_id={receive_task_id} finish_deadline={finish_deadline}/>
                            </View>
                        </>
                    );
                }}
            />
        </View>
    );
}

function RenderItem ({ type, receive_task_id, finish_deadline }) {
    switch (type) {
    case 1:return (
        <>
            <View style={[css.flex, css.js, {
                borderBottomColor: '#EDEDED',
                borderBottomWidth: 1,
                borderTopColor: '#EDEDED',
                borderTopWidth: 1,
                marginTop: 15,
                paddingLeft: 10
            }]}>
                <Text style={styles.deadline}>剩余时间：</Text>
                <CountDown time={new Date('2020/06/23')} style={styles.deadline}/>
            </View>
            <TouchableOpacity activeOpacity={1} onPress={() => {
                N.navigate('TaskDetailPage', { receive_task_id });
            }} style={styles.giveUpBtn}>
                <Text style={{ fontSize: 17, color: '#FF6C00', lineHeight: 42, textAlign: 'center' }}>放弃任务</Text>
            </TouchableOpacity>
        </>
    );
    // case 4:return (
    //     <View style={{
    //         flexDirection: 'row',
    //         justifyContent: 'space-between',
    //         alignItems: 'center',
    //         paddingRight: 10,
    //         height: 50,
    //         borderTopColor: '#EDEDED',
    //         borderTopWidth: 1,
    //         marginTop: 15,
    //         paddingLeft: 10,
    //     }}>
    //         <Text style={{ color: '#353535', fontSize: 14 }}>提交时间：00:59:59</Text>
    //         <Text style={{ color: '#2D6DFF', fontSize: 14, fontWeight: '500' }}>审核中(24小时内审核)</Text>
    //     </View>
    // );
    // case 5:return (
    //     <View style={{
    //         flexDirection: 'row',
    //         justifyContent: 'space-between',
    //         alignItems: 'center',
    //         paddingRight: 10,
    //         height: 50,
    //         borderTopColor: '#EDEDED',
    //         borderTopWidth: 1,
    //         marginTop: 15,
    //         paddingLeft: 10,
    //     }}>
    //         <Text style={{ color: '#353535', fontSize: 14 }}>审核时间：00:59:59</Text>
    //         <Text style={{ color: '#53C23B', fontSize: 14, fontWeight: '500' }}>已通过</Text>
    //     </View>
    // );
    // default:return (
    //     <>
    //         <View style={{
    //             flexDirection: 'row',
    //             justifyContent: 'space-between',
    //             alignItems: 'center',
    //             paddingRight: 10,
    //             height: 40,
    //             borderTopColor: '#EDEDED',
    //             borderTopWidth: 1,
    //             marginTop: 15,
    //             paddingLeft: 10,
    //         }}>
    //             <Text style={{ color: '#353535', fontSize: 14 }}>审核时间：00:59:59</Text>
    //             <Text style={{ color: '#FF3154', fontSize: 14, fontWeight: '500' }}>未通过</Text>
    //         </View>
    //         <View style={{
    //             flexDirection: 'row',
    //             justifyContent: 'space-between',
    //             alignItems: 'center',
    //             paddingRight: 10,
    //             height: 40,
    //             paddingLeft: 10,
    //         }}>
    //             <Text style={{ color: '#353535', fontSize: 14 }}>未通过原因：<Text style={{ color: '#FF3154' }}>图片提交异常</Text></Text>
    //             <TouchableOpacity activeOpacity={1} onPress={() => {
    //                 N.navigate('FeedBackPage');
    //             }} style={styles.answerBtn}>
    //                 <Text style={{ fontSize: 12, color: '#FF3154', lineHeight: 25, textAlign: 'center' }}>我有疑问</Text>
    //             </TouchableOpacity>
    //         </View>
    //     </>
    // );
    }
}

const styles = StyleSheet.create({
    answerBtn: {
        borderColor: '#FF3154',
        borderRadius: 14,
        borderWidth: 1,
        height: 28,
        width: 72
    },
    copyBtn: {
        borderColor: '#FF6C00',
        borderRadius: 14,
        borderWidth: 1,
        height: 28,
        width: 72
    },
    deadline: {
        color: '#353535',
        fontSize: 14,
        lineHeight: 40,
    },
    giveUpBtn: {
        borderColor: '#FF6C00',
        borderRadius: 22,
        borderWidth: 1,
        height: 42,
        marginLeft: '10%',
        marginTop: 15,
        width: '80%'
    },
    itemView: {
        backgroundColor: '#fff',
        marginTop: itemMarginTop
    },
    itemViewCenter: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 40,
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10
    },
    itemViewTop: {
        alignItems: 'center',
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: 60,
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10
    },
    itemViewTopName: {
        color: '#353535',
        fontSize: 14,
    },
});
