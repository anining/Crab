import React from 'react';
import {DeviceEventEmitter, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {generalStyle} from '../../assets/style/generalStyle';

export default function HomePage() {
  return (
    <SafeAreaView style={generalStyle.safeAreaView}>
      <Text>HomePage</Text>
    </SafeAreaView>
  );
}
