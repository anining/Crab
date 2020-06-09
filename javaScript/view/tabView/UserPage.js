import React from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {generalStyle} from '../../assets/style/generalStyle';
import {N} from '../../utils/router';

export default function UserPage() {
  return (
    <SafeAreaView style={generalStyle.safeAreaView}>
      <Text>UserPage</Text>
      <TouchableOpacity onPress={() => {
        N.navigate('TaskDetailPage');
      }} style={{height: 50, width: 100, backgroundColor: 'blue'}} />
    </SafeAreaView>
  );
}
