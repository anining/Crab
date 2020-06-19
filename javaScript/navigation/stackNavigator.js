import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../view/authView/LoginPage';
import Header from '../components/Header';

const Stack = createStackNavigator();

export default function StackNavigator () {
    return (
        <Stack.Navigator screenOptions={{ header: ({ scene, previous, navigation }) => <Header scene={scene} previous={previous} navigation={navigation} replace={true}/> }}>
            <Stack.Screen name="LoginPage" options={{ title: '登录' }} component={LoginPage} />
        </Stack.Navigator>
    );
}
