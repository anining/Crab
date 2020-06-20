import * as React from 'karet';
import { Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomePage from '../view/tabView/HomePage';
import UserPage from '../view/tabView/UserPage';
import AnswerPage from '../view/tabView/AnswerPage';
import SharePage from '../view/tabView/SharePage';
import { proxyRouter } from '../utils/router';
import { css } from '../assets/style/css';
import icon1 from '../assets/icon/tab/tab1.png';
import icon2 from '../assets/icon/tab/tab2.png';
import icon3 from '../assets/icon/tab/tab3.png';
import icon4 from '../assets/icon/tab/tab4.png';
import icon5 from '../assets/icon/tab/tab5.png';
import icon6 from '../assets/icon/tab/tab6.png';
import icon7 from '../assets/icon/tab/tab7.png';
import icon8 from '../assets/icon/tab/tab8.png';

const Tab = createMaterialTopTabNavigator();

export default function TabNavigator ({ navigation }) {
    proxyRouter(navigation, ['MaterialTopTabNavigator', 'LoginPage'], 'VerificationStackNavigator');
    return (
        <Tab.Navigator
            tabBarPosition="bottom"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    let iconPath;
                    switch (route.name) {
                    case 'HomePage':
                        iconPath = focused ? icon4 : icon3;
                        break;
                    case 'AnswerPage':
                        iconPath = focused ? icon2 : icon1;
                        break;
                    case 'SharePage':
                        iconPath = focused ? icon6 : icon5;
                        break;
                    default:
                        iconPath = focused ? icon8 : icon7;
                    }
                    return <Image source={iconPath} style={[css.auto, { height: 20, width: 20, marginTop: -3 }]}/>;
                },
            })}
            tabBarOptions={{
                // 是否显示标签图标
                showIcon: true,
                // 活动标签的标签和图标颜色
                activeTintColor: '#2D2D2D',
                // 非活动标签的标签和图标颜色
                inactiveTintColor: '#666',
                // 波纹的颜色
                pressColor: '#fff',
                // 标签的样式
                labelStyle: { fontSize: 10, marginTop: -5 },
                // 标签栏的样式
                style: {
                    height: 50,
                    borderTopWidth: 1,
                    borderTopColor: '#efefef',
                },
                indicatorStyle: {
                    height: 0,
                    width: 0,
                },
            }}
        >
            <Tab.Screen name="HomePage" component={HomePage} options={{ title: '主页' }}/>
            <Tab.Screen name="AnswerPage" component={AnswerPage} options={{ title: '活动' }}/>
            <Tab.Screen name="SharePage" component={SharePage} options={{ title: '躺赚' }}/>
            <Tab.Screen name="UserPage" component={UserPage} options={{ title: '我的' }}/>
        </Tab.Navigator>
    );
}
