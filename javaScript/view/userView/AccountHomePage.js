import React, { useState, useEffect } from 'react';
import { SafeAreaView, Dimensions, ScrollView, Text, Image, TouchableOpacity, StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { css } from '../../assets/style/css';
import { N } from '../../utils/router';
import Header from '../../components/Header';
import card1 from '../../assets/icon/card/card1.png';
import Null from '../../components/Null';
import feed1 from '../../assets/icon/feed/feed1.png';
import { account } from '../../utils/api';
import Clipboard from '@react-native-community/clipboard';
import toast from '../../utils/toast';

const { width } = Dimensions.get('window');
export default function AccountHomePage () {
    const [binds, setBinds] = useState([]);
    useEffect(() => {
        account().then(r => {
            !r.error && setBinds(r.data);
        });
    }, []);
    const headerRight = <Text style={{ color: '#FF6C00', fontSize: 14 }}>添加绑定</Text>;

    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#F8F8F8' }]}>
            <Header scene={{ descriptor: { options: {} }, route: { name: '绑定账号' } }} navigation={N} onPress={() => {
                DeviceEventEmitter.emit('showPop', <RenderSelect style={styles.selectView}/>);
            }} headerRight={binds.length && headerRight}/>
            <RenderView binds={binds}/>
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
            id: 5,
            label: '绑定头条账号'
        }
    ];
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

// function RenderSelectView ({ select }) {
//     if (select) {
//         return (
//             <View style={styles.selectBtnTrue} >
//                 <Image source={feed1} style={{ height: 7, width: 9 }}/>
//             </View>
//         );
//     }
//     return <View style={styles.selectBtn} />;
// }
//
// function RenderChange ({ id, type }) {
//     const [selectId, setSelectId] = useState();
//     const components = [];
//     const TYPE = [
//         {
//             id: 1,
//             label: '绑定音符账号'
//         },
//         {
//             id: 2,
//             label: '绑定快摄账号'
//         },
//         {
//             id: 3,
//             label: '绑定红酥账号'
//         },
//         {
//             id: 4,
//             label: '绑定头条账号'
//         },
//     ];
//     TYPE.forEach(item => {
//         components.push(
//             <TouchableOpacity activeOpacity={1} style={ {
//                 height: 50,
//                 width: '100%',
//                 marginBottom: 10,
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 paddingLeft: 15,
//                 paddingRight: 15
//             }} onPress={() => {
//                 setSelectId(item.id);
//             }}>
//                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                     <Image source={card1} style={{ height: 32, width: 32, borderRadius: 16, marginRight: 5 }} />
//                     <Text>音符任务专号</Text>
//                 </View>
//                 <RenderSelectView select={item.id === selectId}/>
//             </TouchableOpacity>
//         );
//     });
//     return (
//         <View style={styles.changeView}>
//             <Text style={{ color: '#FF3B00', fontSize: 17, lineHeight: 50, textAlign: 'center', fontWeight: '600' }}>切换做单账号</Text>
//             <View style={{
//                 height: 200,
//                 width: '100%',
//                 marginBottom: 20
//             }}>
//                 <ScrollView>
//                     {components}
//                 </ScrollView>
//             </View>
//             <TouchableOpacity activeOpacity={1} style={styles.addBtn} onPress={() => {
//                 DeviceEventEmitter.emit('hidePop');
//                 N.navigate('AccountBindPage', { type: '绑定头条账号' });
//             }}>
//                 <Text style={{
//                     height: 20,
//                     width: 20,
//                     borderRadius: 10,
//                     borderWidth: 1,
//                     borderColor: '#FF3B00',
//                     lineHeight: 21,
//                     fontSize: 20,
//                     textAlign: 'center',
//                     color: '#FF3B00',
//                     marginRight: 5
//                 }}>+</Text>
//                 <Text style={{ color: '#FF3B00', fontSize: 15 }}>添加新账号</Text>
//             </TouchableOpacity>
//             <View style={[css.flexRCSB, { paddingLeft: 5, paddingRight: 5, paddingTop: 20, paddingBottom: 20 }]}>
//                 <TouchableOpacity activeOpacity={1} onPress={() => {
//                     DeviceEventEmitter.emit('hidePop');
//                 }} style={styles.changeLBtn}>
//                     <Text style={{ lineHeight: 33, textAlign: 'center', color: '#FF3B00', fontSize: 15 }}>取消</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity activeOpacity={1} onPress={() => {
//                     DeviceEventEmitter.emit('hidePop');
//                 }} style={styles.changeRBtn}>
//                     <Text style={{ lineHeight: 33, textAlign: 'center', color: '#fff' }}>切换账号</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// }

function RenderView ({ binds = [] }) {
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
            <RenderBindView binds={binds}/>
        </ScrollView>
    );
}

function RenderBindView ({ binds = [] }) {
    const components = [];
    binds.forEach(bind => {
        console.log(bind);
        const { account_id, status, avatar, nickname, success_rate } = bind;
        if (status === 1) {
            components.push(
                <View style={styles.numberView} key={account_id}>
                    <View style={[css.flexRCSB, styles.item, { borderBottomWidth: 1, borderBottomColor: '#EDEDED' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={{ uri: avatar }} style={{ height: 54, width: 54, borderRadius: 27, marginRight: 5 }}/>
                            <View>
                                <Text numberOfLines={1} style={{ fontSize: 18, color: '#222', fontWeight: '800', marginBottom: 3 }}>{nickname}</Text>
                                {/*            <Text numberOfLines={1} style={{ fontSize: 10, color: '#353535' }}>账号类型：{number.type}</Text> */}
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => {
                            // DeviceEventEmitter.emit('showPop', <RenderChange id={number.id} type={number.type}/>);
                        }} style={styles.changeBindBtn}>
                            <Text numberOfLines={1} style={{ color: '#fff', lineHeight: 35, textAlign: 'center', fontSize: 13 }}>切换账号(5)</Text>
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
                        {/*    <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '500', color: bind.status === 1 ? '#FF3B00' : '#353535' }}>{bind.type}{bind.status === 1 ? '绑定失败' : '绑定中'}</Text> */}
                        {/*    <Text numberOfLines={1} style={{ fontSize: 12, color: '#353535' }}>{bind.reason}</Text> */}
                    </View>
                    <View style={[css.flexRCSB, styles.item, styles.urlView]}>
                        {/*    <Text numberOfLines={1} style={styles.urlText}>绑定链接：https://www.baidu.com/s/</Text> */}
                        {/*    <TouchableOpacity activeOpacity={1} onPress={() => { */}
                        {/* Clipboard.setString(invite_code.get()); */}
                        {/* toast('复制成功'); */}
                        {/*    }}> */}
                        {/*        <Text numberOfLines={1} style={{ fontSize: 12, color: '#FF6C00' }}>复制链接</Text> */}
                        {/*    </TouchableOpacity> */}
                    </View>
                    <View style={[css.flexRCSB, styles.item, styles.btnView]}>
                        {/*    <TouchableOpacity activeOpacity={1} onPress={() => { */}

                        {/*    }} style={styles.giveUpBtn}> */}
                        {/*        <Text numberOfLines={1} style={styles.bindBtnText }>{bind.status === 1 ? '换号重绑' : '刷新状态'}</Text> */}
                        {/*    </TouchableOpacity> */}
                        {/*    <TouchableOpacity activeOpacity={1} onPress={() => { */}

                        {/*    }} style={[styles.giveUpBtn, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#FF6C00' }]}> */}
                        {/*        <Text numberOfLines={1} style={[styles.bindBtnText, { color: '#FF6C00' }]}>取消绑定</Text> */}
                        {/*    </TouchableOpacity> */}
                    </View>
                </View>
            );
        }
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
