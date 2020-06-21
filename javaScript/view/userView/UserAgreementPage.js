import React from 'react';
import { SafeAreaView, Dimensions } from 'react-native';
import HTML from 'react-native-render-html';
import { css } from '../../assets/style/css';
import { getter } from '../../utils/store';

const { width } = Dimensions.get('window');
export default function UserAgreementPage () {
    const { agreement } = getter(['app.agreement']);

    return (
        <SafeAreaView style={[css.safeAreaView, css.RichText]}>
            <HTML html={agreement.get()} imagesMaxWidth={width} tagsStyles={{ p: { lineHeight: 24 } }}/>
        </SafeAreaView>
    );
}
