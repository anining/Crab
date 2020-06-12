import React from 'react';
import {DeviceEventEmitter, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {css} from '../../assets/style/css';
import {N} from '../../utils/router';
import * as U from 'karet.util';
import store from '../../utils/store';

export default function UserPage() {
  return (
    <SafeAreaView style={css.safeAreaView}>
      <Text>UserPage</Text>
      <TouchableOpacity onPress={() => {
        DeviceEventEmitter.emit('loadingShow');
      }}>
        <Text>btn</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        DeviceEventEmitter.emit('loadingHidden');
      }}>
        <Text>btn2</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        const authorization = U.view(['authorization'], store);
        N.navigate('TaskDetailPage');
        U.set(authorization, Math.random());
        console.log(authorization.get());
        N.navigate('TaskDetailPage');
      }} style={{height: 50, width: 100, backgroundColor: 'blue'}} />
    </SafeAreaView>
  );
}
