import React, { useState, useEffect } from 'react';
import { SafeAreaView, Dimensions, ScrollView, Text, Image, TouchableOpacity, StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { css } from '../../assets/style/css';
import { N } from '../../utils/router';
import Header from '../../components/Header';
import Null from '../../components/Null';
import feed1 from '../../assets/icon/feed/feed1.png';
import { account, deleteAccount, putAccount } from '../../utils/api';
import Clipboard from '@react-native-community/clipboard';
import toast from '../../utils/toast';

const TYPE = [
    {
        id: 1,
        label: '绑定音符账号'
    },
    {
        id: 2,
        label: '绑定快摄账号'
    },
    {
        id: 3,
        label: '绑定红酥账号'
    },
    {
        id: 5,
        label: '绑定头条账号'
    }
];
const { width } = Dimensions.get('window');
export default function AccountHomePage () {
    const [binds, setBinds] = useState([]);
    useEffect(() => {
        updateBinds();
    }, []);
    const headerRight = <Text style={{ color: '#FF6C00', fontSize: 14 }}>添加绑定</Text>;

    function updateBinds () {
        account().then(r => {
            console.log(r);
            !r.error && setBinds(r.data);
        });
    }

    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#F8F8F8' }]}>
            <Header scene={{ descriptor: { options: {} }, route: { name: '绑定账号' } }} navigation={N} onPress={() => {
                DeviceEventEmitter.emit('showPop', <RenderSelect style={styles.selectView}/>);
            }} headerRight={binds.length && headerRight}/>
            <RenderView binds={binds} updateBinds={updateBinds}/>
        </SafeAreaView>
    );
}

function RenderSelect () {
    const components = [];
    TYPE.forEach(item => {
        const { id, label } = item;
        components.push(
            <TouchableOpacity key={id} onPress={() => {
                DeviceEventEmitter.emit('hidePop');
                N.navigate('AccountBindPage', { id, label });
            }} style={[styles.selectViewBtn, css.flexRCSB]}>
                <Text>{label}</Text>
                <Text>{'>'}</Text>
            </TouchableOpacity>
        );
    });
    return (
        <View style={styles.selectView}>
            {components}
        </View>
    );
}

function RenderSelectView ({ select }) {
    if (select) {
        return (
            <View style={styles.selectBtnTrue} >
                <Image source={feed1} style={{ height: 7, width: 9 }}/>
            </View>
        );
    }
    return <View style={styles.selectBtn} />;
}

function RenderChange ({ binds = [], label, updateBinds, account_id, platform_category }) {
    const [selectId, setSelectId] = useState(account_id);
    const components = [];

    function apiPutAccount () {
        putAccount(platform_category, selectId).then(r => {
            if (!r.error) {
                console.log(r);
                toast('操作成功');
                updateBinds();
            } else {
                toast(r.msg || '操作失败');
            }
        });
    }

    binds.forEach(bind => {
        const { account_id: id, reason, status, avatar, nickname, success_rate, task_platform } = bind;
        const { label: local_label, platform_category: local_platform_category } = task_platform;
        if (local_platform_category !== platform_category) {
            return;
        }
        components.push(
            <TouchableOpacity style={styles.changeBtn} onPress={() => {
                setSelectId(id);
            }} key={id}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: avatar }} style={{ height: 32, width: 32, borderRadius: 16, marginRight: 5 }} />
                    <Text>{nickname}</Text>
                </View>
                <RenderSelectView select={id === selectId}/>
            </TouchableOpacity>
        );
    });
    return (
        <View style={styles.changeView}>
            <Text style={{ color: '#FF3B00', fontSize: 17, lineHeight: 50, textAlign: 'center', fontWeight: '600' }}>切换做单账号</Text>
            <View style={{
                height: 200,
                width: '100%',
                marginBottom: 20
            }}>
                <ScrollView>
                    {components}
                </ScrollView>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={() => {
                DeviceEventEmitter.emit('hidePop');
                N.navigate('AccountBindPage', { id: platform_category, label });
            }}>
                <Text style={styles.addBindBtn}>+</Text>
                <Text style={{ color: '#FF3B00', fontSize: 15 }}>添加新账号</Text>
            </TouchableOpacity>
            <View style={[css.flexRCSB, { paddingLeft: 5, paddingRight: 5, paddingTop: 20, paddingBottom: 20 }]}>
                <TouchableOpacity onPress={() => {
                    DeviceEventEmitter.emit('hidePop');
                }} style={styles.changeLBtn}>
                    <Text style={{ lineHeight: 33, textAlign: 'center', color: '#FF3B00', fontSize: 15 }}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    apiPutAccount();
                    DeviceEventEmitter.emit('hidePop');
                }} style={styles.changeRBtn}>
                    <Text style={{ lineHeight: 33, textAlign: 'center', color: '#fff' }}>切换账号</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function RenderView ({ binds = [], updateBinds }) {
    if (!binds.length) {
        const children = (
            <>
                <Text style={{ marginTop: 7, marginBottom: 20 }}>快去绑定账号做任务吧～</Text>
                <TouchableOpacity onPress={() => {
                    DeviceEventEmitter.emit('showPop', <RenderSelect />);
                }} style={{ width: 206, height: 44, backgroundColor: '#FF9C00', borderRadius: 22 }}>
                    <Text numberOfLines={1} style={{ color: '#fff', lineHeight: 44, textAlign: 'center', fontSize: 17 }}>添加绑定</Text>
                </TouchableOpacity>
            </>
        );
        return (
            <>
                <Null text='您还未绑定账号' children={children}/>
            </>
        );
    }
    return (
        <ScrollView>
            <RenderBindView updateBinds={updateBinds} binds={binds}/>
        </ScrollView>
    );
}

function RenderBindView ({ binds = [], updateBinds }) {
    const components = [];

    function apiDeleteAccount (account_id) {
        deleteAccount(account_id).then(r => {
            if (!r.error) {
                toast('操作成功');
                updateBinds();
            } else {
                toast(r.msg || '操作失败');
            }
        });
    }

    binds.forEach(bind => {
        const { account_id, reason, status, avatar, nickname, home_url, success_rate, task_platform } = bind;
        const { label, platform_category } = task_platform;
        if (status === 1) {
            components.push(
                <View style={styles.numberView} key={account_id}>
                    <View style={[css.flexRCSB, styles.item, { borderBottomWidth: 1, borderBottomColor: '#EDEDED' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={{ uri: avatar }} style={{ height: 54, width: 54, borderRadius: 27, marginRight: 5 }}/>
                            <View>
                                <Text numberOfLines={1} style={{ fontSize: 18, color: '#222', fontWeight: '800', marginBottom: 3 }}>{nickname}</Text>
                                <Text numberOfLines={1} style={{ fontSize: 10, color: '#353535' }}>账号类型：{label}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => {
                            DeviceEventEmitter.emit('showPop', <RenderChange updateBinds={updateBinds} binds={binds} label={label} account_id={account_id} platform_category={platform_category}/>);
                        }} style={styles.changeBindBtn}>
                            <Text numberOfLines={1} style={{ color: '#fff', lineHeight: 35, textAlign: 'center', fontSize: 13 }}>切换账号</Text>
                        </TouchableOpacity>
                    </View>
                    <Text numberOfLines={1} style={ styles.successRateText}>当前账号通过率：<Text style={ { color: '#FF6C00', fontWeight: '500' }}>{Number.parseInt(success_rate * 100)}%</Text></Text>
                    <Text numberOfLines={3} style={styles.successRateView}>通过率表示您这个账号今日任务通过情况，通过率低代表您的账号可能已经不健康，易导致任务审核不通过，建议绑定其他账号做单.</Text>
                </View>
            );
        } else {
            components.push(
                <View style={styles.numberView} key={account_id}>
                    <View style={[css.flexRCSB, styles.item, { borderBottomWidth: 1, borderBottomColor: '#EDEDED', height: 40 }]}>
                        <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '500', color: status === 3 ? '#FF3B00' : '#353535' }}>{label}{status === 3 ? '绑定失败' : '绑定中'}</Text>
                        <Text numberOfLines={1} style={{ fontSize: 12, color: '#353535' }}>{reason}</Text>
                    </View>
                    <View style={[css.flexRCSB, styles.item, styles.urlView]}>
                        <Text numberOfLines={1} style={styles.urlText}>绑定链接：{home_url}</Text>
                        <TouchableOpacity onPress={() => {
                            Clipboard.setString(home_url.toString());
                            toast('复制成功');
                        }}>
                            <Text numberOfLines={1} style={{ fontSize: 12, color: '#FF6C00' }}>复制链接</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[css.flexRCSB, styles.item, styles.btnView]}>
                        <TouchableOpacity onPress={() => {
                            if (status === 3) {
                                apiDeleteAccount(account_id);
                            } else {
                                updateBinds();
                            }
                        }} style={styles.giveUpBtn}>
                            <Text numberOfLines={1} style={styles.bindBtnText }>{status === 3 ? '换号重绑' : '刷新状态'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            apiDeleteAccount(account_id);
                        }} style={[styles.giveUpBtn, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#FF6C00' }]}>
                            <Text numberOfLines={1} style={[styles.bindBtnText, { color: '#FF6C00' }]}>取消绑定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    });
    return <>{components}</>;
}

const styles = StyleSheet.create({
    addBindBtn: {
        borderColor: '#FF3B00',
        borderRadius: 10,
        borderWidth: 1,
        color: '#FF3B00',
        fontSize: 20,
        height: 20,
        lineHeight: 21,
        marginRight: 5,
        textAlign: 'center',
        width: 20
    },
    addBtn: {
        alignItems: 'center',
        backgroundColor: '#F4F4F4',
        borderRadius: 6,
        flexDirection: 'row',
        height: 45,
        justifyContent: 'center',
        width: '100%'
    },
    bindBtnText: {
        color: '#fff',
        fontSize: 13,
        lineHeight: 37,
        textAlign: 'center',
    },
    btnView: {
        height: 70
    },
    changeBindBtn: {
        backgroundColor: '#FF9C00',
        borderRadius: 18,
        height: 35,
        width: 105
    },
    changeBtn: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        width: '100%'
    },
    changeLBtn: {
        borderColor: '#FF3B00',
        borderRadius: 22,
        borderWidth: 1,
        height: 33,
        width: 112
    },
    changeRBtn: {
        backgroundColor: '#FF3E00',
        borderRadius: 22,
        height: 33,
        width: 112
    },
    changeView: {
        backgroundColor: '#fff',
        borderRadius: 4,
        minHeight: 100,
        paddingLeft: 15,
        paddingRight: 15,
        width: '90%'
    },
    giveUpBtn: {
        backgroundColor: '#FF3E00',
        borderRadius: 19,
        height: 37,
        width: 150
    },
    item: {
        height: 80,
        paddingLeft: 15,
        paddingRight: 15,
        width: '100%'
    },
    numberView: {
        backgroundColor: '#fff',
        marginTop: 10,
        paddingBottom: 15,
        width: '100%'
    },
    selectBtn: {
        borderColor: '#999',
        borderRadius: 10,
        borderWidth: 1,
        height: 20,
        marginLeft: 7,
        width: 20
    },
    selectBtnTrue: {
        alignItems: 'center',
        backgroundColor: '#FF3B00',
        borderRadius: 10,
        height: 20,
        justifyContent: 'center',
        marginLeft: 7,
        width: 20
    },
    selectView: {
        backgroundColor: '#fff',
        bottom: 0,
        paddingLeft: 15,
        paddingRight: 15,
        position: 'absolute',
        width,
    },
    selectViewBtn: {
        borderBottomColor: '#E6E8ED',
        borderBottomWidth: 1,
        height: 50,
    },
    successRateText: {
        color: '#353535',
        fontSize: 14,
        lineHeight: 50,
        paddingLeft: 15,
        paddingRight: 15,
        textAlign: 'center'
    },
    successRateView: {
        color: '#999',
        fontSize: 11,
        lineHeight: 16,
        paddingLeft: 15,
        paddingRight: 15
    },
    urlText: {
        color: '#666',
        fontSize: 13,
        fontWeight: '500',
        maxWidth: 250
    },
    urlView: {
        backgroundColor: '#eee',
        borderRadius: 4,
        height: 37,
        marginBottom: 15,
        marginLeft: '5%',
        marginTop: 15,
        width: '90%'
    }
});
