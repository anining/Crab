import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Image, TouchableOpacity, Dimensions, TextInput, DeviceEventEmitter } from 'react-native';
import { css } from '../../assets/style/css';
import { N } from '../../utils/router';
import Crab from '../../components/Crab';
import with7 from '../../assets/icon/withdraw/withdraw7.png';
import with8 from '../../assets/icon/withdraw/withdraw8.png';
import { postWithdraw } from '../../utils/api';
import toast from '../../utils/toast';
import Choice from '../../components/Choice';
import with10 from '../../assets/icon/withdraw/withdraw10.png';
import asyncStorage from '../../utils/asyncStorage';
import { updateSecondIncome, updateUser } from '../../utils/update';
import Button from '../../components/Button';

const { width } = Dimensions.get('window');

function WithdrawAliPayPage (props) {
    const [goodId] = useState(props.route.params.goodId);
    const [money] = useState(props.route.params.money);
    const [number, setNumber] = useState();
    const [name, setName] = useState();
    let aliNameRef;
    let aliNumberRef;
    useEffect(() => {
        asyncStorage.getItem('aliName').then((res) => {
            res && (() => {
                setName(res);
                aliNameRef && aliNameRef.setNativeProps({
                    text: res
                });
            })();
        });
        asyncStorage.getItem('aliNumber').then((res) => {
            res && (() => {
                setNumber(res);
                aliNumberRef && aliNumberRef.setNativeProps({
                    text: res
                });
            })();
        });
    }, []);
    function withdraw (callback) {
        if (!goodId || !money || !number || !name) {
            toast('请填写完整的账号和姓名');
            callback && callback();
            return;
        }
        postWithdraw(goodId, money, 'ali', number, name).then(r => {
            callback && callback();
            if (r && !r.error) {
                asyncStorage.setItem('aliName', name);
                asyncStorage.setItem('aliNumber', number);
                DeviceEventEmitter.emit('showPop', <Choice info={{
                    icon: with10,
                    tips: '兑换申请成功，请耐心等待审核。一般1个工作日内审核完成。',
                    type: 1,
                    rc: () => {},
                    rt: '我知道了',
                    fontSize: 15
                }}/>);
                N.navigate('UserPage');
                updateUser();
                updateSecondIncome();
            } else if (r && r.error === 9) {
                toast('请绑定微信');
                N.replace('WeChatBindPage');
            }
        });
    }

    return (
        <SafeAreaView style={[css.safeAreaView, css.flexCSB]}>
            <View style={styles.container}>
                <Text style={styles.moneyTitleText}>你选择兑换的金额:<Text style={{ color: '#FF3E00' }}>{money}元</Text></Text>
                <View style={styles.inputView}>
                    <Image source={with8} style={{ height: 20, width: 20, marginRight: 5, }} />
                    <Text style={{ fontWeight: '500', fontSize: 14, color: '#353535' }}>支付宝账号：</Text>
                    <TextInput
                        keyboardType='numeric'
                        maxLength={50}
                        placeholder={'请输入支付宝账号'}
                        placeholderTextColor={'#BCBCBC'}
                        onChangeText={number => setNumber(number)} ref={ref => ref && (aliNumberRef = ref)}/>
                </View>
                <View style={[styles.inputView, { marginBottom: 20 }]}>
                    <Image source={with7} style={{ height: 20, width: 20, marginRight: 5, }} />
                    <Text style={{ fontWeight: '500', fontSize: 14, color: '#353535' }}>支付宝姓名：</Text>
                    <TextInput
                        maxLength={50}
                        placeholder={'请输入支付宝对应姓名'}
                        placeholderTextColor={'#BCBCBC'}
                        onChangeText={name => setName(name)} ref={ref => ref && (aliNameRef = ref)}/>
                </View>
                <Crab text="兑换说明：" paddingLeft={0}/>
                <Text style={{ fontSize: 12, color: '#999' }}>1.支付宝账号姓名必须匹配，否则兑换不会到账。</Text>
            </View>
            {/* <TouchableOpacity activeOpacity={1} onPress={withdraw} style={styles.btn}> */}
            {/*    <Text style={styles.btnText}>兑换到支付宝</Text> */}
            {/* </TouchableOpacity> */}
            <Button type={2} name={'兑换到支付宝'} onPress={(callback) => {
                withdraw(callback);
            }}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#FF3E00',
        height: 50,
        width
    },
    btnText: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 50,
        textAlign: 'center'
    },
    container: {
        padding: 15,
        width
    },
    inputView: {
        alignItems: 'center',
        backgroundColor: '#F4F4F4',
        borderRadius: 4,
        flexDirection: 'row',
        height: 44,
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%'
    },
    moneyTitleText: {
        color: '#666',
        fontSize: 15,
        height: 40
    }
});

export default WithdrawAliPayPage;
