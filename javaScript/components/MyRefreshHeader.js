import React from 'react';
import {RefreshHeader, HeaderStatus} from './RefreshHeader';
import {
    ActivityIndicator,
    Animated,
    View,
    StyleSheet,
    Text,
} from 'react-native';
import LottieView from 'lottie-react-native';
import loadingJson from '../lottie/loading'

export class MyRefreshHeader extends RefreshHeader {
    constructor(props) {
        super(props);
    }

    static height = 80;

    static style = 'stickyContent';

    render() {
        let progress = this.props.offset.interpolate({
            inputRange: [-200, -150, -150, -100, -100, -50],
            outputRange: [1, 0, 1, 0, 1, 0],
        });
        if (this.state.status === 'refreshing') {
            progress = undefined;
        }
        return (
            <View style={{flex: 1}}>
                <LottieView
                    style={[{transform: [{scale: 1.1}]}]}
                    source={loadingJson}
                    progress={progress}
                    imageAssetsFolder={'loading'}
                    autoPlay={this.state.status === 'refreshing'}
                    loop={this.state.status === 'refreshing'}
                />
            </View>
        );
    }

    // _renderIcon() {
    //     const s = this.state.status;
    //     if (s === 'refreshing' || s === 'rebound') {
    //         return <ActivityIndicator color={'gray'}/>;
    //     }
    //     const {maxHeight, offset} = this.props;
    //     return (
    //         <Animated.Image
    //             source={require('../assets/other/arrow.png')}
    //             style={{
    //                 transform: [
    //                     {
    //                         rotate: offset.interpolate({
    //                             inputRange: [-maxHeight - 1 - 10, -maxHeight - 10, -50, -49],
    //                             outputRange: ['180deg', '180deg', '0deg', '0deg'],
    //                         }),
    //                     },
    //                 ],
    //                 width: 12,
    //                 height: 24,
    //             }}
    //         />
    //     );
    // }

    static renderContent() {
        return null;
    }

    getTitle() {
        const s = this.state.status;
        if (s === 'pulling' || s === 'waiting') {
            return '下拉开始刷新';
        } else if (s === 'pullingEnough') {
            return '开始刷新';
        } else if (s === 'refreshing') {
            return '加载中...';
        } else if (s === 'pullingCancel') {
            return '取消刷新';
        } else if (s === 'rebound') {
            return '加载完成';
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    rContainer: {
        marginLeft: 20,
    },
    text: {
        marginVertical: 5,
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        width: 140,
    },
});
