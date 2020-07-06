import React from 'react';
import { Dimensions, SafeAreaView, ScrollView } from 'react-native';
import { css } from '../../assets/style/css';
import HTML from 'react-native-render-html';
import Video from 'react-native-video';
import asyncStorage from '../../utils/asyncStorage';
import { getter } from '../../utils/store';

const { width } = Dimensions.get('window');

const { user_id } = getter(['user.user_id']);

function HelpCenterDetailPage (props) {
    const { video_url: uri, content } = props.route.params;

    if (uri) {
        asyncStorage.setItem(`NEW_USER_TASK_TYPE1${user_id.get()}`, 'true');
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
