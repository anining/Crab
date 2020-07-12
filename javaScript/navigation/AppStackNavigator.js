import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, DeviceEventEmitter } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import codePush from 'react-native-code-push';
import TabNavigator from './tabNavigator';
import StackNavigator from './stackNavigator';
import Header from '../components/Header';
import WithdrawRecordsPage from '../view/userView/WithdrawRecordsPage';
import WithdrawPage from '../view/userView/WithdrawPage';
import WithdrawAliPayPage from '../view/userView/WithdrawAliPayPage';
import WeChatBindPage from '../view/userView/WeChatBindPage';
import MyTaskPage from '../view/userView/MyTaskPage';
import HelpCenterPage from '../view/userView/HelpCenterPage';
import HelpCenterDetailPage from '../view/userView/HelpCenterDetailPage';
import AnswerDetailPage from '../view/answerView/AnswerDetailPage';
import FundingRecordsPage from '../view/userView/FundingRecordsPage';
import GlossaryPage from '../view/userView/GlossaryPage';
import UserAgreementPage from '../view/userView/UserAgreementPage';
import PrivacyPolicyPage from '../view/userView/PrivacyPolicyPage';
import ActivityCenterPage from '../view/userView/ActivityCenterPage';
import FeedBackRecordsPage from '../view/userView/FeedBackRecordsPage';
import FeedBackPage from '../view/userView/FeedBackPage';
import CardPackageRecordsPage from '../view/userView/CardPackageRecordsPage';
import CardPackagePage from '../view/userView/CardPackagePage';
import BlackHousePage from '../view/userView/BlackHousePage';
import AccountHomePage from '../view/userView/AccountHomePage';
import AccountBindPage from '../view/userView/AccountBindPage';
import PupilInfoPage from '../view/shareView/PupilInfoPage';
import PupilSetPage from '../view/shareView/PupilSetPage';
import DailyMoneyPage from '../view/activityView/DailyMoneyPage';
import SignPage from '../view/activityView/SignPage';
import ErrorPage from '../view/otherView/ErrorPage';
import DailyRedPackagePage from '../view/activityView/DailyRedPackagePage';
import NoticePage from '../view/homeView/NoticePage';
import NewbiePage from '../view/homeView/NewbiePage';
import TaskDetailPage from '../view/homeView/TaskDetailPage';
import { css } from '../assets/style/css';
import asyncStorage from '../utils/asyncStorage';
import { _tc, initializationStore, setConsole } from '../utils/util';
import SplashScreen from 'react-native-splash-screen';
import Prompt from '../components/Prompt';
import {
    getGradeSetting,
    getSignConfig,
    getTaskPlatform, getWithdrawLatest, updateAccount,
    updateActivity,
    updateApp,
    updateBanner,
    updateNextRedLevel,
    updateSecondIncome,
    updateUser,
} from '../utils/update';
import OpenMoneyPage from '../view/activityView/OpenMoneyPage';
import GamePage from '../view/gameView/GamePage';
import NoticeDetailPage from '../view/homeView/NoticeDetailPage';
import ShareUrlPage from '../view/shareView/ShareUrlPage';
import ShareQRCodePage from '../view/shareView/ShareQRCodePage';
import PassGamePage from '../view/gameView/PassGamePage';
import RightProPage from '../view/gameView/RightProPage';
import NoviceVideoPage from '../view/otherView/NoviceVideoPage';
import MustUpdate from '../components/MustUpdate';
import WebViewPage from '../view/userView/WebViewPage';
import MyMedal from '../view/userView/MyMedal';
import SharePage from '../view/tabView/SharePage';
import SetPage from '../view/userView/SetPage';

const Stack = createStackNavigator();

const stackScreens = [
    {
        name: 'WithdrawRecordsPage',
        component: WithdrawRecordsPage,
        title: '兑换记录',
    },
    {
        name: 'WithdrawPage',
        component: WithdrawPage,
        title: '我的收益',
    },
    {
        name: 'ShareUrlPage',
        component: ShareUrlPage,
        title: '分享链接收徒',
    },
    {
        name: 'ShareQRCodePage',
        component: ShareQRCodePage,
        title: '分享海报',
    },
    {
        name: 'AnswerDetailPage',
        component: AnswerDetailPage,
        title: '关卡',
    },
    {
        name: 'WithdrawAliPayPage',
        component: WithdrawAliPayPage,
        title: '兑换到支付宝',
    },
    {
        name: 'WeChatBindPage',
        component: WeChatBindPage,
        title: '绑定微信',
    },
    {
        name: 'MyTaskPage',
        component: MyTaskPage,
        title: '摸鱼夺宝记录',
    },
    {
        name: 'HelpCenterPage',
        component: HelpCenterPage,
        title: '帮助中心',
    },
    {
        name: 'HelpCenterDetailPage',
        component: HelpCenterDetailPage,
        title: '帮助详情',
    },
    {
        name: 'FundingRecordsPage',
        component: FundingRecordsPage,
        title: '金币记录',
    },
    {
        name: 'FeedBackRecordsPage',
        component: FeedBackRecordsPage,
        title: '反馈记录',
    },
    {
        name: 'FeedBackPage',
        component: FeedBackPage,
        title: '意见反馈',
    },
    {
        name: 'CardPackageRecordsPage',
        component: CardPackageRecordsPage,
        title: '道具记录',
    },
    {
        name: 'CardPackagePage',
        component: CardPackagePage,
        title: '道具背包',
    },
    {
        name: 'BlackHousePage',
        component: BlackHousePage,
        title: '小黑屋',
    },
    {
        name: 'AccountHomePage',
        component: AccountHomePage,
        title: '绑定账号',
    },
    {
        name: 'AccountBindPage',
        component: AccountBindPage,
        title: '账号绑定',
    },
    {
        name: 'PupilInfoPage',
        component: PupilInfoPage,
        title: '师徒信息',
    },
    {
        name: 'PupilSetPage',
        component: PupilSetPage,
        title: '师徒设置',
    },
    {
        name: 'DailyMoneyPage',
        component: DailyMoneyPage,
        title: '每日现金',
    },
    {
        name: 'DailyRedPackagePage',
        component: DailyRedPackagePage,
        title: '每日红包',
    },
    {
        name: 'OpenMoneyPage',
        component: OpenMoneyPage,
        title: '每日现金',
    },
    {
        name: 'SignPage',
        component: SignPage,
        title: '签到',
    },
    {
        name: 'NewbiePage',
        component: NewbiePage,
        title: '新人福利',
    },
    {
        name: 'NoticePage',
        component: NoticePage,
        title: '系统通知',
    },
    {
        name: 'NoticeDetailPage',
        component: NoticeDetailPage,
        title: '通知详情',
    },
    {
        name: 'TaskDetailPage',
        component: TaskDetailPage,
        title: '摸鱼夺宝',
    },
    {
        name: 'ErrorPage',
        component: ErrorPage,
        title: '错误',
    },
    {
        name: 'GlossaryPage',
        component: GlossaryPage,
        title: '生词本',
    },
    {
        name: 'UserAgreementPage',
        component: UserAgreementPage,
        title: '用户协议',
    },
    {
        name: 'PrivacyPolicyPage',
        component: PrivacyPolicyPage,
        title: '隐私政策',
    },
    {
        name: 'ActivityCenterPage',
        component: ActivityCenterPage,
        title: '活动中心',
    },
    {
        name: 'GamePage',
        component: GamePage,
        title: '答题',
    },
    {
        name: 'PassGamePage',
        component: PassGamePage,
        title: '答题结算',
    },
    {
        name: 'RightProPage',
        component: RightProPage,
        title: '答题正确率',
    },
    {
        name: 'NoviceVideoPage',
        component: NoviceVideoPage,
        title: '新手视频',
    },
    {
        name: 'WebViewPage',
        component: WebViewPage,
        title: '详情',
    },
    {
        name: 'MyMedal',
        component: MyMedal,
        title: '我的勋章',
    },
    {
        name: 'SharePage',
        component: SharePage,
        title: '我的渔友',
    }, {
        name: 'SetPage',
        component: SetPage,
        title: '设置',
    }
];

function setStatusBar () {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('rgba(0,0,0,0)');
    StatusBar.setTranslucent(true);
}

export function initNetInfo () {
    return Promise.all([updateUser(), updateAccount(), updateApp(), updateBanner(), updateActivity(), getSignConfig(), getTaskPlatform(), getGradeSetting(), updateSecondIncome(), updateNextRedLevel(), getWithdrawLatest()]);
}

function AppStackNavigator () {
    const [keys, setKeys] = useState();
    const GenerateScreen = stackScreens.map(screen =>
        <Stack.Screen name={screen.name} component={screen.component} options={{ title: screen.title }} key={screen.name}/>);

    function set () {
        setStatusBar();
        setKeys([]);
        SplashScreen.hide();
    }

    useEffect(() => {
        setConsole();
        asyncStorage.getAllKeys()
            .then(response => {
                asyncStorage.multiGet(response.filter(x => !new RegExp('[0-9]').test(x))) // 去除含有数字的key值
                    .then(async r => {
                        initializationStore(r);
                        set(); // 先进入主页，后发起更新请求
                        await initNetInfo();
                    });
            })
            .catch(() => {
                setKeys([]);
            });
        return () => {
            asyncStorage.flushGetRequests();
        };
    }, []);
    if (keys) {
        return (
            <NavigationContainer onStateChange={(e) => {
                // 优化动画开启关闭
                _tc(() => {
                    if ([...e.routes].pop().state && [...e.routes].pop().state.index === 0) {
                        DeviceEventEmitter.emit('startLottie');
                    } else {
                        if ([...e.routes].shift().state.index === 0) {
                            DeviceEventEmitter.emit('stopLottie');
                        }
                    }
                });
            }}>
                <Prompt/>
                <MustUpdate/>
                <Stack.Navigator screenOptions={{ cardStyle: {}, gestureEnabled: true, ...TransitionPresets.SlideFromRightIOS, header: ({ scene, previous, navigation }) => <Header scene={scene} previous={previous} navigation={navigation}/> }}>
                    <Stack.Screen name="MaterialTopTabNavigator" options={{ headerShown: false }} component={TabNavigator}/>
                    <Stack.Screen name="VerificationStackNavigator" component={StackNavigator} options={{ headerShown: false }}/>
                    {GenerateScreen}
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
    return <SafeAreaView style={css.safeAreaView}/>;
}

export default codePush(AppStackNavigator);
