import React, { useState } from 'react';
import { SafeAreaView, DeviceEventEmitter, TouchableOpacity, Text, StyleSheet, Modal, View } from 'react-native';
import { css } from '../../assets/style/css';
import ListGeneral from '../../components/ListGeneral';
import Header from '../../components/Header';
import { N } from '../../utils/router';

const itemHeight = 110;
const itemMarginTop = 10;
const headerRight = <Text style={{ color: '#FF6C00', fontSize: 14 }}>来源筛选</Text>;
export default function FundingRecordsPage () {
    const STATUS_DATA = [
        { id: 1, label: '全部' },
        { id: 2, label: '活动红包' },
        { id: 3, label: '官方红包' },
        { id: 4, label: '任务通过' },
        { id: 5, label: '收徒奖励' },
        { id: 6, label: '徒弟返现' },
        { id: 7, label: '提现' },
    ];

    return (
        <SafeAreaView style={css.safeAreaView}>
            <Header scene={{ descriptor: { options: {} }, route: { name: '资金记录' } }} navigation={N} onPress={() => {
                DeviceEventEmitter.emit('showPop', <RenderSelect status={STATUS_DATA}/>);
            }} headerRight={headerRight}/>
            <View style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
                <ListGeneral
                    itemHeight={itemHeight}
                    itemMarginTop={itemMarginTop}
                    getList={async (page, num, callback) => {
                        // eslint-disable-next-line standard/no-callback-literal
                        callback([
                            {
                                id: 1,
                                time: '2020.02.23 01:1',
                                price: 0.8,
                                type: '-',
                                origin: '任务通过(ID:1115)'
                            },
                            {
                                id: 2,
                                time: '2020.02.23 01:1',
                                price: 0.8,
                                type: '-',
                                origin: '任务通过(ID:1115)'
                            },
                            {
                                id: 3,
                                time: '2020.02.23 01:1',
                                price: 0.8,
                                type: '+',
                                origin: '提现'
                            },
                        ]);
                    }}
                    renderItem={item => {
                        return (
                            <>
                                <View style={styles.itemView} key={item.id}>
                                    <View style={[css.flexRCSB, styles.item, { borderBottomWidth: 1, borderBottomColor: '#EDEDED' }]}>
                                        <Text numberOfLines={1} style={{ fontSize: 12, color: '#999' }}>变动时间：{item.time}</Text>
                                        <Text numberOfLines={1} style={{ fontSize: 24, color: '#FF6C00', fontWeight: '600' }}>{item.type}8000<Text style={{ fontSize: 14, fontWeight: '600' }}>金币</Text></Text>
                                    </View>
                                    <View style={[css.flexRCSB, styles.item, { height: 50 }]}>
                                        <Text numberOfLines={1} style={ { color: '#353535', fontSize: 14, fontWeight: '500' }}>变动来源：{item.origin}</Text>
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

function RenderSelect ({ status }) {
    const components = [];
    status.forEach(item => {
        components.push(
            <TouchableOpacity onPress={() => {

            }} style={styles.selectBtn} key={item.id}>
                <Text style={{ color: '#FF6C00', fontSize: 15, lineHeight: 36, textAlign: 'center' }}>{item.label}</Text>
            </TouchableOpacity>
        );
    });
    return (
        <View style={{ width: '100%', position: 'absolute', top: 0 }}>
            <Header scene={{ descriptor: { options: {} }, route: { name: '资金记录' } }} navigation={N} onPress={() => {
                DeviceEventEmitter.emit('hidePop');
            }} headerRight={headerRight}/>
            <View style={styles.selectView}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#353535', paddingLeft: '2%', paddingRight: '2%' }}>变动来源</Text>
                <View style={styles.select}>
                    {components}
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
        backgroundColor: '#FFEBDC',
        borderRadius: 18,
        height: 36,
        marginLeft: '2%',
        marginRight: '2%',
        marginTop: 15,
        width: '29.333%'
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
    },
});
