import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import HomePage from '../view/tabView/HomePage';
import UserPage from '../view/tabView/UserPage';
import ActivityPage from '../view/tabView/ActivityPage';
import SharePage from '../view/tabView/SharePage';

const Tab = createMaterialTopTabNavigator();

export default function MaterialTopTabNavigator() {
  return (
    <Tab.Navigator tabBarPosition="bottom">
      <Tab.Screen name="HomePage" component={HomePage} />
      <Tab.Screen name="ActivityPage" component={ActivityPage} />
      <Tab.Screen name="SharePage" component={SharePage} />
      <Tab.Screen name="UserPage" component={UserPage} />
    </Tab.Navigator>
  );
}
