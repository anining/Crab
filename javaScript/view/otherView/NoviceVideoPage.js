import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';
import Video from 'react-native-video';
import { NOVICE_VIDEO } from '../../utils/data';
import loadingJson from '../../lottie/loading';
import LottieView from 'lottie-react-native';
import { css } from '../../assets/style/css';
import { _if } from '../../utils/util';
import { bindData, getPath } from '../../global/global';
import { N } from '../../utils/router';
export default class NoviceVideoPage extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.state = {
            play: false,
            user: bindData('user', this)
        };
    }

    async _end () {
        asyncStorage.setItem(`NEW_USER_TASK_TYPE3${getPath(['user_id'], this.state.user, 0)}`, 'true');
        DeviceEventEmitter.emit('reloadAnswer');
        N.goBack();
    }

    _onload () {
        this.setState({
            play: true
        });
    }

    render () {
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
            <Video source={{ uri: NOVICE_VIDEO }}
                ref={(ref) => { this.player = ref; }}
                controls = {false}
                disableFocus = {true}
                posterResizeMode={'center'}
                resizeMode={'contain'}
                onLoad={() => {
                    this._onload();
                }}
                onEnd={async () => {
                    await this._end();
                }}
                style={styles.backgroundVideo} />
        </View>;
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
