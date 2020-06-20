import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity, TextInput, Text, Image } from 'react-native';
import { css } from '../../assets/style/css';
import { N } from '../../utils/router';
import login1 from '../../assets/icon/login/login1.png';
import login2 from '../../assets/icon/login/login2.png';
import toast from '../../utils/toast';
import { apiLogin, verifyCode } from '../../utils/api';
// import Android from '../../components/Android';
import * as U from 'karet.util';
import { store } from '../../utils/store';
import asyncStorage from '../../utils/asyncStorage';

export default function LoginPage () {
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [codeText, setCodeText] = useState('获取验证码');
    // const [inviteCode, setInviteCode] = useState('');

    // useEffect(() => {
    // const r = await Android.verifyLogin();
    // }, []);

    async function login () {
        if (!phone || !code) {
            toast('请完善信息');
            return;
        }
        const r = await apiLogin(phone, code);
        if (!r.error) {
            const { access_token, token_type } = r.data;
            const authorization = U.view(['authorization'], store);
            U.set(authorization, `${token_type} ${access_token}`);
            asyncStorage.setItem('authorization', `${token_type} ${access_token}`);
            N.replace('MaterialTopTabNavigator');
        } else {
            toast(r.msg || '登录失败');
        }
    }

    async function getCode () {
        if (!isNaN(codeText)) {
            return;
        }
        if (phone.length !== 11) {
            toast('账号错误');
            return;
        }
        let second = 60;
        const interval = setInterval(() => {
            setCodeText(second);
            second--;
            if (second < 0) {
                setCodeText('获取验证码');
                clearInterval(interval);
            }
        }, 1000);
        const r = await verifyCode(phone);
        if (!r.error) {
            toast('验证码发送成功');
        } else {
            toast(r.msg || '验证码发送失败');
        }
    }

    return (
        <SafeAreaView style={css.safeAreaView}>
            <View style={styles.container}>
                <Text style={styles.title}>账号登录</Text>
                <View style={[css.flexRowCenterStart, styles.inputTitle]}>
                    <Image source={login2} style={{ height: 22, width: 18, marginRight: 10 }} />
                    <Text style={{ fontSize: 15 }}>账号</Text>
                </View>
                <TextInput
                    keyboardType='numeric'
                    style={styles.phoneInput}
                    maxLength={11}
                    placeholder={'请输入您的账号'}
                    placeholderTextColor={'#dbdcdb'}
                    onChangeText={text => setPhone(text)}/>
                <View style={[css.flexRowCenterStart, styles.inputTitle]}>
                    <Image source={login1} style={{ height: 22, width: 18, marginRight: 10 }} />
                    <Text style={{ fontSize: 15 }}>验证码</Text>
                </View>
                <View style={[styles.codeView, css.flexRowCenterStart]}>
                    <TextInput
                        style={[styles.codeInput]}
                        maxLength={6}
                        placeholder={'请输入手机验证码'}
                        placeholderTextColor={'#dbdcdb'}
                        onChangeText={code => setCode(code)}/>
                    <TouchableOpacity onPress={getCode} style={styles.codeBtn}>
                        <Text style={styles.codeText}>{codeText + (!isNaN(codeText) ? 's' : '')}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={login} style={styles.loginBtn}>
                    <Text style={styles.loginText}>立即登录</Text>
                </TouchableOpacity>
                <Text style={styles.text} numberOfLines={1}>*未注册用户将会自动注册并登录</Text>
                <Text style={styles.text} numberOfLines={1}>*如果未收到验证码，请检查是否被手机拦截。</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    codeBtn: {
        borderColor: '#FE6040',
        borderRadius: 21,
        borderWidth: 2,
        height: 42,
        marginBottom: 5,
        marginLeft: '8%',
        width: '32%'
    },
    codeInput: {
        width: '60%'
    },
    codeText: {
        color: '#FE6040',
        fontSize: 13,
        lineHeight: 40,
        textAlign: 'center'
    },
    codeView: {
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        width: '100%',
    },
    container: {
        flex: 1,
        height: 200,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 60
    },
    inputTitle: {
        marginBottom: 5,
        marginTop: 30
    },
    loginBtn: {
        backgroundColor: '#fe6040',
        borderRadius: 22,
        height: 44,
        marginBottom: 10,
        marginLeft: '5%',
        marginTop: 25,
        width: '90%'
    },
    loginText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '500',
        lineHeight: 44,
        textAlign: 'center'
    },
    phoneInput: {
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        fontSize: 15,
        width: '100%'
    },
    text: {
        color: '#fe6040',
        fontSize: 12,
        lineHeight: 25,
        marginLeft: '5%',
        width: '90%'
    },
    title: {
        fontSize: 24,
        fontWeight: '500'
    }
});
