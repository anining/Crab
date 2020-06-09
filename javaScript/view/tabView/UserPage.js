import React from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {generalStyle} from '../../assets/style/generalStyle';
import {N} from '../../utils/router';
import * as U from 'karet.util';
import store from '../../utils/store';

export default function UserPage() {
  return (
    <SafeAreaView style={generalStyle.safeAreaView}>
      <Text>UserPage</Text>
      <TouchableOpacity onPress={() => {
        const authorization = U.view(['authorization'], store);
        U.set(authorization, 'sdhasdhajsdhalshjalsdhasd');
        console.log(authorization.get());
        console.log(N);
        // N.navigate('TaskDetailPage');
      }} style={{height: 50, width: 100, backgroundColor: 'blue'}} />
    </SafeAreaView>
  );
}
