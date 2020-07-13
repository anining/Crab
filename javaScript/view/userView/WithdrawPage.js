import * as React from 'karet';
import { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    Image,
    StyleSheet,
    Text,
    View,
    Dimensions,
    DeviceEventEmitter,
    InteractionManager,
} from 'react-native';
import { css } from '../../assets/style/css';
import { N } from '../../utils/router';
import with1 from '../../assets/icon/withdraw/withdraw1.png';
import with2 from '../../assets/icon/withdraw/withdraw2.png';
import with3 from '../../assets/icon/withdraw/withdraw3.png';
import with4 from '../../assets/icon/withdraw/withdraw4.png';
import with5 from '../../assets/icon/withdraw/withdraw5.png';
import with10 from '../../assets/icon/withdraw/withdraw10.png';
import Header from '../../components/Header';
import { getter } from '../../utils/store';
import { postWithdraw, withdraw } from '../../utils/api';
import toast from '../../utils/toast';
import Choice from '../../components/Choice';
import { BALANCE_RATE } from '../../utils/data';
import { _debounce, transformMoney } from '../../utils/util';
import Button from '../../components/Button';
import {updateSecondIncome, updateUser} from '../../utils/update';

const { width } = Dimensions.get('window');
const { today_income, total_income, openid, balance } = getter(['user.today_income', 'user.openid', 'user.total_income', 'user.balance']);

function WithdrawPage (props) {
    const [goodId, setGoodId] = useState();
    const [money, setMoney] = useState();
    const [goods, setGoods] = useState([]);
    const [payType, setPayType] = useState('wx');
    const headerRight = <Text style={{ color: '#FF6C00' }}>金币记录</Text>;

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            withdraw().then(r => {
                if (r && !r.error && r.data) {
                    const formatGoods = formatGood(r.data);
                    setGoods(formatGoods);
                    setGoodId(formatGoods[0].withdraw_id);
                    setMoney(formatGoods[0].money);
                }
            });
        });
    }, []);
    function formatGood (list) {
        try {
            return list.filter(item => !(item.is_withdraw && item.all_times === 1));
        } catch (e) {
            console.log(e);
        }
    }
    const debounceApiWithdraw = _debounce((callback) => {
        apiWithdraw(callback);
    }, 500);

    function apiWithdraw (callback) {
        postWithdraw(goodId, money, payType).then(r => {
            try {
                if (r && !r.error) {
                    DeviceEventEmitter.emit('showPop', <Choice info={{
                        icon: with10,
                        tips: '兑换申请成功，请耐心等待审核。一般1个工作日内审核完成。',
                        type: 1,
                        rc: () => {
                            N.goBack();
                        },
                        rt: '我知道了',
                        fontSize: 15
                    }}/>);
                    updateUser();
                    updateSecondIncome();
                    callback && callback();
                } else {
                    callback && callback();
                    if (r && r.error === 9) { // 未绑定微信
                        toast('请绑定微信！');
                        N.replace('WeChatBindPage');
                    }
                }
            } catch (e) {
                console.log(e);
                callback && callback();
            }
            // eslint-disable-next-line handle-callback-err
        }).catch(err => {
            callback && callback();
        });
    }

    return (
        <SafeAreaView style={css.safeAreaView}>
            <Header scene={{ descriptor: { options: {} }, route: { name: '我的收益' } }} navigation={N} onPress={() => {
                N.navigate('FundingRecordsPage');
            }} backOnPress={() => {
                const { callbackGetTask } = props.route.params;
                callbackGetTask && typeof callbackGetTask === 'function' && callbackGetTask();
                N.goBack();
            }} headerRight={headerRight}/>
            <ScrollView style={styles.scrollView}>
                <ImageBackground source={with1} style={styles.moneyView}>
                    <View style={styles.moneyViewTop}>
                        <Text karet-lift style={{ fontSize: 25, color: '#fff' }}>{balance}</Text>
                        <Text style={{ fontSize: 11, color: '#fff' }}>可兑换收益(金币)</Text>
                    </View>
                    <View style={styles.moneyViewBottom}>
                        <View style={[styles.moneyViewItem, { borderRightWidth: 1, borderRightColor: '#FFF' }]}>
                            <Text karet-lift style={{ fontWeight: '800', color: '#fff' }}>{today_income}</Text>
                            <Text style={[{ fontSize: 11, color: '#fff' }, css.sy]}>今日收益(金币)</Text>
                        </View>
                        <View style={styles.moneyViewItem}>
                            <Text karet-lift style={{ fontWeight: '800', color: '#fff' }}>{total_income}</Text>
                            <Text style={[{ fontSize: 11, color: '#fff' }, css.sy]}>总收益(金币)</Text>
                        </View>
                    </View>
                </ImageBackground>
                <View style={styles.goodView}>
                    <View style={styles.goodViewTitle}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#222' }}>兑换金币<Text
                            style={{ fontSize: 11, fontWeight: '500', color: '#FF6C00' }}> （1元 = {BALANCE_RATE}金币）</Text></Text>
                        <Text style={[{ fontSize: 10, color: '#999' }, css.sy]} numberOfLines={1}>连续签到可获取免手续费特权</Text>
                    </View>
                    <RenderGoodItem goods={goods} setGoodId={setGoodId} goodId={goodId} setMoney={setMoney}/>
                </View>
                <View style={styles.withDrawView}>
                    <View style={styles.withDrawViewTitle}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#222' }}>兑换到</Text>
                        <TouchableOpacity activeOpacity={1} onPress={() => {
                            N.navigate('WithdrawRecordsPage');
                        }}>
                            <Text style={{ fontSize: 12, color: '#FF6C00' }}>兑换记录</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.withDrawType}>
                        <TouchableOpacity activeOpacity={1} onPress={() => setPayType('ali')} style={[styles.withDrawTypeItem, { borderColor: payType === 'ali' ? '#FF6C00' : '#D0D0D0' }]}>
                            <RenderWithDrawTypeSelectView select={payType === 'ali'}/>
                            <Image source={with3} style={styles.withDrawImage}/>
                            <Text style={styles.withDrawText}>支付宝账户</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => setPayType('wx')} style={[styles.withDrawTypeItem, { borderColor: payType === 'wx' ? '#FF6C00' : '#D0D0D0' }]}>
                            <RenderWithDrawTypeSelectView select={payType === 'wx'}/>
                            <Image source={with4} style={styles.withDrawImage}/>
                            <Text style={styles.withDrawText}>微信账户</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text numberOfLines={1} style={styles.title}>兑换说明：</Text>
                <Text numberOfLines={1} style={styles.text}>1.兑换前请先绑定微信账号，微信账号绑定后不能修改。</Text>
                <Text numberOflines={1} style={styles.text}>2.1元 = {BALANCE_RATE}金币。通过"摸鱼夺宝"、活动、渔友等获得金币。</Text>
                <Text numberOflines={1} style={styles.text}>3.首次1w起兑换；第二次5w金币起；之后每次10w起。</Text>
                <Text numberOflines={1} style={styles.text}>4.兑换审核成功后到账，一般1个工作日内审核完成。</Text>
                <Text numberOflines={1} style={styles.text}>5.兑换审核成功后立即到账，可以在“兑换记录”查看兑换状态。</Text>
                <Text numberOflines={1} style={styles.text}>6.如果微信账号不能正常兑换，请使用支付账户兑换。</Text>
                <Text numberOflines={1} style={styles.text}>7.支付宝账号和姓名必须匹配，否则兑换不会到账。</Text>
                <Text numberOflines={1} style={[styles.text, { paddingBottom: 30 }]}>8.每天每档只能兑换一次。</Text>
            </ScrollView>
            <Button type={2} name={'立即兑换'} onPress={(callback) => {
                try {
                    if (!goodId) {
                        toast('兑换失败!');
                        callback();
                        return;
                    }
                    if (payType === 'wx') {
                        debounceApiWithdraw(callback);
                    } else {
                        callback();
                        if (openid.get()) {
                            N.navigate('WithdrawAliPayPage', { goodId, money });
                        } else {
                            toast('请绑定微信！');
                            N.replace('WeChatBindPage');
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }}/>
        </SafeAreaView>
    );
}

function RenderGoodItem ({ goods, setGoodId, setMoney, goodId }) {
    const view = [];
    goods.forEach(good => {
        const { withdraw_id, money, ext_fee, is_withdraw, all_times } = good;
        const value = goodId === withdraw_id;
        if (is_withdraw && all_times === 1) {
            return;
        }
        view.push(
            <TouchableOpacity activeOpacity={1} onPress={() => {
                setGoodId(withdraw_id);
                setMoney(money);
            }} key={withdraw_id} style={[styles.goodItem, { borderColor: value ? '#FF6C00' : '#D0D0D0', backgroundColor: value ? '#FFF5F0' : '#fff' }]}>
                <RenderGoodOnceView once={!is_withdraw && all_times === 1}/>
                <Text style={styles.goodMoney}>{transformMoney(good.money, 0)}金币</Text>
                <Text style={{ fontSize: 10, color: ext_fee ? '#999' : '#FF6C00', ...css.sy }}>{ext_fee ? `手续费：${transformMoney(ext_fee, 0)}金币` : '免手续费'}</Text>
            </TouchableOpacity>,
        );
    });
    return (
        <View style={styles.good}>
            {view}
        </View>
    );
}

function RenderGoodOnceView ({ once }) {
    if (once) {
        return (
            <ImageBackground source={with2} style={styles.onceWithDraw}>
                <Text style={styles.onceWithDrawText}>仅一次</Text>
            </ImageBackground>
        );
    }
    return <View/>;
}

function RenderWithDrawTypeSelectView ({ select }) {
    if (select) {
        return (
            <View style={styles.selectView}>
                <Image source={with5} style={{ height: 7, width: 9, bottom: -20, position: 'absolute', right: 2 }}/>
            </View>
        );
    }
    return <View/>;
}

const styles = StyleSheet.create({
    good: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    goodItem: {
        alignItems: 'center',
        borderRadius: 6,
        borderWidth: 1,
        height: 66,
        justifyContent: 'center',
        marginBottom: 25,
        marginLeft: '1%',
        marginRight: '1%',
        position: 'relative',
        width: '31.333%',
    },
    goodMoney: {
        color: '#FF6C00',
        fontSize: 17,
        fontWeight: '500'
    },
    goodView: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginLeft: '1%',
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        width: '98%',
    },
    goodViewTitle: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
        marginBottom: 5
    },
    moneyView: {
        height: (width - 20) * 468 / 1089,
        width: width - 20,
    },
    moneyViewBottom: {
        flexDirection: 'row',
        height: '25%',
        marginTop: '5%',
        width: '100%',
    },
    moneyViewItem: {
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        width: '50%',
    },
    moneyViewTop: {
        alignItems: 'center',
        height: '50%',
        justifyContent: 'flex-end',
        marginLeft: '25%',
        width: '50%',
    },
    onceWithDraw: {
        height: 24,
        left: '-3%',
        position: 'absolute',
        top: '-18%',
        width: 59
    },
    onceWithDrawText: {
        color: '#fff',
        fontSize: 12,
        lineHeight: 21,
        textAlign: 'center'
    },
    scrollView: {
        backgroundColor: '#F8F8F8',
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
    },
    selectView: {
        borderBottomColor: '#FF3E00',
        borderBottomWidth: 23,
        borderLeftColor: 'transparent',
        borderLeftWidth: 27,
        bottom: 0,
        height: 0,
        position: 'absolute',
        right: 0,
        width: 0,
    },
    text: {
        color: '#999',
        fontSize: 12,
        marginTop: 10,
    },
    title: {
        color: '#353535',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
    },
    withDrawBtn: {
        backgroundColor: '#FF3E00',
        height: 44,
        width,
    },
    withDrawBtnText: {
        color: '#fff',
        fontSize: 17,
        lineHeight: 44,
        textAlign: 'center',
    },
    withDrawImage: {
        height: 26,
        marginRight: 7,
        width: 26
    },
    withDrawText: {
        color: '#222',
        fontSize: 16
    },
    withDrawType: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    withDrawTypeItem: {
        alignItems: 'center',
        borderRadius: 6,
        borderWidth: 1,
        flexDirection: 'row',
        height: 56,
        justifyContent: 'center',
        marginBottom: 10,
        marginLeft: '1%',
        marginRight: '1%',
        position: 'relative',
        width: '48%',
    },
    withDrawView: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginLeft: '1%',
        marginTop: 10,
        minHeight: 160,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        width: '98%',
    },
    withDrawViewTitle: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
        marginBottom: 5,
    }
});

export default WithdrawPage;
