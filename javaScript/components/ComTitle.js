import React, { Component } from 'react';
import { Text, StyleSheet, View, LayoutAnimation, Platform, UIManager, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import { css } from '../assets/style/css';
import ImageAuto from './ImageAuto';
import activity19 from '../assets/icon/activity/activity19.png';
import PropTypes from 'prop-types';
import { _if, setAndroidTime } from '../utils/util';
if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
const animationTime = 600;
export default class ComTitle extends Component {
    constructor (props) {
        super(props);
        this.state = {
            str: ''
        };
        this.popTipsWrapRef = null;
        this.customLayoutAnimation = {
            duration: animationTime,
            create: {
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity,
            },
            delete: {
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity,
            },
        };
    }

    componentDidMount () {
        if (this.props.emitterKey) {
            this.emitterKeyEmitter = DeviceEventEmitter.addListener('comTitlePop', ({ key, str }) => {
                if (key === this.props.emitterKey) {
                    this.setState({ str }, () => {
                        this.popTipsWrapRef && this.popTipsWrapRef.setNativeProps({
                            style: { opacity: 1 },
                        });
                        LayoutAnimation.configureNext(this.customLayoutAnimation);
                    });
                }
            });
        }
    }

    componentWillUnmount () {
        this.emitterKeyEmitter && this.emitterKeyEmitter.remove();
    }

    _buildWidth () {
        try {
            return this.props.title.length * 19;
        } catch (e) {
            return 100;
        }
    }

    render () {
        return (
            <View style={[styles.titleWrap, css.pr]}>
                <Text style={styles.title}>
                    {this.props.title || '默认标题'}
                    <Text style={{ ...css.sy }}>{this.props.minTitle}</Text>
                </Text>
                <View style={[styles.redB, {
                    backgroundColor: this.props.decorateColor || 'rgba(255, 108, 0, .3)',
                    width: this._buildWidth()
                }]}/>
                {_if(this.props.canTips, res => <TouchableOpacity style={[css.pa, styles.popPosition]} onPress={() => {
                    this.popTipsWrapRef && this.popTipsWrapRef.setNativeProps({
                        style: { opacity: 0 },
                    });
                    LayoutAnimation.configureNext(this.customLayoutAnimation);
                }}>
                    <View ref={ref => this.popTipsWrapRef = ref} style={[css.flex, styles.popTipsWrap]} >
                        <ImageAuto source={activity19} style={[{ width: 30 }]}/>
                        <Text style={styles.popTipsText} numberOfLines={1}>{this.state.str}</Text>
                    </View>
                </TouchableOpacity>)}
            </View>
        );
    }
}
ComTitle.propTypes = {
    canTips: PropTypes.bool,
    emitterKey: PropTypes.string,
};
ComTitle.defaultProps = {
    canTips: false,
    emitterKey: ''
};

const styles = StyleSheet.create({
    minTitle: {
        color: '#999999',
        fontSize: 12,
    },
    popPosition: {
        right: 0,
        top: 0,
        width: 'auto',
    },
    popTipsText: {
        color: '#fff',
        fontSize: 12,
        ...css.sy
    },
    popTipsWrap: {
        backgroundColor: 'rgba(0,0,0,.6)',
        borderRadius: 15,
        height: 30,
        opacity: 0,
        overflow: 'hidden',
        paddingHorizontal: 10,
        transform: [{ scale: 0.9 }, { translateY: -4 }],
        width: 'auto'
    },
    redB: {
        bottom: 4,
        height: 8,
        left: 0,
        position: 'absolute',
        right: 0,
        zIndex: -2,
    },
    title: {
        color: '#353535',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 1,
        lineHeight: 30,
    },
    // titleWrap: {
    //     height: 25,
    //     marginVertical: 8,
    //     position: 'relative',
    // },
});
