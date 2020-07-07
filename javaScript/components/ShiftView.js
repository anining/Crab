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
        this.loopTime = this.props.loopTime;
        this.style = this.props.style;
        this.left = this.props.startSite[0];
        this.top = this.props.startSite[1];
        this.duration = this.props.duration;
        this.delay = this.props.delay;
    }

    componentDidMount () {
        this.autoPlay && this.start();
        this.customLayoutAnimation = {
            duration: this.duration,
            create: {
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.scaleXY,
            },
            update: {
                type: LayoutAnimation.Types.linear,
            },
            delete: {
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.scaleXY,
            },
        };
    }

    componentWillMount () {
        this._stop = true;
        this.animation && (() => {
            this.animation.stop();
            this.animation = null;
        })();
    }

    start () {
        this._stop = false;
        this._animationStart();
    }

    _animationStart () {
        this._shiftView && this._shiftView.setNativeProps({
            style: { left: this.props.endSite[0], top: this.props.endSite[1], opacity: 1 },
        });
        LayoutAnimation.configureNext(this.customLayoutAnimation);
        setAndroidTime(() => {
            _tc(() => {
                this.callback && this.callback();
            });
            this._shiftView && this._shiftView.setNativeProps({
                style: { left: this.props.startSite[0], top: this.props.startSite[1], opacity: 0 },
            });
        }, Math.abs(this.duration - 100));
        if (this.loop && this.duration && !this._stop && this.loopTime) {
            setAndroidTime(() => {
                !this._stop && this._animationStart();
            }, this.duration + this.loopTime);
        }
    }

    stop () {
        this._stop = true;
        this.animation && (() => {
            this.animation.stop();
            this.animation = null;
        })();
    }

    render () {
        return <View ref={ref => this._shiftView = ref} style={[css.pa, {
            ...this.style,
            left: this.left,
            top: this.top,
            opacity: 0,
            zIndex: 999,
        }]}>
            {this.props.children}
        </View>;
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
    callback: () => {
    },
    loopTime: 1000,
};
const styles = StyleSheet.create({});
