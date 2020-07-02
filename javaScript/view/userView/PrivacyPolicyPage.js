import React from 'react';
import { Dimensions, SafeAreaView, ScrollView } from 'react-native';
import { css } from '../../assets/style/css';
import HTML from 'react-native-render-html';
import { PRIVACY } from '../../utils/data';

const { width } = Dimensions.get('window');

function PrivacyPolicyPage () {
    return (
        <SafeAreaView style={[css.safeAreaView, css.RichText]}>
            <ScrollView>
                <HTML html={PRIVACY} imagesMaxWidth={width} tagsStyles={{ p: { lineHeight: 24 } }}/>
            </ScrollView>
        </SafeAreaView>
    );
}

export default PrivacyPolicyPage;
