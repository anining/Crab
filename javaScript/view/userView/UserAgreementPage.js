import React from 'react';
import { SafeAreaView, Dimensions, ScrollView } from 'react-native';
import HTML from 'react-native-render-html';
import { css } from '../../assets/style/css';
import { AGREEMENT } from '../../utils/data';

const { width } = Dimensions.get('window');

function UserAgreementPage () {
    return (
        <SafeAreaView style={[css.safeAreaView, css.RichText]}>
            <ScrollView>
                <HTML html={AGREEMENT} imagesMaxWidth={width} tagsStyles={{ p: { lineHeight: 24 } }}/>
            </ScrollView>
        </SafeAreaView>
    );
}

export default UserAgreementPage;
