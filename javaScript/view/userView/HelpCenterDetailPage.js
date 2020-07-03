import React from 'react';
import { Dimensions, SafeAreaView, ScrollView } from 'react-native';
import { css } from '../../assets/style/css';
import HTML from 'react-native-render-html';
import Video from 'react-native-video';

const { width } = Dimensions.get('window');

function HelpCenterDetailPage (props) {
    const { video_url: uri, content } = props.route.params;

    if (uri) {
        return (
            <SafeAreaView style={[css.safeAreaView, { position: 'relative' }]}>
                <Video
                    source={{ uri }}
                    controls={true}
                    posterResizeMode={'center'}
                    resizeMode={'contain'}
                    style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }} />
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={[css.safeAreaView, css.RichText]}>
            <ScrollView >
                <HTML html={content} imagesMaxWidth={width} tagsStyles={{ p: { lineHeight: 25 } }}/>
            </ScrollView>
        </SafeAreaView>
    );
}

export default HelpCenterDetailPage;
