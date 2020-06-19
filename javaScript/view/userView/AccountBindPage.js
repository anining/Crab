import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, SafeAreaView, Text, View, TextInput } from 'react-native';
import { css } from '../../assets/style/css';
import Header from '../../components/Header';
import { N } from '../../utils/router';
import bind1 from '../../assets/icon/bind/bind1.png';

export default function AccountBindPage (props) {
    const [url, setUrl] = useState('');
    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#F8F8F8' }]}>
            <Header scene={{ descriptor: { options: {} }, route: { name: props.route.params.type } }} navigation={N}/>
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={styles.container}>
                    <View style={styles.claim}>
                        <Text style={{ lineHeight: 50, paddingLeft: 15, paddingRight: 15, fontSize: 14, fontWeight: '500', color: '#353535', borderBottomColor: '#EDEDED', borderBottomWidth: 1 }}>绑定要求：</Text>
                        <View style={{
                            height: 50,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 15,
                            paddingRight: 15
                        }}>
                            <Image source={bind1} style={{ height: 17, width: 17, marginRight: 5 }} />
                            <Text style={{ color: '#999', fontSize: 14 }}>最低要求：<Text style={{ color: '#353535' }}>作品数<Text style={{ color: '#FF6C00' }}> 3 </Text>个</Text></Text>
                        </View>
                    </View>
                    <View style={styles.claim}>
                        <Text style={{ lineHeight: 50, paddingLeft: 15, paddingRight: 15, fontSize: 14, fontWeight: '500', color: '#353535' }}>主页链接：</Text>
                        <TextInput
                            style={{
                                paddingLeft: 15,
                                paddingRight: 15,
                                height: 44,
                                marginTop: 3,
                                marginBottom: 25,
                                marginLeft: 15,
                                marginRight: 15,
                                backgroundColor: '#EEE',
                                borderRadius: 4
                            }}
                            maxLength={11}
                            placeholder={'请在此处粘贴您的主页链接'}
                            placeholderTextColor={'#999'}
                            onChangeText={url => setUrl(url)}/>
                    </View>
                    <TouchableOpacity activeOpacity={1} onPress={() => {

                    }}>
                        <Text style={{ textAlign: 'right', paddingLeft: 15, paddingRight: 15, fontSize: 14, fontWeight: '500', color: '#FF6C00' }}>{'绑定教程 >'}</Text>
                    </TouchableOpacity>
                    <View style={[styles.claim, { marginTop: 15, padding: 15 }]}>
                        <Text style={styles.title}>绑定说明：</Text>
                        <Text style={styles.text}>1、绑定时提示系统繁忙，请间隔几十秒后进行重试。</Text>
                        <Text style={styles.text}>2.账号保证有昵称、有头像、个人资料完善。</Text>
                        <Text style={styles.text}>3.请确认自己的账号已经达到最低绑定要求。分享账号给其他用户，确保自己的作品、粉丝等信息是所有人可见的状态。</Text>
                    </View>
                </View>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    N.navigate('AccountBindPage');
                }} style={styles.bindBtn}>
                    <Text style={styles.bindBtnText}>绑定账号</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    bindBtn: {
        backgroundColor: '#FF3E00',
        height: 44,
        width: '100%'
    },
    bindBtnText: {
        color: '#fff',
        fontSize: 17,
        lineHeight: 44,
        textAlign: 'center'
    },
    claim: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 15,
        width: '100%'
    },
    container: {
        padding: 15,
        width: '100%'
    },
    text: {
        color: '#4D4D4D',
        fontSize: 12,
        lineHeight: 23
    },
    title: {
        color: '#353535',
        fontSize: 14,
        fontWeight: '500',
        paddingBottom: 10
    },
});
