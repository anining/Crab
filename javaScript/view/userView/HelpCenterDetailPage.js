import React from 'react';
import { SafeAreaView, Text, ScrollView } from 'react-native';
import { css } from '../../assets/style/css';

export default function HelpCenterDetailPage (props) {
    return (
        <SafeAreaView style={[css.safeAreaView, css.RichText]}>
            <ScrollView >
                <Text>{props.route.params.detail}</Text>
            </ScrollView>
        </SafeAreaView>
    );
}
