import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import {generalStyle} from '../../assets/style/generalStyle';

export default function HomePage() {
  return (
    <SafeAreaView style={generalStyle.safeAreaView}>
      <Text>HomePage</Text>
    </SafeAreaView>
  );
}
