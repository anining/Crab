import React from 'react';
import { Dimensions, SafeAreaView, ScrollView } from 'react-native';
import { css } from '../../assets/style/css';
import HTML from 'react-native-render-html';

const { width } = Dimensions.get('window');
export default function HelpCenterDetailPage (props) {
    return (
        <SafeAreaView style={[css.safeAreaView, css.RichText]}>
            <ScrollView >
                <HTML html={props.route.params.content} imagesMaxWidth={width} tagsStyles={{ p: { lineHeight: 24 } }}/>
            </ScrollView>
        </SafeAreaView>
    );
}
