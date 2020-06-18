import React from 'react';
import { SafeAreaView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { css } from '../../assets/style/css';
import ListGeneral from '../../components/ListGeneral';
import Header from '../../components/Header';
import { N } from '../../utils/router';
import toast from '../../utils/toast';

const itemHeight = 110;
const itemMarginTop = 10;
export default function WithdrawRecordsPage () {
    const headerRight = <Text style={{ color: '#FF6C00', fontSize: 14 }}>状态说明</Text>;

    return (
        <SafeAreaView style={css.safeAreaView}>
            <Header scene={{ descriptor: { options: {} }, route: { name: '提现记录' } }} navigation={N} onPress={() => {
                toast('alert');
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
                                status: 1,
                                price: 0.8,
                            },
                            {
                                id: 2,
                                time: '2020.02.23 01:1',
                                status: 2,
                                price: 0.8,
                            },
                            {
                                id: 3,
                                time: '2020.02.23 01:1',
                                status: 3,
                                price: 0.8,
                            },
                        ]);
                    }}
                    renderItem={item => {
                        return (
                            <>
                                <View style={styles.itemView} key={item.id}>
                                    <View style={[css.flexRCSB, styles.item, { borderBottomWidth: 1, borderBottomColor: '#EDEDED' }]}>
                                        <Text numberOfLines={1} style={{ fontSize: 12, color: '#999' }}>申请时间：{item.time}</Text>
                                        <Text numberOfLines={1} style={{ fontSize: 24, color: '#FF6C00', fontWeight: '600' }}>-8000<Text style={{ fontSize: 14, fontWeight: '600' }}>金币(0.8元）</Text></Text>
                                    </View>
                                    <RenderView item={item}/>
                                </View>
                            </>
                        );
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

function RenderView ({ item }) {
    switch (item.status) {
    case 1:return (
        <View style={[css.flexRCSB, styles.item, { height: 50 }]}>
            <Text numberOfLines={1} style={ { color: '#0045FF', fontSize: 15, maxWidth: 180 }}>提现中</Text>
            <Text numberOfLines={1} style={{ color: '#999', fontSize: 12 }}>24小时内审核到账</Text>
        </View>
    );
    case 2:return (
        <View style={[css.flexRCSB, styles.item, { height: 50 }]}>
            <Text numberOfLines={1} style={ { color: '#999', fontSize: 12, maxWidth: 200 }}>提现失败(提现账户异常)，金币已退回</Text>
            <TouchableOpacity onPress={() => {
                N.navigate('FeedBackPage');
            }}>
                <Text numberOfLines={1} style={{ color: '#FA0000', fontSize: 15 }}>我有疑问</Text>
            </TouchableOpacity>
        </View>
    );
    default:return (
        <View style={[css.flexRCSB, styles.item, { height: 50 }]}>
            <Text numberOfLines={1} style={ { color: '#53C23B', fontSize: 15, maxWidth: 180 }}>提现成功</Text>
        </View>
    );
    }
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
    text: {
        color: '#353535',
        fontSize: 14
    },
});
