import React from 'react';
import {DeviceEventEmitter, NativeModules, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {generalStyle} from '../../assets/style/generalStyle';

export default function HomePage() {
  // console.log(NativeModules.ChannelModule && NativeModules.ChannelModule.getChannel());
  return (
    <SafeAreaView style={generalStyle.safeAreaView}>
      <Text>HomePage</Text>
    </SafeAreaView>
  );
}
