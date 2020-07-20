import React, { useEffect } from 'react';
import { SafeAreaView, Dimensions, ScrollView } from 'react-native';
import HTMLView from 'react-native-htmlview';
import { css } from '../../assets/style/css';
import { N } from '../../utils/router';
import { userDataHtml } from '../../assets/html/user';
import { trimNewLines } from '../../utils/util';

function UserAgreementPage () {
    useEffect(() => {
        // N.replace('WebViewPage', { url: userDataHtml, title: '用户协议' });
    }, []);

    return (
        <SafeAreaView style={[css.safeAreaView, css.RichText]}>
            <ScrollView>
                <HTMLView value={trimNewLines(userDataHtml)} stylesheet={{ p: { lineHeight: 24 } }}/>
            </ScrollView>
        </SafeAreaView>
    );
}

export default UserAgreementPage;
