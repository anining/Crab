import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
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
import AcceptQRCodePage from '../view/shareView/AcceptQRCodePage';
import AcceptUrlPage from '../view/shareView/AcceptUrlPage';
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
import { initializationStore } from '../utils/util';
import SplashScreen from 'react-native-splash-screen';
import Prompt from '../components/Prompt';

const Stack = createStackNavigator();

const stackScreens = [
    {
        name: 'WithdrawRecordsPage',
        component: WithdrawRecordsPage,
        title: '提现记录',
    },
    {
        name: 'WithdrawPage',
        component: WithdrawPage,
        title: '我的收益',
    },
    {
        name: 'AnswerDetailPage',
        component: AnswerDetailPage,
        title: '关卡',
    },
    {
        name: 'WithdrawAliPayPage',
        component: WithdrawAliPayPage,
        title: '提现到支付宝',
    },
    {
        name: 'WeChatBindPage',
        component: WeChatBindPage,
        title: '绑定微信',
    },
    {
        name: 'MyTaskPage',
        component: MyTaskPage,
        title: '我的任务',
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
        title: '资金记录',
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
        title: '消耗记录',
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
        name: 'AcceptQRCodePage',
        component: AcceptQRCodePage,
        title: '二维码收徒',
    },
    {
        name: 'AcceptUrlPage',
        component: AcceptUrlPage,
        title: '链接收徒',
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
        title: '公告通知',
    },
    {
        name: 'TaskDetailPage',
        component: TaskDetailPage,
        title: '任务信息',
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
];

function setStatusBar () {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('rgba(0,0,0,0)');
    StatusBar.setTranslucent(true);
}

function AppStackNavigator () {
    const [keys, setKeys] = useState();
    const GenerateScreen = stackScreens.map(screen =>
        <Stack.Screen name={screen.name} component={screen.component} options={{ title: screen.title }}
            key={screen.name}/>);
    useEffect(() => {
        asyncStorage.getAllKeys()
            .then(response => {
                asyncStorage.multiGet(response)
                    .then(r => {
                        initializationStore(r);
                        setKeys([]);
                        setStatusBar();
                        SplashScreen.hide();
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
            <NavigationContainer>
                <Prompt/>
                <Stack.Navigator screenOptions={{
                    header: ({ scene, previous, navigation }) => <Header scene={scene} previous={previous}
                        navigation={navigation}/>,
                }}>
                    <Stack.Screen name="MaterialTopTabNavigator" options={{ headerShown: false }}
                        component={TabNavigator}/>
                    <Stack.Screen name="VerificationStackNavigator" component={StackNavigator}
                        options={{ headerShown: false }}/>
                    {GenerateScreen}
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
    return <SafeAreaView style={css.safeAreaView}/>;
}

export default codePush(AppStackNavigator);
