import * as React from 'karet';
import { useState, useEffect } from 'react';
import * as R from 'kefir.ramda';
import { SafeAreaView, Dimensions, ScrollView, Text, Image, TouchableOpacity, StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { css } from '../../assets/style/css';
import { N } from '../../utils/router';
import Header from '../../components/Header';
import Null from '../../components/Null';
import feed1 from '../../assets/icon/feed/feed1.png';
import { deleteAccount, putAccount } from '../../utils/api';
import Clipboard from '@react-native-community/clipboard';
import toast from '../../utils/toast';
import { updateAccount } from '../../utils/update';
import { getter } from '../../utils/store';
import * as U from 'karet.util';

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
const { accounts } = getter(['accounts']);
const length = R.prop('length', accounts);

function AccountHomePage () {
    const headerRight = <Text style={{ color: '#FF6C00' }}>添加绑定</Text>;

    useEffect(() => {
        updateAccount();
    }, []);

    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#F8F8F8' }]}>
            <Header karet-lift scene={{ descriptor: { options: {} }, route: { name: '绑定账号' } }} navigation={N} onPress={() => {
                DeviceEventEmitter.emit('showPop', {
                    dom: <RenderSelect style={styles.selectView}/>,
                    close: () => {},
                });
            }} headerRight={U.ifElse(R.equals(length, 0), undefined, headerRight)}/>
            <RenderView/>
        </SafeAreaView>
    );
}

function RenderSelect () {
    const view = [];

    TYPE.forEach(item => {
        const { id, label } = item;
        view.push(
            <TouchableOpacity activeOpacity={1}  key={id} onPress={() => {
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
            {view}
        </View>
    );
}

function RenderView () {
    const children = (
        <>
            <Text style={{ marginTop: 7, marginBottom: 20 }}>快去绑定账号做任务吧～</Text>
            <TouchableOpacity activeOpacity={1}  onPress={() => { DeviceEventEmitter.emit('showPop', <RenderSelect />); }} style={{ width: 206, height: 44, backgroundColor: '#FF9C00', borderRadius: 22 }}>
                <Text numberOfLines={1} style={{ color: '#fff', lineHeight: 44, textAlign: 'center', fontSize: 17 }}>添加绑定</Text>
            </TouchableOpacity>
        </>
    );

    return <>{U.ifElse(R.equals(length, 0), <Null text='您还未绑定账号' children={children}/>, <ScrollView><RenderBindView/></ScrollView>)}</>;
}

function RenderBindView () {
    function apiDeleteAccount (status, account_id, must) {
        if (status === 3 || must) {
            deleteAccount(account_id).then(r => {
                if (!r.error) {
                    toast('操作成功!');
                    updateAccount();
                }
            });
        } else {
            updateAccount();
        }
    }

    const view = U.mapElemsWithIds('account_id', (bind, id) => {
        const { account_id, reason, status, avatar, nickname, home_url, is_current, success_rate, task_platform } = U.destructure(bind);
        const { label, platform_category } = U.destructure(task_platform);
        const value = U.mapValue(rate => Number.parseInt(rate) * 100, success_rate);
        const status3 = R.equals(status, 3);
        const delClick = U.combine([status, account_id], (...args) => (must) => apiDeleteAccount(...args, must));
        const clipboard = U.mapValue(e => () => {
            Clipboard.setString(e.toString());
            toast('复制成功!');
        }, home_url);
        const ifView = (
            <View style={styles.numberView} key={id}>
                <View style={[css.flexRCSB, styles.item, { borderBottomWidth: 1, borderBottomColor: '#EDEDED' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image karet-lift source={U.template({ uri: avatar })} style={{ height: 54, width: 54, borderRadius: 27, marginRight: 5 }}/>
                        <View>
                            <Text karet-lift numberOfLines={1} style={{ fontSize: 18, color: '#222', fontWeight: '800', marginBottom: 3 }}>{nickname}</Text>
                            <Text karet-lift numberOfLines={1} style={{ fontSize: 10, color: '#353535' }}>账号类型：{label}</Text>
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={1}  onPress={() => {
                        DeviceEventEmitter.emit('showPop', <RenderChange karet-lift label={label} account_id={account_id} platform_category={platform_category}/>);
                    }} style={styles.changeBindBtn}>
                        <Text numberOfLines={1} style={{ color: '#fff', lineHeight: 35, textAlign: 'center', fontSize: 13 }}>切换账号</Text>
                    </TouchableOpacity>
                </View>
                <Text numberOfLines={1} style={ styles.successRateText}>当前账号通过率：<Text karet-lift style={ { color: '#FF6C00', fontWeight: '500' }}>{value}%</Text></Text>
                <Text numberOfLines={3} style={styles.successRateView}>通过率表示您这个账号今日任务通过情况，通过率低代表您的账号可能已经不健康，易导致任务审核不通过，建议绑定其他账号做单.</Text>
            </View>
        );
        const elView = (
            <View style={styles.numberView} key={id}>
                <View style={[css.flexRCSB, styles.item, { borderBottomWidth: 1, borderBottomColor: '#EDEDED', height: 40 }]}>
                    <Text karet-lift numberOfLines={1} style={{ fontWeight: '500', color: U.ifElse(status3, '#FF3B00', '#353535') }}>{label}{U.ifElse(status3, '绑定失败', '绑定中')}</Text>
                    <Text karet-lift numberOfLines={1} style={{ fontSize: 12, color: '#353535' }}>{reason}</Text>
                </View>
                <View style={[css.flexRCSB, styles.item, styles.urlView]}>
                    <Text karet-lift numberOfLines={1} style={styles.urlText}>绑定链接：{home_url}</Text>
                    <TouchableOpacity activeOpacity={1}  karet-lift onPress={clipboard}>
                        <Text numberOfLines={1} style={{ fontSize: 12, color: '#FF6C00' }}>复制链接</Text>
                    </TouchableOpacity>
                </View>
                <View style={[css.flexRCSB, styles.item, styles.btnView]}>
                    <TouchableOpacity activeOpacity={1}  karet-lift onPress={delClick} style={styles.giveUpBtn}>
                        <Text karet-lift numberOfLines={1} style={styles.bindBtnText }>{U.ifElse(status3, '换号重绑', '刷新状态')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1}  karet-lift onPress={delClick} style={styles.delBtn}>
                        <Text numberOfLines={1} style={[styles.bindBtnText, { color: '#FF6C00' }]}>取消绑定</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
        return <>{U.ifElse(R.equals(is_current, true), U.ifElse(R.equals(status, 1), ifView, elView), undefined)}</>;
    }, accounts);
    return <>{view}</>;
}

function RenderChange ({ label, account_id, platform_category }) {
    const [selectId, setSelectId] = useState(account_id);

    function apiPutAccount () {
        putAccount(platform_category, selectId).then(r => {
            if (!r.error) {
                toast('切换账号绑定成功!');
                updateAccount();
            }
        });
    }

    const view = U.mapElems((bind, i) => {
        const { avatar, nickname, account_id: id, task_platform } = U.destructure(bind);
        const { platform_category: local_platform_category } = U.destructure(task_platform);
        const click = U.mapValue(x => () => setSelectId(x), id);
        const select = (
            <View style={styles.selectBtnTrue} >
                <Image source={feed1} style={{ height: 7, width: 9 }}/>
            </View>
        );
        const component = (
            <TouchableOpacity activeOpacity={1}  karet-lift style={styles.changeBtn} onPress={click} key={i}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image karet-lift source={U.template({ uri: avatar })} style={{ height: 32, width: 32, borderRadius: 16, marginRight: 5 }} />
                    <Text karet-lift >{nickname}</Text>
                </View>
                <>{U.ifElse(R.equals(id, selectId), select, <View style={styles.selectBtn} />)}</>
            </TouchableOpacity>
        );
        return <>{U.ifElse(R.equals(local_platform_category, platform_category), component, undefined)}</>;
    }, accounts);

    return (
        <View style={styles.changeView}>
            <Text style={{ color: '#FF3B00', fontSize: 17, lineHeight: 50, textAlign: 'center', fontWeight: '600' }}>切换做单账号</Text>
            <View style={{ height: 200, width: '100%', marginBottom: 20 }}>
                <ScrollView>
                    <>{view}</>
                </ScrollView>
            </View>
            <TouchableOpacity activeOpacity={1}  style={styles.addBtn} onPress={() => {
                DeviceEventEmitter.emit('hidePop');
                N.navigate('AccountBindPage', { id: platform_category, label });
            }}>
                <Text style={styles.addBindBtn}>+</Text>
                <Text style={{ color: '#FF3B00', fontSize: 15 }}>添加新账号</Text>
            </TouchableOpacity>
            <View style={[css.flexRCSB, { paddingLeft: 5, paddingRight: 5, paddingTop: 20, paddingBottom: 20 }]}>
                <TouchableOpacity activeOpacity={1}  onPress={() => {
                    DeviceEventEmitter.emit('hidePop');
                }} style={styles.changeLBtn}>
                    <Text style={{ lineHeight: 33, textAlign: 'center', color: '#FF3B00', fontSize: 15 }}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1}  onPress={() => {
                    apiPutAccount();
                    DeviceEventEmitter.emit('hidePop');
                }} style={styles.changeRBtn}>
                    <Text style={{ lineHeight: 33, textAlign: 'center', color: '#fff' }}>切换账号</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
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
    delBtn: {
        backgroundColor: '#fff',
        borderColor: '#FF6C00',
        borderRadius: 19,
        borderWidth: 1,
        height: 37,
        width: 150
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

export default AccountHomePage;
