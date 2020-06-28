import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { css } from '../../assets/style/css';

function NoticeDetailPage (props) {
    return (
        <SafeAreaView style={[css.safeAreaView, { padding: 15 }]}>
            <Text style={{ lineHeight: 25 }}>{props.route.params.content || ''}</Text>
        </SafeAreaView>
    );
}

export default NoticeDetailPage;
