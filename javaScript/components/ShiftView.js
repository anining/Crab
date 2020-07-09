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
import { _debounce, _tc, setAndroidTime } from '../utils/util';

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
        this.nowTimer1 = null;
        this.nowTimer2 = null;
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

    componentDidMount () {
        this.autoPlay && this.start();
        this.debounceAnimationStart = _debounce(() => {
            this._animationStart();
        }, 500);
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
        this.debounceAnimationStart();
    }

    _animationStart () {
        if (!this._stop) {
            this.nowTimer1 && this.nowTimer1.stop();
            this.nowTimer2 && this.nowTimer2.stop();
            this._shiftView && this._shiftView.setNativeProps({
                style: { left: this.props.endSite[0], top: this.props.endSite[1], opacity: 1 },
            });
            LayoutAnimation.configureNext(this.customLayoutAnimation);
            this.nowTimer1 = setAndroidTime(() => {
                _tc(() => {
                    this.callback && this.callback();
                });
                this._shiftView && this._shiftView.setNativeProps({
                    style: { left: this.props.startSite[0], top: this.props.startSite[1], opacity: 0 },
                });
            }, Math.abs(this.duration - 100));
            if (this.loop && this.duration && !this._stop && this.loopTime) {
                this.nowTimer2 = setAndroidTime(() => {
                    !this._stop && this._animationStart();
                }, this.duration + this.loopTime);
            }
        }
    }

    stop () {
        try {
            this._stop = true;
            this.nowTimer1 && this.nowTimer1.stop();
            this.nowTimer2 && this.nowTimer2.stop();
            this.animation && (() => {
                this.animation.stop();
                this.animation = null;
            })();
        } catch (e) {
            console.log(e);
        }
    }

    render () {
        return <View ref={ref => this._shiftView = ref} style={[css.pa, {
            ...this.style,
            left: this.left,
            top: this.top,
            opacity: 0,
            zIndex: 999,
        }]}>
            {/*    onLayout={(e) => { */}
            {/*    this.props.onLoad && this.props.onLoad(); */}
            {/* }} */}
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
    onLoad: PropTypes.func,
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
    onLoad: () => {},
};
const styles = StyleSheet.create({});
