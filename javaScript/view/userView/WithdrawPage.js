import React, { useState } from 'react';
import { SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, Image, StyleSheet, Text, View, Dimensions } from 'react-native';
import { css } from '../../assets/style/css';
import withdrawPage1 from '../../assets/icon/withdrawPage/withdrawPage1.png';
import withdrawPage2 from '../../assets/icon/withdrawPage/withdrawPage2.png';
import withdrawPage3 from '../../assets/icon/withdrawPage/withdrawPage3.png';
import withdrawPage4 from '../../assets/icon/withdrawPage/withdrawPage4.png';
import { N } from '../../utils/router';

const { width } = Dimensions.get('window');
const GOOD_LIST = [
    {
        id: 1,
        price: 10,
        handlingFee: 1,
        once: true
    },
    {
        id: 2,
        price: 10,
        handlingFee: 0,
        once: false
    },
    {
        id: 3,
        price: 10,
        handlingFee: 1,
        once: false
    },
    {
        id: 4,
        price: 10,
        handlingFee: 1,
        once: false
    },
    {
        id: 5,
        price: 10,
        handlingFee: 1,
        once: false
    },
    {
        id: 6,
        price: 10,
        handlingFee: 1,
        once: false
    },
];
export default function WithdrawPage () {
    const [goodId, setGoodId] = useState();
    const [payType, setPayType] = useState('wx');
    return (
        <SafeAreaView style={css.safeAreaView}>
            <ScrollView style={styles.scrollView}>
                <ImageBackground source={withdrawPage1} style={styles.moneyView}>
                    <View style={styles.moneyViewTop}>
                        <Text style={{ fontWeight: '600', fontSize: 31, color: '#fff' }}>1520.5</Text>
                        <Text style={{ fontSize: 11, color: '#fff' }}>可提现收益(金币)</Text>
                    </View>
                    <View style={styles.moneyViewBottom}>
                        <View style={[styles.moneyViewItem, {
                            borderRightWidth: 1,
                            borderRightColor: '#FFF'
                        }]}>
                            <Text style={{ fontWeight: '800', fontSize: 14, color: '#fff' }}>500W</Text>
                            <Text style={{ fontSize: 11, color: '#fff' }}>今日收益(金币)</Text>
                        </View>
                        <View style={styles.moneyViewItem}>
                            <Text style={{ fontWeight: '800', fontSize: 14, color: '#fff' }}>500W</Text>
                            <Text style={{ fontSize: 11, color: '#fff' }}>今日收益(金币)</Text>
                        </View>
                    </View>
                </ImageBackground>
                <View style={styles.goodView}>
                    <View style={styles.goodViewTitle}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#222' }}>提现金额<Text style={{ fontSize: 11, fontWeight: '500', color: '#FF6C00' }}> （1元 = 10000金币）</Text></Text>
                        <Text style={{ fontSize: 11, color: '#999' }}>连续签到可获取免手续费特权</Text>
                    </View>
                    <RenderGoodItem goodList={GOOD_LIST} setGoodId={setGoodId} goodId={goodId}/>
                </View>
                <View style={styles.withDrawView}>
                    <View style={styles.withDrawViewTitle}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#222' }}>提现到</Text>
                        <TouchableOpacity onPress={() => {
                            N.navigate('WithdrawRecordsPage');
                        }}>
                            <Text style={{ fontSize: 12, color: '#FF6C00' }}>提现记录</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.withDrawType}>
                        <TouchableOpacity onPress={() => {
                            setPayType('ali');
                        }} style={[styles.withDrawTypeItem, { borderColor: payType === 'ali' ? '#FF6C00' : '#D0D0D0' }]}>
                            <Image source={withdrawPage3} style={{ width: 26, height: 26, marginRight: 7 }} />
                            <Text style={{ fontSize: 16, color: '#222' }}>支付宝账户</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setPayType('wx');
                        }} style={[styles.withDrawTypeItem, { borderColor: payType === 'wx' ? '#FF6C00' : '#D0D0D0' }]}>
                            <Image source={withdrawPage4} style={{ width: 26, height: 26, marginRight: 7 }} />
                            <Text style={{ fontSize: 16, color: '#222' }}>微信账户</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text numberOfLines={1} style={styles.title}>提现说明：</Text>
                <Text numberOfLines={1} style={styles.text}>1.提现前请先绑定微信账号，微信账号绑定后不能修改。</Text>
                <Text numberOflines={1} style={styles.text}>2.1元 = 10000金币。通过做单、活动、收徒等获得金币。</Text>
                <Text numberOflines={1} style={styles.text}>3.首单1元起提；第二单5元起提；之后每单10元起提。</Text>
                <Text numberOflines={1} style={styles.text}>4.提现审核成功后到账，一般1个工作日内审核完成。</Text>
                <Text numberOflines={1} style={styles.text}>5.提现审核成功后立即到账，可以在“提现记录”查看提现状态。</Text>
                <Text numberOflines={1} style={styles.text}>6.如果微信账号不能正常提现，请使用支付账户提现。</Text>
                <Text numberOflines={1} style={styles.text}>7.支付宝账号和姓名必须匹配，否则提现不会到账。</Text>
                <Text numberOflines={1} style={[styles.text, { paddingBottom: 50 }]}>8.每天每档只能提现一次。</Text>
            </ScrollView>
            <TouchableOpacity onPress={() => {
                N.navigate('WithdrawAliPayPage');
            }} style={styles.withDrawBtn}>
                <Text style={styles.withDrawBtnText}>立即提现</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

function RenderGoodItem ({ goodList, setGoodId, goodId }) {
    const goodView = [];
    goodList.forEach(good => {
        goodView.push(
            <TouchableOpacity onPress={() => {
                setGoodId(good.id);
            }} key={good.id} style={[styles.goodItem, { borderColor: goodId === good.id ? '#FF6C00' : '#D0D0D0', backgroundColor: goodId === good.id ? '#FFF5F0' : '#fff' }]}>
                <RenderGoodOnceView once={good.once}/>
                <Text style={{ fontSize: 20, color: '#FF6C00', fontWeight: '800', marginBottom: 2 }}>{good.price}元</Text>
                <Text style={{ fontSize: 12, color: good.handlingFee ? '#999' : '#FF6C00', marginTop: 2 }}>{good.handlingFee ? `手续费：${good.handlingFee}元` : '免手续费'}</Text>
            </TouchableOpacity>
        );
    });
    return (
        <View style={styles.good}>
            {goodView}
        </View>
    );
}

function RenderGoodOnceView ({ once }) {
    if (once) {
        return (
            <ImageBackground source={withdrawPage2} style={{ height: 24, width: 59, position: 'absolute', top: '-18%', left: '-3%' }}>
                <Text style={{ lineHeight: 21, textAlign: 'center', fontSize: 12, color: '#fff' }}>仅一次</Text>
            </ImageBackground>
        );
    }
    return <View/>;
}

const styles = StyleSheet.create({
    good: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    goodItem: {
        alignItems: 'center',
        borderRadius: 6,
        borderWidth: 1,
        height: 66,
        justifyContent: 'center',
        marginBottom: 10,
        marginLeft: '1%',
        marginRight: '1%',
        position: 'relative',
        width: '31.333%'
    },
    goodView: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginLeft: '1%',
        minHeight: 225,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        width: '98%'
    },
    goodViewTitle: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
        marginBottom: 5
    },
    moneyView: {
        height: (width - 20) * 468 / 1089,
        width: width - 20
    },
    moneyViewBottom: {
        flexDirection: 'row',
        height: '25%',
        marginTop: '5%',
        width: '100%',
    },
    moneyViewItem: {
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        width: '50%',
    },
    moneyViewTop: {
        alignItems: 'center',
        height: '50%',
        justifyContent: 'flex-end',
        marginLeft: '25%',
        width: '50%'
    },
    scrollView: {
        backgroundColor: '#F8F8F8',
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
    },
    text: {
        color: '#999',
        fontSize: 12,
        marginTop: 10
    },
    title: {
        color: '#353535',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15
    },
    withDrawBtn: {
        backgroundColor: '#FF3E00',
        height: 44,
        width
    },
    withDrawBtnText: {
        color: '#fff',
        fontSize: 17,
        lineHeight: 44,
        textAlign: 'center'
    },
    withDrawType: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    withDrawTypeItem: {
        alignItems: 'center',
        borderRadius: 6,
        borderWidth: 1,
        flexDirection: 'row',
        height: 56,
        justifyContent: 'center',
        marginBottom: 10,
        marginLeft: '1%',
        marginRight: '1%',
        width: '48%'
    },
    withDrawView: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginLeft: '1%',
        marginTop: 10,
        minHeight: 160,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        width: '98%'
    },
    withDrawViewTitle: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
        marginBottom: 5
    }
});
