import React from 'react';
import { Dimensions, SafeAreaView } from 'react-native';
import { css } from '../../assets/style/css';
import { getter } from '../../utils/store';
import HTML from 'react-native-render-html';

const { width } = Dimensions.get('window');

export default function PrivacyPolicyPage () {
    const { privacy } = getter(['app.privacy']);

    return (
        <SafeAreaView style={[css.safeAreaView, css.RichText]}>
            <HTML html={privacy.get()} imagesMaxWidth={width} tagsStyles={{ p: { lineHeight: 24 } }}/>
        </SafeAreaView>
    );
}
