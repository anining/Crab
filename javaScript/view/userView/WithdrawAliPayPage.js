import React, { useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
    DeviceEventEmitter,
} from 'react-native';
import { css } from '../../assets/style/css';
import { N } from '../../utils/router';
import Crab from '../../components/Crab';
import with7 from '../../assets/icon/withdraw/withdraw7.png';
import with8 from '../../assets/icon/withdraw/withdraw8.png';
import { postWithdraw } from '../../utils/api';
import toast from '../../utils/toast';
import Choice from '../../components/Choice';
import with10 from '../../assets/icon/withdraw/withdraw10.png';

const { width } = Dimensions.get('window');
export default function WithdrawAliPayPage (props) {
    const [goodId] = useState(`${props.route.params.goodId}`);
    const [money] = useState(`${props.route.params.money}`);
    const [number, setNumber] = useState();
    const [name, setName] = useState();

    function withdraw () {
        if (!goodId || !money || !number || !name) {
            toast('提现失败');
            return;
        }
        postWithdraw(goodId, money, 'ali', number, name).then(r => {
            const { error } = r;
            if (error) {
                const { msg } = r;
                toast(msg || '提现失败');
                if (error === 8) {
                    N.navigate('WeChatBindPage');
                }
            } else {
                DeviceEventEmitter.emit('showPop', <Choice info={{
                    icon: with10,
                    tips: '提现申请成功，请耐心等待审核。一般1个工作日内审核完成。',
                    type: 1,
                    rc: () => {
                        N.navigate('UserPage');
                    },
                    rt: '我知道了',
                    fontSize: 15
                }}/>);
            }
        });
    }

    return (
        <SafeAreaView style={[css.safeAreaView, css.flexCSB]}>
            <View style={styles.container}>
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
            <TouchableOpacity onPress={() => {
                withdraw();
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
