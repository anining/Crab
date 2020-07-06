import React, { useState, useEffect } from 'react';
import { SafeAreaView, DeviceEventEmitter, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { css } from '../../assets/style/css';
import ListGeneral from '../../components/ListGeneral';
import Header from '../../components/Header';
import { N } from '../../utils/router';
import { income } from '../../utils/api';
import { transformMoney, transformTime } from '../../utils/util';

const itemHeight = 110;
const itemMarginTop = 10;
const headerRight = <Text style={{ color: '#FF6C00', fontSize: 14 }}>来源筛选</Text>;
const STATUS_DATA = [
    {
        id: 999,
        label: '全部记录'
    },
    {
        id: 1,
        label: '做单收入'
    },
    {
        id: 2,
        label: '收徒奖励'
    },
    {
        id: 3,
        label: '活动奖励'
    },
    {
        id: 4,
        label: '返佣收益'
    },
    {
        id: 5,
        label: '新手福利'
    },
    {
        id: 6,
        label: '提现退款'
    },
    {
        id: 7,
        label: '提现'
    },
    {
        id: 8,
        label: '签到'
    },
    {
        id: 9,
        label: '游戏闯关'
    },
    {
        id: 10,
        label: '每秒奖励'
    }
];

function FundingRecordsPage () {
    const [source, setSource] = useState(0);
    const [listRef, setListRef] = useState();

    useEffect(() => {
        source && DeviceEventEmitter.emit('showPop', {
            dom: <RenderSelect setSource={setSource} source={source}/>,
            close,
        });
    }, [source]);

    function close () {
        listRef._onRefresh();
    }

    return (
        <SafeAreaView style={css.safeAreaView}>
            <Header scene={{ descriptor: { options: {} }, route: { name: '资金记录' } }} navigation={N} onPress={() => {
                DeviceEventEmitter.emit('showPop', {
                    dom: <RenderSelect setSource={setSource} source={source}/>,
                    close,
                });
            }} headerRight={headerRight}/>
            <View style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
                <ListGeneral
                    ref={ref => setListRef(ref)}
                    itemHeight={itemHeight}
                    itemMarginTop={itemMarginTop}
                    getList={ (page, num, callback) => {
                        income(page, num, source === 999 ? 0 : source).then(r => {
                            !r.error && callback(r.data);
                        });
                    }}
                    renderItem={item => {
                        const { income_log_id, created_at, source, change_balance } = item;
                        return (
                            <>
                                <View style={styles.itemView} key={income_log_id}>
                                    <View style={[css.flexRCSB, styles.item, { borderBottomWidth: 1, borderBottomColor: '#EDEDED' }]}>
                                        <Text numberOfLines={1} style={{ fontSize: 12, color: '#999' }}>变动时间：{transformTime(created_at)}</Text>
                                        <Text numberOfLines={1} style={{ fontSize: 24, color: '#FF6C00', fontWeight: '600' }}>{transformMoney(change_balance)}<Text style={{ fontSize: 14, fontWeight: '600' }}> 金币</Text></Text>
                                    </View>
                                    <View style={[css.flexRCSB, styles.item, { height: 50 }]}>
                                        <Text numberOfLines={1} style={ { color: '#353535', fontWeight: '500' }}>变动来源：{(STATUS_DATA[source - 1] && STATUS_DATA[source - 1].label) || '基本来源'}</Text>
                                    </View>
                                </View>
                            </>
                        );
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

function RenderSelect ({ setSource, source }) {
    const view = [];

    STATUS_DATA.forEach(item => {
        view.push(
            <TouchableOpacity activeOpacity={1} onPress={() => setSource(item.id)} style={[styles.selectBtn, { backgroundColor: source === item.id ? '#FFEBDC' : '#F5F5F5' }]} key={item.id}>
                <Text style={[styles.selectBtnText, { color: source === item.id ? '#FF6C00' : '#333' }]}>{item.label}</Text>
            </TouchableOpacity>
        );
    });

    return (
        <View style={{ position: 'absolute', width: '100%', top: 0 }}>
            <View style={styles.selectView}>
                <Text style={styles.selectMenu}>变动来源</Text>
                <View style={styles.select}>
                    {view}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        borderRadius: 15,
        height: 30,
        marginRight: 5,
        width: 30
    },
    item: {
        height: 60,
        paddingLeft: 15,
        paddingRight: 15,
        width: '100%'
    },
    itemView: {
        backgroundColor: '#FFF',
        height: itemHeight,
        marginTop: itemMarginTop,
    },
    select: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%'
    },
    selectBtn: {
        borderRadius: 18,
        height: 36,
        marginLeft: '2%',
        marginRight: '2%',
        marginTop: 15,
        width: '29.333%'
    },
    selectBtnText: {
        fontSize: 15,
        lineHeight: 36,
        textAlign: 'center'
    },
    selectMenu: {
        color: '#353535',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 7,
        paddingLeft: '2%',
        paddingRight: '2%'
    },
    selectView: {
        backgroundColor: '#fff',
        minHeight: 100,
        overflow: 'hidden',
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15,
        width: '100%'
    },
    text: {
        color: '#353535',
        fontSize: 14
    }
});

export default FundingRecordsPage;
