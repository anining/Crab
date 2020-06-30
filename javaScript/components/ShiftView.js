import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    LayoutAnimation,
    NativeModules,
    Animated,
    Easing,
    UIManager,
    Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { css } from '../assets/style/css';
import { _tc, setAndroidTime } from '../utils/util';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
/**
 * <ShiftView startSite={[0,0]} endSite={[0,0]} duration={1000} delay={1000}/>
 * **/
export default class ShiftView extends Component {
    constructor (props) {
        super(props);
        this.animation = null;
        this.callback = this.props.callback;
        this._stop = false;
        this.autoPlay = this.props.autoPlay;
        this.loop = this.props.loop;
        this.style = this.props.style;
        this.left = this.props.startSite[0];
        this.top = this.props.startSite[1];
        this.duration = this.props.duration;
        this.delay = this.props.delay;
        this.modelOpacity = new Animated.Value(0);
        this.translateX = new Animated.Value(0);
        this.translateY = new Animated.Value(0);
        this.opacityStart = [
            Animated.timing(this.modelOpacity, {
                toValue: 1,
                duration: 50,
                delay: this.delay,
                useNativeDriver: true,
                easing: Easing.linear,
            }),
            Animated.timing(this.modelOpacity, {
                toValue: 0,
                duration: this.duration - 50,
                delay: 0,
                useNativeDriver: true,
                easing: Easing.linear,
            }),
        ];
        this.transformXStart = [
            Animated.timing(this.translateX, {
                toValue: this.props.endSite[0] - this.props.startSite[0],
                duration: this.duration,
                delay: this.delay,
                useNativeDriver: true,
                easing: Easing.linear,
            }),
            Animated.timing(this.translateX, {
                toValue: 0,
                duration: 0,
                delay: 100,
                useNativeDriver: true,
                easing: Easing.linear,
            }),
        ];
        this.transformYStart = [
            Animated.timing(this.translateY, {
                toValue: this.props.endSite[1] - this.props.startSite[1],
                duration: this.duration,
                delay: this.delay,
                useNativeDriver: true,
                easing: Easing.linear,
            }),
            Animated.timing(this.translateY, {
                toValue: 0,
                duration: 0,
                delay: 100,
                useNativeDriver: true,
                easing: Easing.linear,
            }),
        ];
    }

    componentDidMount () {
        this.autoPlay && this.start();
    }

    componentWillMount () {
        this.stop();
    }

    start () {
        this.animation && this.animation.stop();
        this._animationStart();
    }

    _animationStart () {
        requestAnimationFrame(() => {
            this.animation = Animated.parallel([Animated.sequence(this.opacityStart), Animated.sequence(this.transformXStart), Animated.sequence(this.transformYStart)]).start(() => {
                if (this.loop && this.duration) {
                    this.start();
                }
            });
            setAndroidTime(() => {
                _tc(() => { this.callback && this.callback(); });
            }, this.duration - 100);
        });
    }

    stop () {
        this.animation && (() => {
            this.animation.stop();
            this.animation = null;
        })();
    }

    render () {
        return <Animated.View style={[css.pa, {
            ...this.style,
            left: this.left,
            top: this.top,
            opacity: this.modelOpacity,
            transform: [{ translateX: this.translateX }, { translateY: this.translateY }],
            zIndex: 999,
        }]}>
            {this.props.children}
        </Animated.View>;
    }
}
ShiftView.propTypes = {
    startSite: PropTypes.array,
    endSite: PropTypes.array,
    style: PropTypes.object,
    loop: PropTypes.bool,
    delay: PropTypes.number,
    duration: PropTypes.number,
    autoPlay: PropTypes.bool,
    callback: PropTypes.func,
};
ShiftView.defaultProps = {
    startSite: [100, 100],
    endSite: [200, 200],
    delay: 0,
    duration: 400,
    style: {},
    loop: false,
    autoPlay: false,
    callback: () => {},
};
const styles = StyleSheet.create({});
