import React, { useState } from 'react';
import { SafeAreaView, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { css } from '../../assets/style/css';
import ListHeader from '../../components/ListHeader';
import ListGeneral from '../../components/ListGeneral';
import toast from '../../utils/toast';
import task10 from '../../assets/icon/task/task10.png';
import { N } from '../../utils/router';
import { giveUp, taskReceive } from '../../utils/api';
import { _copyStr, djangoTime, transformMoney, transformTime } from '../../utils/util';
import { task, updateUser } from '../../utils/update';
import CountDown from '../../components/CountDown';

const itemMarginTop = 10;
const HEADER_DATA = [
    {
        tabLabel: '进行中',
        type: 1,
        itemHeight: 215
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

function MyTaskPage (props) {
    const view = [];

    HEADER_DATA.forEach(header => {
        view.push(
            <View tabLabel={header.tabLabel} key={header.tabLabel}>
                <L type={header.type} itemHeight={header.itemHeight}/>
            </View>
        );
    });

    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#F8F8F8' }]}>
            <ListHeader locked={true} value={props.route.params.id}>
                {view}
            </ListHeader>
        </SafeAreaView>
    );
}

function L ({ type, itemHeight }) {
    const [listRef, setListRef] = useState();

    return (
        <View style={{ height: '100%' }}>
            <ListGeneral
                ref={ref => setListRef(ref)}
                itemHeight={itemHeight}
                itemMarginTop={itemMarginTop}
                getList={ (page, num, callback) => {
                    updateUser();
                    taskReceive(page, num, type).then(r => {
                        !r.error && callback(r.data);
                    });
                }}
                renderItem={item => {
                    const { receive_task_id, success_rate, reason, category, updated_at, finish_deadline, account, money } = item;
                    return (
                        <View>
                            <View style={[styles.itemView, { height: itemHeight }]} key={receive_task_id}>
                                <View style={styles.itemViewTop}>
                                    <Text style={{ color: '#353535', fontSize: 13, fontWeight: '500' }}>摸鱼夺宝类型：{category}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={task10} style={{ height: 20, width: 19, marginRight: 5 }}/>
                                        <Text style={{ color: '#FF6C00', fontSize: 19, fontWeight: '600' }}>{transformMoney(money)} <Text style={{ fontSize: 12 }}>金币</Text></Text>
                                    </View>
                                </View>
                                <RenderAccount success_rate={success_rate} account={account} receive_task_id={receive_task_id}/>
                                <TouchableOpacity activeOpacity={1} style={styles.itemViewCenter} onPress={() => {
                                    task(null, receive_task_id);
                                }}>
                                    <Text style={{ color: '#353535', fontSize: 12 }}>参与ID：{receive_task_id}</Text>
                                    <TouchableOpacity activeOpacity={1} onPress={() => {
                                        _copyStr(receive_task_id);
                                    }} style={styles.copyBtn}>
                                        <Text style={{ fontSize: 12, color: '#FF6C00', lineHeight: 25, textAlign: 'center' }}>复制ID值</Text>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                                <RenderItem type={type} receive_task_id={receive_task_id} reason={reason} updated_at={updated_at} finish_deadline={finish_deadline} listRef={listRef}/>
                            </View>
                        </View>
                    );
                }}
            />
        </View>
    );
}

function RenderAccount ({ receive_task_id, account, success_rate }) {
    if (!account) {
        return <></>;
    }
    return (
        <TouchableOpacity activeOpacity={1} style={styles.viewCenter} onPress={() => {
            task(null, receive_task_id);
        }}>
            <Text style={styles.itemViewTopName} numberOfLines={1}>账号：{account}</Text>
            <Text style={{ fontSize: 12, color: '#999' }}>当前账号参与通过率：<Text style={{ color: '#FF6C00' }}>{Number.parseInt(success_rate * 100)}</Text> %</Text>
        </TouchableOpacity>
    );
}

function RenderItem ({ type, updated_at, receive_task_id, reason, finish_deadline, listRef }) {
    function apiGiveUp () {
        giveUp(receive_task_id).then(r => {
            if (!r.error) {
                toast('操作成功');
                listRef._onRefresh();
            }
        });
    }
    switch (type) {
    case 1:
        return (
            <>
                <View style={styles.viewBottom}>
                    <Text style={styles.deadline}>剩余时间：</Text>
                    <CountDown time={+new Date(djangoTime(finish_deadline))} style={styles.deadline}/>
                </View>
                <TouchableOpacity onPress={() => {
                    apiGiveUp();
                }} style={styles.giveUpBtn}>
                    <Text style={{ fontSize: 15, color: '#FF6C00', lineHeight: 42, textAlign: 'center' }}>放弃</Text>
                </TouchableOpacity>
            </>
        );
    case 4:
        return (
            <View style={styles.viewBottomBtn}>
                <Text style={{ color: '#353535', fontSize: 12 }}>提交时间：{transformTime(updated_at)}</Text>
                <Text style={{ color: '#2D6DFF', fontWeight: '500', fontSize: 12 }}>24小时内审核</Text>
            </View>
        );
    case 5:
        return (
            <View style={styles.viewBottomBtn}>
                <Text style={{ color: '#353535', fontSize: 12 }}>审核时间：{transformTime(updated_at)}</Text>
                <Text style={{ color: '#53C23B', fontWeight: '500', fontSize: 12 }}>已通过</Text>
            </View>
        );
    default:
        return (
            <>
                <View style={[styles.viewBottomBtn, { height: 50 }]}>
                    <Text style={{ color: '#353535', fontSize: 12 }}>审核时间：{transformTime(updated_at)}</Text>
                    <Text style={{ color: '#FF3154', fontWeight: '500', fontSize: 12 }}>未通过</Text>
                </View>
                <View style={styles.defaultView}>
                    <Text style={{ color: '#353535', fontSize: 12 }}>未通过原因：<Text style={{ color: '#FF3154' }}>{reason}</Text></Text>
                    <TouchableOpacity onPress={() => {
                        N.navigate('HelpCenterPage');
                    }} style={styles.answerBtn}>
                        <Text style={styles.feedBtn}>我有疑问</Text>
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
        color: '#353535',
        fontSize: 12,
    },
    defaultView: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 40,
        justifyContent: 'space-between',
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    feedBtn: {
        color: '#FF3154',
        fontSize: 12,
        lineHeight: 25,
        textAlign: 'center'
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
        fontSize: 12,
        maxWidth: 170
    },
    viewBottom: {
        alignItems: 'center',
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        borderTopColor: '#EDEDED',
        borderTopWidth: 1,
        flexDirection: 'row',
        height: 40,
        justifyContent: 'flex-start',
        marginTop: 5,
        paddingLeft: 10
    },
    viewBottomBtn: {
        alignItems: 'center',
        borderTopColor: '#EDEDED',
        borderTopWidth: 1,
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
        marginTop: 5,
        paddingLeft: 10,
        paddingRight: 10
    },
    viewCenter: {
        flexDirection: 'row',
        height: 25,
        justifyContent: 'space-between',
        marginTop: 15,
        paddingLeft: 10,
        paddingRight: 10
    }
});

export default MyTaskPage;
