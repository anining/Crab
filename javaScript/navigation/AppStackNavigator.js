import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import codePush from 'react-native-code-push';
import MaterialTopTabNavigator from './MaterialTopTabNavigator';
import VerificationStackNavigator from './VerificationStackNavigator';
import Header from '../components/Header';
import WithdrawRecordsPage from '../view/userView/WithdrawRecordsPage';
import WithdrawPage from '../view/userView/WithdrawPage';
import WithdrawAliPayPage from '../view/userView/WithdrawAliPayPage';
import WeChatBindPage from '../view/userView/WeChatBindPage';
import MyTaskPage from '../view/userView/MyTaskPage';
import HelpCenterPage from '../view/userView/HelpCenterPage';
import FundingRecordsPage from '../view/userView/FundingRecordsPage';
import FeedBackRecordsPage from '../view/userView/FeedBackRecordsPage';
import FeedBackPage from '../view/userView/FeedBackPage';
import CardPackageRecordsPage from '../view/userView/CardPackageRecordsPage';
import CardPackagePage from '../view/userView/CardPackagePage';
import BlackHousePage from '../view/userView/BlackHousePage';
import AccountHomePage from '../view/userView/AccountHomePage';
import AccountBindPage from '../view/userView/AccountBindPage';
import AcceptQRCodePage from '../view/shareView/AcceptQRCodePage';
import AcceptUrlPage from '../view/shareView/AcceptUrlPage';
import ApprenticeInformationPage from '../view/shareView/ApprenticeInformationPage';
import ApprenticeSettingPage from '../view/shareView/ApprenticeSettingPage';
import DailyMoneyPage from '../view/activityView/DailyMoneyPage';
import SignPage from '../view/activityView/SignPage';
import DailyRedPackagePage from '../view/activityView/DailyRedPackagePage';
import NoticePage from '../view/homeView/NoticePage';
import NewbiePage from '../view/homeView/NewbiePage';
import TaskDetailPage from '../view/homeView/TaskDetailPage';

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
    name: 'ApprenticeInformationPage',
    component: ApprenticeInformationPage,
    title: '师徒信息',
  },
  {
    name: 'ApprenticeSettingPage',
    component: ApprenticeSettingPage,
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
];

function GenerateScreen() {
  let screens = [];
  stackScreens.forEach(screen => {
    screens.push(
      <Stack.Screen name={screen.name} component={screen.component} options={{title: screen.title}} />,
    );
  });
  return screens;
}

function AppStackNavigator() {
  // const [keys, setKeys] = useState();
  // useEffect(() => {
  //   asyncStorage.getAllKeys()
  //     .then(response => {
  //       asyncStorage.multiGet(response)
  //         .then(res => {
  //           seStore(res);
  //           setKeys([]);
  //         });
  //     })
  //     .catch(() => {
  //       setKeys([]);
  //     });
  //   return () => {
  //     asyncStorage.flushGetRequests();
  //   };
  // }, []);
  // if (keys) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{header: e => <Header e={e} />}}>
        <Stack.Screen name="MaterialTopTabNavigator" options={{headerShown: false}}
                      component={MaterialTopTabNavigator} />
        <Stack.Screen name="VerificationStackNavigator" component={VerificationStackNavigator} />
        {GenerateScreen}
      </Stack.Navigator>
    </NavigationContainer>
  );
  // }
  // return <SafeAreaView style={[generalStyle.safeAreaView, {backgroundColor: 'blue'}]}/>;
}

export default codePush(AppStackNavigator);
