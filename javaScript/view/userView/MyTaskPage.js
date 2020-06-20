import React from 'react';
import { SafeAreaView, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { css } from '../../assets/style/css';
import Clipboard from '@react-native-community/clipboard';
import ListHeader from '../../components/ListHeader';
import ListGeneral from '../../components/ListGeneral';
import toast from '../../utils/toast';
import task10 from '../../assets/icon/task/task10.png';
import { N } from '../../utils/router';

const itemMarginTop = 10;
const HEADER_DATA = [
    {
        tabLabel: '进行中',
        type: 1,
        itemHeight: 265
    },
    {
        tabLabel: '审核中',
        type: 2,
        itemHeight: 208
    },
    {
        tabLabel: '已通过',
        type: 3,
        itemHeight: 208
    },
    {
        tabLabel: '未通过',
        type: 4,
        itemHeight: 240
    }
];

export default function MyTaskPage () {
    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#F8F8F8' }]}>
            <RenderHeader/>
        </SafeAreaView>
    );
}

function RenderHeader () {
    const components = [];
    HEADER_DATA.forEach(header => {
        components.push(
            <View tabLabel={header.tabLabel} key={header.tabLabel}>
                <L type={header.type} itemHeight={header.itemHeight}/>
            </View>
        );
    });
    return (
        <ListHeader>
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
                    // eslint-disable-next-line standard/no-callback-literal
                    callback([
                        {
                            type: '音符点赞',
                            price: 1000,
                            nickName: 'nickName',
                            time: '2020.01.15',
                            id: 1111,
                        },
                        {
                            type: '音符点赞',
                            price: 1000,
                            nickName: 'nickName',
                            time: '2020.01.15',
                            id: 1111,
                        },
                        {
                            type: '音符点赞',
                            price: 1000,
                            nickName: 'nickName',
                            time: '2020.01.15',
                            id: 1111,
                        },
                    ]);
                }}
                renderItem={item => {
                    return (
                        <>
                            <View style={[styles.itemView, { height: itemHeight }]} key={item.id + item.time}>
                                <View style={styles.itemViewTop}>
                                    <Text style={{ color: '#353535', fontSize: 15, fontWeight: '500' }}>任务类型：音符点赞</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={task10} style={{ height: 20, width: 19, marginRight: 5 }}/>
                                        <Text style={{ color: '#FF6C00', fontSize: 24, fontWeight: '600' }}>8000<Text style={{ fontSize: 14 }}>金币</Text></Text>
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
                                    <Text style={styles.itemViewTopName}>做单账号：音符任务专号</Text>
                                    <Text style={{ fontSize: 12, color: '#999' }}>{item.a ? '当前账号任务通过率：' : ''}<Text style={{ color: '#FF6C00' }}>{item.a}</Text></Text>
                                </View>
                                <View style={styles.itemViewCenter}>
                                    <Text style={{ color: '#353535', fontSize: 14 }}>接任务ID：1524873</Text>
                                    <TouchableOpacity activeOpacity={1} onPress={() => {
                                        Clipboard.setString('hello world');
                                        toast('复制成功');
                                    }} style={styles.copyBtn}>
                                        <Text style={{ fontSize: 12, color: '#FF6C00', lineHeight: 25, textAlign: 'center' }}>复制ID值</Text>
                                    </TouchableOpacity>
                                </View>
                                <RenderItem type={type} item={item}/>
                            </View>
                        </>
                    );
                }}
            />
        </View>
    );
}

function RenderItem ({ type, item }) {
    switch (type) {
    case 1:return (
        <>
            <Text style={styles.deadline}>剩余时间：00:59:59</Text>
            <TouchableOpacity activeOpacity={1} onPress={() => {

            }} style={styles.giveUpBtn}>
                <Text style={{ fontSize: 17, color: '#FF6C00', lineHeight: 42, textAlign: 'center' }}>放弃任务</Text>
            </TouchableOpacity>
        </>
    );
    case 2:return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: 10,
            height: 50,
            borderTopColor: '#EDEDED',
            borderTopWidth: 1,
            marginTop: 15,
            paddingLeft: 10,
        }}>
            <Text style={{ color: '#353535', fontSize: 14 }}>提交时间：00:59:59</Text>
            <Text style={{ color: '#2D6DFF', fontSize: 14, fontWeight: '500' }}>审核中(24小时内审核)</Text>
        </View>
    );
    case 3:return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: 10,
            height: 50,
            borderTopColor: '#EDEDED',
            borderTopWidth: 1,
            marginTop: 15,
            paddingLeft: 10,
        }}>
            <Text style={{ color: '#353535', fontSize: 14 }}>审核时间：00:59:59</Text>
            <Text style={{ color: '#53C23B', fontSize: 14, fontWeight: '500' }}>已通过</Text>
        </View>
    );
    default:return (
        <>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingRight: 10,
                height: 40,
                borderTopColor: '#EDEDED',
                borderTopWidth: 1,
                marginTop: 15,
                paddingLeft: 10,
            }}>
                <Text style={{ color: '#353535', fontSize: 14 }}>审核时间：00:59:59</Text>
                <Text style={{ color: '#FF3154', fontSize: 14, fontWeight: '500' }}>未通过</Text>
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingRight: 10,
                height: 40,
                paddingLeft: 10,
            }}>
                <Text style={{ color: '#353535', fontSize: 14 }}>未通过原因：<Text style={{ color: '#FF3154' }}>图片提交异常</Text></Text>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    N.navigate('FeedBackPage');
                }} style={styles.answerBtn}>
                    <Text style={{ fontSize: 12, color: '#FF3154', lineHeight: 25, textAlign: 'center' }}>我有疑问</Text>
                </TouchableOpacity>
            </View>
        </>
    );
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
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        borderTopColor: '#EDEDED',
        borderTopWidth: 1,
        color: '#353535',
        fontSize: 14,
        lineHeight: 40,
        marginTop: 15,
        paddingLeft: 10,
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
