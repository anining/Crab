import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity, TextInput, Text, Image, Dimensions } from 'react-native';
import { css } from '../../assets/style/css';
import { N } from '../../utils/router';
import login1 from '../../assets/icon/login/login1.png';
import login2 from '../../assets/icon/login/login2.png';
import login3 from '../../assets/icon/login/login3.png';
import login4 from '../../assets/icon/login/login4.png';
import login5 from '../../assets/icon/login/login5.png';
import toast from '../../utils/toast';
import { apiLogin, verifyCode } from '../../utils/api';
import { setter } from '../../utils/store';
import Button from '../../components/Button';
import { initNetInfo } from '../../navigation/AppStackNavigator';
import android from '../../components/Android';
import { getPath } from '../../global/global';
import ImageAuto from '../../components/ImageAuto';
import user14 from '../../assets/icon/user/user14.png';

const { height, width } = Dimensions.get('window');

function LoginPage () {
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [codeText, setCodeText] = useState('获取验证码');
    const [agree, setAgree] = useState(true);
    useEffect(() => {
        _fastLogin();
    }, []);

    async function _fastLogin (showError) {
        try {
            const ret = await android.verifyLogin();
            if (ret && ret.token && ret.opToken && ret.operator) {
                const loginRet = await apiLogin(null, null, null, ret.token, ret.opToken, ret.operator);
                if (loginRet && !loginRet.error) {
                    const { access_token, token_type } = loginRet.data;
                    setter([['authorization', `${token_type} ${access_token}`]], true);
                    await initNetInfo();
                    N.replace('MaterialTopTabNavigator');
                } else {
                    toast('登录失败');
                }
            } else {
                toast('一键登录获取失败');
            }
        } catch (e) {
            console.log(JSON.stringify(e));
            showError && toast('您当前环境不支持');
        }
    }

    async function login (callback) {
        if (!phone || !code) {
            callback();
            toast('请填写完整的账号和密码');
            return;
        }
        const r = await apiLogin(phone, code);
        callback();
        if (r && !r.error) {
            const { access_token, token_type } = r.data;
            setter([['authorization', `${token_type} ${access_token}`]], true);
            await initNetInfo();
            N.replace('MaterialTopTabNavigator');
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
        !r.error && toast('发送成功');
    }

    return (
        <SafeAreaView style={css.safeAreaView}>
            <View style={styles.container}>
                <Text style={styles.title}>账号登录</Text>
                <View style={[css.flexRowCenterStart, styles.inputTitle]}>
                    <Image source={login2} style={{ height: 22, width: 18, marginRight: 10 }}/>
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
                    <Image source={login1} style={{ height: 22, width: 18, marginRight: 10 }}/>
                    <Text style={{ fontSize: 15 }}>验证码</Text>
                </View>
                <View style={[styles.codeView, css.flexRowCenterStart]}>
                    <TextInput
                        style={[styles.codeInput]}
                        maxLength={6}
                        placeholder={'请输入手机验证码'}
                        placeholderTextColor={'#dbdcdb'}
                        onChangeText={code => setCode(code)}/>
                    <TouchableOpacity activeOpacity={1} onPress={getCode} style={styles.codeBtn}>
                        <Text style={styles.codeText}>{codeText + (!isNaN(codeText) ? 's' : '')}</Text>
                    </TouchableOpacity>
                </View>
                <Button name={'立即登录'} onPress={async (callback) => {
                    if (agree) {
                        await login(callback);
                    } else {
                        toast('请先阅读并同意隐私协议与用户协议');
                        callback && callback();
                    }
                }}/>
                <TouchableOpacity activeOpacity={1} style={[css.flex, css.js]} onPress={() => {
                    setAgree(!agree);
                }}>
                    <ImageAuto key={`agree${agree}`} source={agree ? login4 : login3}
                        style={{ width: 18, marginRight: 5 }}/>
                    <Text style={styles.text} numberOfLines={1}><Text style={{ color: '#999999' }}>我已阅读并同意</Text>
                        <Text style={{ paddingVertical: 10, paddingHorizontal: 4 }} onPress={() => {
                            N.navigate('PrivacyPolicyPage');
                        }}>《隐私协议》</Text>
                        <Text style={{ paddingVertical: 10, paddingHorizontal: 4 }} onPress={() => {
                            N.navigate('UserAgreementPage');
                        }}>《用户协议》</Text>
                    </Text>
                </TouchableOpacity>
                <Text style={styles.text} numberOfLines={1}>*未注册用户将会自动注册并登录</Text>
                <Text style={styles.text} numberOfLines={1}>*如果未收到验证码，请检查是否被手机拦截。</Text>
                <View style={[css.flex, styles.fastLogin]}>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        _fastLogin(true);
                    }} style={[css.flex, styles.fastLoginItem, css.fw]}>
                        <ImageAuto key={'login66'} source={login5} style={{ width: 45 }}/>
                        <Text style={styles.fastLoginItemText}>一键登录</Text>
                    </TouchableOpacity>
                </View>
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
        width: '32%',
    },
    codeInput: {
        width: '60%',
    },
    codeText: {
        color: '#FE6040',
        fontSize: 13,
        lineHeight: 40,
        textAlign: 'center',
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
        paddingTop: 100,
    },
    fastLogin: {
        height: 'auto',
        marginTop: 60,
        width: '100%',
    },
    fastLoginItem: {
        // backgroundColor: 'red',
        height: 'auto',
        width: 100,
    },
    fastLoginItemText: {
        color: '#353535',
        fontSize: 13,
        lineHeight: 40,
        textAlign: 'center',
        width: '100%',
    },
    inputTitle: {
        marginBottom: 5,
        marginTop: 30,
    },
    loginBtn: {
        backgroundColor: '#fe6040',
        borderRadius: 22,
        height: 44,
        marginBottom: 10,
        marginLeft: '5%',
        marginTop: 25,
        width: '90%',
    },
    loginText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '500',
        lineHeight: 44,
        textAlign: 'center',
    },
    phoneInput: {
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        fontSize: 15,
        width: '100%',
    },
    text: {
        color: '#fe6040',
        fontSize: 12,
        lineHeight: 30,
        width: '90%',
    },
    title: {
        fontSize: 24,
        fontWeight: '500',
    },
});

export default LoginPage;
