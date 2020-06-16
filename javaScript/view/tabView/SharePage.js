import React from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { css } from '../../assets/style/css';
import { N } from '../../utils/router';

export default function SharePage () {
    return (
        <SafeAreaView style={css.safeAreaView}>
            <TouchableOpacity onPress={() => {
                N.navigate('TaskDetailPage');
            }}>
                <Text style={{ lineHeight: 30, textAlign: 'center' }}>TaskDetailPage</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
