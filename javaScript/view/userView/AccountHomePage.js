import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    View,
    DeviceEventEmitter,
} from 'react-native';
import { css } from '../../assets/style/css';
import { N } from '../../utils/router';
import Header from '../../components/Header';
import card1 from '../../assets/icon/card/card1.png';
import Null from '../../components/Null';
import feed1 from '../../assets/icon/feed/feed1.png';

const NUMBERS = [
    {
        avatar: 'https://dss0.bdstatic.com/6Ox1bjeh1BF3odCf/it/u=489293176,3448257280&fm=85&app=92&f=JPEG?w=121&h=75&s=CDC1AC440C06077412C18D980300C08B',
        nickName: '三分秋色',
        type: '音符账号',
        id: 1,
        detail: '通过率表示您这个账号今日任务通过情况，通过率低代表您的账号可能已经不健康，易导致任务审核不通过，建议绑定其他账号做单.',
        Probability: '20%'
    },
    {
        avatar: 'https://dss0.bdstatic.com/6Ox1bjeh1BF3odCf/it/u=489293176,3448257280&fm=85&app=92&f=JPEG?w=121&h=75&s=CDC1AC440C06077412C18D980300C08B',
        nickName: '三分秋色',
        type: '快手账号',
        id: 2,
        detail: '通过率表示您这个账号今日任务通过情况，通过率低代表您的账号可能已经不健康，易导致任务审核不通过，建议绑定其他账号做单.',
        Probability: '20%'
    },
    {
        avatar: 'https://dss0.bdstatic.com/6Ox1bjeh1BF3odCf/it/u=489293176,3448257280&fm=85&app=92&f=JPEG?w=121&h=75&s=CDC1AC440C06077412C18D980300C08B',
        nickName: '三分秋色',
        type: '音符账号',
        id: 3,
        detail: '通过率表示您这个账号今日任务通过情况，通过率低代表您的账号可能已经不健康，易导致任务审核不通过，建议绑定其他账号做单.',
        Probability: '20%'
    }
];
const BINDS = [
    {
        status: 1,
        reason: '失败原因：未达到最低绑定要求',
        avatar: 'https://dss0.bdstatic.com/6Ox1bjeh1BF3odCf/it/u=489293176,3448257280&fm=85&app=92&f=JPEG?w=121&h=75&s=CDC1AC440C06077412C18D980300C08B',
        nickName: '三分秋色',
        type: '音符账号',
        id: 1,
        detail: '通过率表示您这个账号今日任务通过情况，通过率低代表您的账号可能已经不健康，易导致任务审核不通过，建议绑定其他账号做单.',
        Probability: '20%'
    },
    {
        status: 2,
        reason: '预计等待时间：1小时',
        avatar: 'https://dss0.bdstatic.com/6Ox1bjeh1BF3odCf/it/u=489293176,3448257280&fm=85&app=92&f=JPEG?w=121&h=75&s=CDC1AC440C06077412C18D980300C08B',
        nickName: '三分秋色',
        type: '音符账号',
        id: 1,
        detail: '通过率表示您这个账号今日任务通过情况，通过率低代表您的账号可能已经不健康，易导致任务审核不通过，建议绑定其他账号做单.',
        Probability: '20%'
    }
];
export default function AccountHomePage () {
    const [numbers, setNumber] = useState(NUMBERS);
    const [binds, setBinds] = useState(BINDS);
    const headerRight = <Text style={{ color: '#FF6C00', fontSize: 14 }}>添加绑定</Text>;

    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#F8F8F8' }]}>
            <Header scene={{ descriptor: { options: {} }, route: { name: '绑定账号' } }} navigation={N} onPress={() => {
                DeviceEventEmitter.emit('showPop', <RenderSelect />);
            }} headerRight={(numbers.length || binds.length) && headerRight}/>
            <RenderView numbers={numbers} binds={binds}/>
        </SafeAreaView>
    );
}

function RenderSelect () {
    const components = [];
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
            id: 4,
            label: '绑定头条账号'
        },
    ];
    TYPE.forEach(item => {
        components.push(
            <TouchableOpacity activeOpacity={1} key={item.id} onPress={() => {
                DeviceEventEmitter.emit('hidePop');
                N.navigate('AccountBindPage', { type: item.label });
            }} style={[styles.selectViewBtn, css.flexRCSB]}>
                <Text>{item.label}</Text>
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

function RenderChange ({ id, type }) {
    const [selectId, setSelectId] = useState();
    const components = [];
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
            id: 4,
            label: '绑定头条账号'
        },
    ];
    TYPE.forEach(item => {
        components.push(
            <TouchableOpacity activeOpacity={1} style={ {
                height: 50,
                width: '100%',
                marginBottom: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 15,
                paddingRight: 15
            }} onPress={() => {
                setSelectId(item.id);
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={card1} style={{ height: 32, width: 32, borderRadius: 16, marginRight: 5 }} />
                    <Text>音符任务专号</Text>
                </View>
                <RenderSelectView select={item.id === selectId}/>
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
            <TouchableOpacity activeOpacity={1} style={styles.addBtn} onPress={() => {
                DeviceEventEmitter.emit('hidePop');
                N.navigate('AccountBindPage', { type: '绑定头条账号' });
            }}>
                <Text style={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#FF3B00',
                    lineHeight: 21,
                    fontSize: 20,
                    textAlign: 'center',
                    color: '#FF3B00',
                    marginRight: 5
                }}>+</Text>
                <Text style={{ color: '#FF3B00', fontSize: 15 }}>添加新账号</Text>
            </TouchableOpacity>
            <View style={[css.flexRCSB, { paddingLeft: 5, paddingRight: 5, paddingTop: 20, paddingBottom: 20 }]}>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    DeviceEventEmitter.emit('hidePop');
                }} style={styles.changeLBtn}>
                    <Text style={{ lineHeight: 33, textAlign: 'center', color: '#FF3B00', fontSize: 15 }}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    DeviceEventEmitter.emit('hidePop');
                }} style={styles.changeRBtn}>
                    <Text style={{ lineHeight: 33, textAlign: 'center', color: '#fff' }}>切换账号</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function RenderView ({ numbers = [], binds = [] }) {
    if (!numbers.length && !binds.length) {
        const children = (
            <>
                <Text style={{ marginTop: 7, marginBottom: 20 }}>快去绑定账号做任务吧～</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => {
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
            <RenderNumberView numbers={numbers}/>
            <RenderBindView binds={binds}/>
        </ScrollView>
    );
}

function RenderNumberView ({ numbers = [] }) {
    const components = [];
    numbers.forEach(number => {
        components.push(
            <View style={styles.numberView} key={number.id}>
                <View style={[css.flexRCSB, styles.item, { borderBottomWidth: 1, borderBottomColor: '#EDEDED' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={{ uri: number.avatar }}
                            style={{ height: 54, width: 54, borderRadius: 27, marginRight: 5 }}/>
                        <View>
                            <Text numberOfLines={1} style={{ fontSize: 18, color: '#222', fontWeight: '800', marginBottom: 3 }}>{number.nickName}</Text>
                            <Text numberOfLines={1} style={{ fontSize: 10, color: '#353535' }}>账号类型：{number.type}</Text>
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        DeviceEventEmitter.emit('showPop', <RenderChange id={number.id} type={number.type}/>);
                    }} style={styles.changeBindBtn}>
                        <Text numberOfLines={1} style={{ color: '#fff', lineHeight: 35, textAlign: 'center', fontSize: 13 }}>切换账号(5)</Text>
                    </TouchableOpacity>
                </View>
                <Text numberOfLines={1} style={ { paddingLeft: 15, paddingRight: 15, lineHeight: 50, textAlign: 'center', color: '#353535', fontSize: 14 }}>当前账号通过率：<Text style={ { color: '#FF6C00', fontWeight: '500' }}>20%</Text></Text>
                <Text numberOfLines={3} style={ { paddingLeft: 15, paddingRight: 15, lineHeight: 16, color: '#999', fontSize: 11 }}>{number.detail}</Text>
            </View>
        );
    });
    return <>{components}</>;
}

function RenderBindView ({ binds = [] }) {
    const components = [];
    binds.forEach(bind => {
        components.push(
            <View style={styles.numberView} key={bind.id}>
                <View style={[css.flexRCSB, styles.item, { borderBottomWidth: 1, borderBottomColor: '#EDEDED', height: 40 }]}>
                    <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '500', color: bind.status === 1 ? '#FF3B00' : '#353535' }}>{bind.type}{bind.status === 1 ? '绑定失败' : '绑定中'}</Text>
                    <Text numberOfLines={1} style={{ fontSize: 12, color: '#353535' }}>{bind.reason}</Text>
                </View>
                <View style={[css.flexRCSB, styles.item, styles.urlView]}>
                    <Text numberOfLines={1} style={styles.urlText}>绑定链接：https://www.baidu.com/s/</Text>
                    <TouchableOpacity activeOpacity={1} onPress={() => {

                    }}>
                        <Text numberOfLines={1} style={{ fontSize: 12, color: '#FF6C00' }}>复制链接</Text>
                    </TouchableOpacity>
                </View>
                <View style={[css.flexRCSB, styles.item, styles.btnView]}>
                    <TouchableOpacity activeOpacity={1} onPress={() => {

                    }} style={styles.giveUpBtn}>
                        <Text numberOfLines={1} style={styles.bindBtnText }>{bind.status === 1 ? '换号重绑' : '刷新状态'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => {

                    }} style={[styles.giveUpBtn, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#FF6C00' }]}>
                        <Text numberOfLines={1} style={[styles.bindBtnText, { color: '#FF6C00' }]}>取消绑定</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    });
    return <>{components}</>;
}

const styles = StyleSheet.create({
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
        width: '100%'
    },
    selectViewBtn: {
        borderBottomColor: '#E6E8ED',
        borderBottomWidth: 1,
        height: 50,
    },
    urlText: {
        color: '#666',
        fontSize: 13,
        fontWeight: '500',
        maxWidth: 250
    },
    urlView: {
        backgroundColor: '#EEEEEE',
        borderRadius: 4,
        height: 37,
        marginBottom: 15,
        marginLeft: '5%',
        marginTop: 15,
        width: '90%'
    },
});
