import React, { useEffect } from 'react';
import { SafeAreaView, Dimensions, ScrollView } from 'react-native';
import HTML from 'react-native-render-html';
import { css } from '../../assets/style/css';
import { N } from '../../utils/router';
import { userDataHtml } from '../../assets/html/user';

const { width } = Dimensions.get('window');

function UserAgreementPage () {
    useEffect(() => {
        // N.replace('WebViewPage', { url: userDataHtml, title: '用户协议' });
    }, []);
    return (
        <SafeAreaView style={[css.safeAreaView, css.RichText]}>
            <ScrollView>
                <HTML html={userDataHtml} imagesMaxWidth={width} tagsStyles={{ p: { lineHeight: 24 } }}/>
            </ScrollView>
        </SafeAreaView>
    );
}

export default UserAgreementPage;
