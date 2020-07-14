import React, { Component } from 'react';

import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { css } from '../../assets/style/css';
import HTML from 'react-native-render-html';
import Video from 'react-native-video';
import { getter } from '../../utils/store';
import { helpCenterDetail } from '../../utils/api';
import LottieView from 'lottie-react-native';
import loadingJson from '../../lottie/loading';
import { _if } from '../../utils/util';
import { getPath } from '../../global/global';

const { width } = Dimensions.get('window');

const { user_id } = getter(['user.user_id']);
export default class HelpCenterDetailPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            helpInfo: null,
            play: false
        };
    }

    async componentDidMount () {
        const { video_url: uri } = this.props.route.params;
        if (!uri) {
            await this._getHelpDetail();
        }
    }

    async _getHelpDetail () {
        try {
            const { help_center_id } = this.props.route.params;
            console.log(help_center_id);
            const ret = await helpCenterDetail(help_center_id);
            if (ret && !ret.error) {
                this.setState({
                    helpInfo: ret.data
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    render () {
        const { video_url: uri } = this.props.route.params;
        if (uri) {
            return <View style={[{ flex: 1 }]}>
                {_if(!this.state.play, res => <View style={[css.flex, css.pr, css.fw,]}>
                    <LottieView
                        style={[{ width: 200 }]}
                        source={loadingJson}
                        imageAssetsFolder={'loading'}
                        autoPlay={true}
                        loop={true}
                    />
                    <Text style={styles.loadingText}>视频正在加载中，请耐心等候...</Text>
                </View>)}
                <Video source={{ uri: uri }}
                    controls = {true}
                    disableFocus = {true}
                    posterResizeMode={'center'}
                    resizeMode={'contain'}
                    onLoad={() => {
                        this.setState({
                            play: true
                        });
                    }}
                    style={styles.backgroundVideo} />
            </View>;
        }
        if (this.state.helpInfo) {
            return <SafeAreaView style={[css.safeAreaView, css.RichText]}>
                <ScrollView style={{ flex: 1 }}>
                    <HTML html={getPath(['content'], this.state.helpInfo, '暂无内容')} imagesMaxWidth={width} tagsStyles={{ p: { lineHeight: 25 } }}/>
                </ScrollView>
            </SafeAreaView>;
        } else {
            return <View style={[css.flex, css.pr, css.fw]}>
                <LottieView
                    style={[{ width: 200 }]}
                    source={loadingJson}
                    imageAssetsFolder={'loading'}
                    autoPlay={true}
                    loop={true}
                />
                <Text style={styles.loadingText}>详情正在加载中，请耐心等候...</Text>
            </View>;
        }
    }
}

const styles = StyleSheet.create({
    backgroundVideo: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    loadingText: {
        color: '#e1852b',
        fontSize: 15,
        textAlign: 'center',
        width: '100%'
    }
});
