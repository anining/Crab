import React, { useEffect } from 'react';
import { Dimensions, SafeAreaView, ScrollView } from 'react-native';
import { css } from '../../assets/style/css';
import { N } from '../../utils/router';
import { privacyDataHtml } from '../../assets/html/privacy';
import HTMLView from 'react-native-htmlview';
import { trimNewLines } from '../../utils/util';

function PrivacyPolicyPage () {
    useEffect(() => {
        // N.replace('WebViewPage', { url: privacyDataHtml, title: '隐私协议' });
    }, []);
    return (
        <SafeAreaView style={[css.safeAreaView, css.RichText]}>
            <ScrollView>
                <HTMLView value={trimNewLines(privacyDataHtml)} stylesheet={{ p: { lineHeight: 24 } }}/>
            </ScrollView>
        </SafeAreaView>
    );
}

export default PrivacyPolicyPage;
