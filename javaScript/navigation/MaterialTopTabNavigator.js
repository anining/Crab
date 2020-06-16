import * as React from 'karet';
import { Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomePage from '../view/tabView/HomePage';
import UserPage from '../view/tabView/UserPage';
import AnswerPage from '../view/tabView/AnswerPage';
import SharePage from '../view/tabView/SharePage';
import { proxyRouter } from '../utils/router';
import { css } from '../assets/style/css';

const Tab = createMaterialTopTabNavigator();

export default function MaterialTopTabNavigator ({ navigation }) {
    proxyRouter(navigation, ['MaterialTopTabNavigator'], 'VerificationStackNavigator');
    return (
        <Tab.Navigator
            tabBarPosition="bottom"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    let iconPath;
                    switch (route.name) {
                    case 'HomePage':
                        iconPath = focused ? require('../assets/icon/materialTopTabNavigator/home-page-true.png') : require('../assets/icon/materialTopTabNavigator/home-page-false.png');
                        break;
                    case 'AnswerPage':
                        iconPath = focused ? require('../assets/icon/materialTopTabNavigator/answer-page-true.png') : require('../assets/icon/materialTopTabNavigator/answer-page-false.png');
                        break;
                    case 'SharePage':
                        iconPath = focused ? require('../assets/icon/materialTopTabNavigator/share-page-true.png') : require('../assets/icon/materialTopTabNavigator/share-page-false.png');
                        break;
                    case 'UserPage':
                        iconPath = focused ? require('../assets/icon/materialTopTabNavigator/user-page-true.png') : require('../assets/icon/materialTopTabNavigator/user-page-false.png');
                        break;
                    default:
                        iconPath = focused ? require('../assets/icon/materialTopTabNavigator/home-page-true.png') : require('../assets/icon/materialTopTabNavigator/home-page-false.png');
                    }
                    return <Image source={iconPath} style={[css.auto, { height: 20, width: 20, marginTop: -3 }]} />;
                },
            })}
            tabBarOptions={{
                showIcon: true, // 是否显示标签图标
                activeTintColor: '#2D2D2D', // 活动标签的标签和图标颜色
                inactiveTintColor: '#666666', // 非活动标签的标签和图标颜色
                pressColor: '#ffffff', // 波纹的颜色
                labelStyle: { fontSize: 10, marginTop: -5 }, // 标签的样式
                style: { // 标签栏的样式
                    height: 50,
                    borderTopWidth: 1,
                    borderTopColor: '#D7D7D7'
                },
                indicatorStyle: {
                    height: 0,
                    width: 0
                }
            }}
        >
            <Tab.Screen name="HomePage" component={HomePage} options={{ title: '做单' }}/>
            <Tab.Screen name="AnswerPage" component={AnswerPage} options={{ title: '答题' }}/>
            <Tab.Screen name="SharePage" component={SharePage} options={{ title: '躺赚' }}/>
            <Tab.Screen name="UserPage" component={UserPage} options={{ title: '我的' }}/>
        </Tab.Navigator>
    );
}
