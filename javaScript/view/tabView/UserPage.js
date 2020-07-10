import * as React from 'karet';
import * as R from 'kefir.ramda';
import { useState } from 'react';
import {
    View,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    ImageBackground,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    Dimensions,
    RefreshControl,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { css } from '../../assets/style/css';
import { N } from '../../utils/router';
import user1 from '../../assets/icon/user/user1.png';
import user2 from '../../assets/icon/user/user2.png';
import user3 from '../../assets/icon/user/user3.png';
import user4 from '../../assets/icon/user/user4.png';
import user5 from '../../assets/icon/user/user5.png';
import user6 from '../../assets/icon/user/user6.png';
import user8 from '../../assets/icon/user/user8.png';
import user9 from '../../assets/icon/user/user9.png';
import user10 from '../../assets/icon/user/user10.png';
import user11 from '../../assets/icon/user/user11.png';
import user12 from '../../assets/icon/user/user12.png';
import user13 from '../../assets/icon/user/user13.png';
import user14 from '../../assets/icon/user/user14.png';
import user15 from '../../assets/icon/user/user15.png';
import user16 from '../../assets/icon/user/user16.png';
import user17 from '../../assets/icon/user/user17.png';
import { getter, clear } from '../../utils/store';
import toast from '../../utils/toast';
import * as U from 'karet.util';
import { updateSecondIncome, updateUser } from '../../utils/update';
import { _copyStr, _toFixed } from '../../utils/util';
import ImageAuto from '../../components/ImageAuto';

const { width } = Dimensions.get('window');
const MENU_LIST = [
    {
        icon: user17,
        title: '活动中心',
        remark: '超多活动等你参与',
        path: 'ActivityCenterPage'
    },
    {
        icon: user8,
        title: '道具背包',
        remark: '',
        path: 'CardPackagePage'
    },
    {
        icon: user16,
        title: '生词本',
        remark: '巩固学习的成语',
        path: 'GlossaryPage'
    },
    {
        icon: user9,
        title: '意见反馈',
        remark: '建议和反馈',
        path: 'FeedBackPage'
    },
    {
        icon: user10,
        title: '帮助中心',
        remark: '常见问题&加群求助',
        path: 'HelpCenterPage'
    },
    {
        icon: user11,
        title: '小黑屋',
        remark: '',
        path: 'BlackHousePage'
    },
    {
        icon: user15,
        title: '用户协议',
        remark: '',
        path: 'UserAgreementPage'
    },
    {
        icon: user14,
        title: '隐私政策',
        remark: '',
        path: 'PrivacyPolicyPage'
    },
    {
        icon: user12,
        title: '切换账号',
        remark: '',
        path: 'VerificationStackNavigator'
    }
];
const TASK_MENU = [
    {
        id: 1,
        label: '进行中',
        icon: user3
    },
    {
        id: 4,
        label: '审核中',
        icon: user4
    },
    {
        id: 5,
        label: '已通过',
        icon: user5
    },
    {
        id: 6,
        label: '未通过',
        icon: user6
    }
];
const { today_income, total_income, nickname, authorization, balance, openid, phone, avatar, invite_code, receive_task_status } = getter(['user.red_point.receive_task_status', 'authorization', 'user.today_income', 'user.openid', 'user.nickname', 'user.total_income', 'user.balance', 'user.phone', 'user.avatar', 'user.invite_code']);
const fixedBalance = U.mapValue((res) => {
    if (isNaN(res)) {
        return res;
    }
    return _toFixed(res, 0);
}, balance);
const fixedTodayIncome = U.mapValue((res) => {
    if (isNaN(res)) {
        return res;
    }
    return _toFixed(res, 0);
}, today_income);
const fixedTotalIncome = U.mapValue((res) => {
    if (isNaN(res)) {
        return res;
    }
    return _toFixed(res, 0);
}, total_income);
function UserPage () {
    // const [refreshing, setRefreshing] = useState(false);
    !authorization.get() && N.replace('VerificationStackNavigator');
    updateUser();

    function onRefresh () {
        updateUser();
        updateSecondIncome();
    }

    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#F8F8F8', paddingTop: 20 }]}>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={false}
                    onRefresh={() => {
                        onRefresh();
                    }}
                    colors={['#c8b799', '#ffa11b']}
                    tintColor={'#ffa11b'}
                    size={10}
                />
            }>
                <View style={[styles.userDetailView, css.pr]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.avatarIconWrap} onPress={() => {
                            if (!openid.get()) {
                                N.navigate('WeChatBindPage');
                            }
                        }}>
                            <Image karet-lift source={U.template({ uri: avatar })} style={styles.avatarIcon}/>
                        </TouchableOpacity>
                        <View>
                            <View style={styles.userCardTop}>
                                <Text karet-lift numberOfLines={1} style={styles.userPhone}>{nickname}</Text>
                                <Text karet-lift numberOfLines={1} style={styles.userId}>ID:{phone}</Text>
                            </View>
                            <TouchableOpacity style={styles.userCardBottom} onPress={() => {
                                _copyStr(invite_code.get());
                            }}>
                                <Text karet-lift numberOfLines={1} style={styles.inviteCode}>邀请码:{invite_code}</Text>
                                <View style={styles.copyBtn}>
                                    <Text style={styles.copyText}>复制</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <RenderBind />
                </View>
                <View style={styles.moneyView}>
                    <ImageBackground source={user1} style={{ width: width - 20, height: (width - 20) * 405 / 1089 }}>
                        <View style={styles.moneyViewTop}>
                            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>我的钱包</Text>
                            <TouchableOpacity activeOpacity={1} onPress={() => {
                                N.navigate('WithdrawPage');
                            }} style={styles.withDrawBtn}>
                                <Text style={{ lineHeight: 30, textAlign: 'center', color: '#fff' }}>立即提现</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.moneyViewBottom}>
                            <View style={styles.moneyViewItem}>
                                <Text karet-lift style={styles.moneyText}>{fixedBalance}</Text>
                                <Text style={styles.moneyTitle}>可提现(金币)</Text>
                            </View>
                            <View style={[styles.moneyViewItem, styles.moneyViewCenterItem]}>
                                <Text karet-lift style={styles.moneyText}>{fixedTodayIncome}</Text>
                                <Text style={styles.moneyTitle}>今日收益(金币)</Text>
                            </View>
                            <View style={styles.moneyViewItem}>
                                <Text karet-lift style={styles.moneyText}>{fixedTotalIncome}</Text>
                                <Text style={styles.moneyTitle}>总收益(金币)</Text>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.myTask}>
                    <Text style={styles.myTaskTitle}>我的任务</Text>
                    <RenderTaskMenu />
                </View>
                <RenderMenu />
            </ScrollView>
        </SafeAreaView>
    );
}

function RenderBind () {
    const view = U.ifElse(R.equals(openid, null), <TouchableOpacity onPress={() => {
        N.navigate('WeChatBindPage');
    }} style={[css.pa, styles.bindBtn]}>
        <Image source={user2} style={{ width: 16, height: 13, marginRight: 5 }}/>
        <Text style={styles.bindText}>绑定微信</Text>
    </TouchableOpacity>, undefined);
    return <>{view}</>;
}

function RenderTaskMenu () {
    const view = [];
    authorization.get() && TASK_MENU.forEach((menu, index) => {
        const { id, icon, label } = menu;
        // const number = U.mapValue(num => U.ifElse(R.equals(num, undefined), 0, num[id]), receive_task_status);
        view.push(
            <TouchableOpacity activeOpacity={1} onPress={() => N.navigate('MyTaskPage', { id: index })} style={styles.myTaskBtn} key={id}>
                <Image source={icon} style={styles.myTaskBtnIcon}/>
                <Text style={styles.myTaskBtnText}>{label}
                    {/* <Text karet-lift style={{ color: '#FF7751' }}> {number}</Text> */}
                </Text>
            </TouchableOpacity>
        );
    });
    return (
        <View style={styles.myTaskViewBottom}>
            {view}
        </View>
    );
}

function RenderMenu () {
    const view = [];
    MENU_LIST.forEach(menu => {
        const { title, icon, path, remark } = menu;
        view.push(
            <TouchableOpacity activeOpacity={1} onPress={() => {
                if (path === 'VerificationStackNavigator') {
                    clear();
                    N.replace(menu.path);
                } else {
                    N.navigate(menu.path);
                }
            }} style={styles.btn} key={menu.path}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={icon} style={styles.menuIcon}/>
                    <Text>{title}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 13, color: '#999', marginRight: 5, ...css.sy }}>{remark}</Text>
                    <Image source={user13} style={{ height: 13, width: 6, marginHorizontal: 6 }}/>
                </View>
            </TouchableOpacity>
        );
    });
    return (
        <View style={{ backgroundColor: '#fff' }}>
            {view}
        </View>
    );
}

const styles = StyleSheet.create({
    avatarIcon: {
        borderColor: '#ffc7a1',
        borderRadius: 29,
        borderWidth: 1,
        height: 58,
        width: 58
    },
    avatarIconWrap: {
        marginHorizontal: 15
    },
    bindBtn: {
        alignItems: 'center',
        backgroundColor: '#FF9C00',
        borderBottomLeftRadius: 12,
        borderTopLeftRadius: 12,
        flexDirection: 'row',
        height: 24,
        justifyContent: 'center',
        right: 0,
        width: 80,
        zIndex: 9
    },
    bindText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '500'
    },
    btn: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
        marginLeft: 15,
        paddingRight: 15,
        width: width - 10

    },
    copyBtn: {
        backgroundColor: '#FFF4E8',
        height: 22,
        width: 35
    },
    copyText: {
        color: '#FF6C00',
        fontSize: 10,
        lineHeight: 22,
        textAlign: 'center'
    },
    inviteCode: {
        color: '#666',
        fontSize: 10,
        marginRight: 10
    },
    menuIcon: {
        height: 20,
        marginRight: 5,
        width: 20
    },
    moneyText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800'
    },
    moneyTitle: {
        color: '#fff',
        fontSize: 12,
        ...css.sy
    },
    moneyView: {
        backgroundColor: '#fff',
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
        width
    },
    moneyViewBottom: {
        alignItems: 'center',
        flexDirection: 'row',
        height: '30%',
        justifyContent: 'space-between',
        paddingLeft: 12,
        paddingRight: 12,
        width: '100%'
    },
    moneyViewCenterItem: {
        borderColor: '#FFC924',
        borderLeftWidth: 1,
        borderRightWidth: 1
    },
    moneyViewItem: {
        alignItems: 'center',
        height: '100%',
        width: '33.333%'
    },
    moneyViewTop: {
        alignItems: 'center',
        // backgroundColor: '#321',
        flexDirection: 'row',
        height: '40%',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        width: '100%'
    },
    myTask: {
        backgroundColor: '#fff',
        height: 120,
        marginBottom: 15,
        marginTop: 15
    },
    myTaskBtn: {
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        width: '25%'
    },
    myTaskBtnIcon: {
        height: 28.5,
        width: 24 / 25.5 * 28.5
    },
    myTaskBtnText: {
        fontSize: 12
    },
    myTaskTitle: {
        color: '#222',
        fontSize: 18,
        fontWeight: '600',
        height: 50,
        lineHeight: 50,
        paddingLeft: 10,
        width: '100%',

    },
    myTaskViewBottom: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 70,
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%'
    },
    userCardBottom: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        height: 22,
        justifyContent: 'flex-start',
    },
    userCardTop: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 2
    },
    userDetailView: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flexDirection: 'row',
        height: 100,
        justifyContent: 'space-between',
        width
    },
    userId: {
        color: '#999',
        fontSize: 10
    },
    userPhone: {
        fontSize: 18,
        fontWeight: '800',
        marginRight: 10,
        maxWidth: 120
    },
    withDrawBtn: {
        borderColor: '#fff',
        borderRadius: 18,
        borderWidth: 1,
        height: 30,
        width: 78
    }
});

export default UserPage;
