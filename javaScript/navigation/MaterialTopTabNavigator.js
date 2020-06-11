import * as React from 'karet';
import {Image} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import HomePage from '../view/tabView/HomePage';
import UserPage from '../view/tabView/UserPage';
import ActivityPage from '../view/tabView/ActivityPage';
import SharePage from '../view/tabView/SharePage';
import {proxyRouter} from '../utils/router';

const Tab = createMaterialTopTabNavigator();

export default function MaterialTopTabNavigator({navigation}) {
  proxyRouter(navigation, [], 'VerificationStackNavigator');
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let iconPath;
          switch (route.name) {
            case 'HomePage':
              iconPath = focused ? require('../assets/icon/header/header-return.png') : require('../assets/icon/header/header-return.png');
              break;
            case 'ActivityPage':
              iconPath = focused ? require('../assets/icon/header/header-return.png') : require('../assets/icon/header/header-return.png');
              break;
            case 'SharePage':
              iconPath = focused ? require('../assets/icon/header/header-return.png') : require('../assets/icon/header/header-return.png');
              break;
            case 'UserPage':
              iconPath = focused ? require('../assets/icon/header/header-return.png') : require('../assets/icon/header/header-return.png');
              break;
            default:
              iconPath = focused ? require('../assets/icon/header/header-return.png') : require('../assets/icon/header/header-return.png');
          }
          return <Image source={iconPath} style={{height: 15, width: 15}} />;
        },
      })}
      tabBarOptions={{
        showIcon: true,//是否显示标签图标
        activeTintColor: 'red',//活动标签的标签和图标颜色
        inactiveTintColor: 'blue',//非活动标签的标签和图标颜色
        pressColor: 'blue',//波纹的颜色
        labelStyle: {fontSize: 12},//标签的样式
        style: {height: 70},//标签栏的样式
      }}
    >
      <Tab.Screen name="HomePage" component={HomePage} />
      <Tab.Screen name="ActivityPage" component={ActivityPage} />
      <Tab.Screen name="SharePage" component={SharePage} />
      <Tab.Screen name="UserPage" component={UserPage} />
    </Tab.Navigator>
  );
}
