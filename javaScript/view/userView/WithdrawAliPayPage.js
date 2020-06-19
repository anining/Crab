import React, { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Image, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { css } from '../../assets/style/css';
import { N } from '../../utils/router';
import Crab from '../../components/Crab';
import with6 from '../../assets/icon/withdraw/withdraw6.png';
import with7 from '../../assets/icon/withdraw/withdraw7.png';
import with8 from '../../assets/icon/withdraw/withdraw8.png';

const { width, height } = Dimensions.get('window');
export default function WithdrawAliPayPage () {
    const [price, setPrice] = useState();
    const [number, setNumber] = useState();
    const [name, setName] = useState();
    return (
        <SafeAreaView style={[css.safeAreaView, css.flexCSB]}>
            <View style={styles.container}>
                <View style={styles.inputView}>
                    <Image source={with6} style={{ height: 20, width: 20, marginRight: 5, }} />
                    <Text style={{ fontWeight: '500', fontSize: 14, color: '#353535' }}>提现金额：</Text>
                    <TextInput
                        maxLength={11}
                        placeholder={'请输入提现金额'}
                        placeholderTextColor={'#BCBCBC'}
                        onChangeText={price => setPrice(price)}/>
                </View>
                <View style={styles.inputView}>
                    <Image source={with8} style={{ height: 20, width: 20, marginRight: 5, }} />
                    <Text style={{ fontWeight: '500', fontSize: 14, color: '#353535' }}>支付宝账号：</Text>
                    <TextInput
                        keyboardType='numeric'
                        maxLength={11}
                        placeholder={'请输入支付宝账号'}
                        placeholderTextColor={'#BCBCBC'}
                        onChangeText={number => setNumber(number)}/>
                </View>
                <View style={[styles.inputView, { marginBottom: 20 }]}>
                    <Image source={with7} style={{ height: 20, width: 20, marginRight: 5, }} />
                    <Text style={{ fontWeight: '500', fontSize: 14, color: '#353535' }}>支付宝姓名：</Text>
                    <TextInput
                        keyboardType='numeric'
                        maxLength={11}
                        placeholder={'请输入支付宝对应姓名'}
                        placeholderTextColor={'#BCBCBC'}
                        onChangeText={name => setName(name)}/>
                </View>
                <Crab text="提现说明：" paddingLeft={0}/>
                <Text style={{ fontSize: 12, color: '#999' }}>1.支付宝账号姓名必须匹配，否则提现不会到账。</Text>
            </View>
            <TouchableOpacity activeOpacity={1} onPress={() => {
                N.replace('MaterialTopTabNavigator');
            }} style={styles.btn}>
                <Text style={styles.btnText}>提现到支付宝</Text>
            </TouchableOpacity>
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
    }
});
