import React from 'react';
import { SafeAreaView, Dimensions, TouchableOpacity, Image, Text, StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { css } from '../../assets/style/css';
import ListGeneral from '../../components/ListGeneral';
import Header from '../../components/Header';
import { N } from '../../utils/router';
import { withdrawLogs } from '../../utils/api';
import with9 from '../../assets/icon/withdraw/withdraw9.png';
import { transformMoney, transformTime } from '../../utils/util';

const itemHeight = 110;
const itemMarginTop = 10;
const { width } = Dimensions.get('window');

function WithdrawRecordsPage () {
    const headerRight = <Text style={{ color: '#FF6C00', fontSize: 14 }}>状态说明</Text>;

    return (
        <SafeAreaView style={css.safeAreaView}>
            <Header scene={{ descriptor: { options: {} }, route: { name: '提现记录' } }} navigation={N} onPress={() => {
                DeviceEventEmitter.emit('showPop', <Image source={with9} style={{ height: width * 0.8 * (1038 / 885), width: width * 0.8 }}/>);
            }} headerRight={headerRight}/>
            <View style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
                <ListGeneral
                    itemHeight={itemHeight}
                    itemMarginTop={itemMarginTop}
                    getList={ (page, num, callback) => {
                        withdrawLogs(page, num).then(r => {
                            !r.error && callback(r.data);
                        });
                    }}
                    renderItem={item => {
                        const { withdraw_log_id, status, created_at, balance } = item;
                        return (
                            <>
                                <View style={styles.itemView} key={withdraw_log_id}>
                                    <View style={[css.flexRCSB, styles.item, { borderBottomWidth: 1, borderBottomColor: '#EDEDED' }]}>
                                        <Text numberOfLines={1} style={{ fontSize: 12, color: '#999', maxWidth: 200 }}>申请时间：{transformTime(created_at)}</Text>
                                        <Text numberOfLines={1} style={{ fontSize: 24, color: '#FF6C00', fontWeight: '600' }}>-{transformMoney(balance)}<Text style={{ fontSize: 14, fontWeight: '600' }}> 金币({balance}元)</Text></Text>
                                    </View>
                                    <RenderView status={status}/>
                                </View>
                            </>
                        );
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

function RenderView ({ status }) {
    switch (status) {
    case 1:
        return (
            <View style={[css.flexRCSB, styles.item, { height: 50 }]}>
                <Text numberOfLines={1} style={ { color: '#0045FF', fontSize: 15, maxWidth: 180 }}>提现中</Text>
                <Text numberOfLines={1} style={{ color: '#999', fontSize: 12 }}>24小时内审核到账</Text>
            </View>
        );
    case 2:
        return (
            <View style={[css.flexRCSB, styles.item, { height: 50 }]}>
                <Text numberOfLines={1} style={ { color: '#999', fontSize: 12, maxWidth: 200 }}>提现失败(提现账户异常)，金币已退回</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    N.navigate('FeedBackPage');
                }}>
                    <Text numberOfLines={1} style={{ color: '#FA0000', fontSize: 15 }}>我有疑问</Text>
                </TouchableOpacity>
            </View>
        );
    default:
        return (
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
    }
});

export default WithdrawRecordsPage;
