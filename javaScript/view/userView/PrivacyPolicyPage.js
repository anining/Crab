import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { css } from '../../assets/style/css';

export default function PrivacyPolicyPage () {
    return (
        <SafeAreaView style={[css.safeAreaView, css.RichText]}>
            <Text>PrivacyPolicyPage</Text>
        </SafeAreaView>
    );
}
