import React, { PureComponent } from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    LayoutAnimation,
    NativeModules,
    Animated,
    Easing,
    UIManager,
    Platform, InteractionManager, findNodeHandle
} from 'react-native';
import PropTypes from 'prop-types';
import { css } from '../assets/style/css';
import { _debounce, _tc, setAndroidTime } from '../utils/util';
import { bindData } from '../global/global';
let BindingX;
const { height, width, scale } = Dimensions.get('window');
if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
    BindingX = require('react-native-bindingx');
}
/**
 * <ShiftView startSite={[0,0]} endSite={[0,0]} duration={1000} delay={1000}/>
 * **/
export default class ShiftView extends PureComponent {
    constructor (props) {
        super(props);
        this.state = {
            highPerformance: bindData('highPerformance', this)
        };
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
        this.debounceAnimationStart = null;
        this.translateX = this.props.endSite[0] - this.props.startSite[0];
        this.translateY = this.props.endSite[1] - this.props.startSite[1];
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
        this.debounceAnimationStart = _debounce(() => {
            this._animationStart();
        }, 100);
        this.debounceCallBack = _debounce(() => {
            this.callback && this.callback();
            this.clearBindTiming();
        }, 100);
    }

    componentWillMount () {
        try {
            this._stop = true;
            this.animation && (() => {
                this.animation.stop();
                this.animation = null;
            })();
            this.clearBindTiming();
        } catch (e) {
            console.log(e);
        }
    }

    start () {
        this._stop = false;
        this.debounceAnimationStart && this.debounceAnimationStart();
    }

    clearBindTiming () {
        try {
            BindingX && this.gesToken && (() => {
                BindingX.unbind({
                    eventType: 'timing',
                    token: this.gesToken
                });
                this.gesToken = null;
            })();
            this._shiftView && this._shiftView.setNativeProps({
                style: { opacity: 0 },
            });
        } catch (e) {
            console.log(e, 'clearBindTiming');
        }
    }

    _reactNativeMove () {
        try {
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
        } catch (e) {
            console.log(e, '_reactNativeMove');
        }
    }

    androidMove () {
        try {
            if (BindingX) {
                this.clearBindTiming();
                const duration = Math.abs(this.duration);
                const exit = `t>${duration}`;
                const anchor = findNodeHandle(this._shiftView);
                const gesTokenObj = BindingX.bind(
                    {
                        eventType: 'timing',
                        exitExpression: exit,
                        props: [
                            {
                                element: anchor,
                                property: 'transform.translateX',
                                expression: `easeInSine(t,0,${this.translateX * scale},${duration})`
                            },
                            {
                                element: anchor,
                                property: 'transform.translateY',
                                expression: `easeInSine(t,0,${this.translateY * scale},${duration})`
                            },
                            {
                                element: anchor,
                                property: 'opacity',
                                expression: 't<100?t/100*1):1',
                            }
                        ]
                    }, (e) => {
                        if (e && (e.state === 'end' || e.state === 'exit')) {
                            this.debounceCallBack();
                        }
                    });
                this.gesToken = gesTokenObj.token;
            } else {
                this._reactNativeMove();
            }
        } catch (e) {
            this._reactNativeMove();
        }
    }

    _animationStart () {
        try {
            InteractionManager.runAfterInteractions(() => {
                if (!this._stop) {
                    if (!this.state.highPerformance) {
                        this.nowTimer1 && this.nowTimer1.stop();
                        this.nowTimer2 && this.nowTimer2.stop();
                        this.androidMove();
                    } else {
                        this.nowTimer1 = setAndroidTime(() => {
                            _tc(() => {
                                this.callback && this.callback();
                            });
                        }, Math.abs(this.duration - 100));
                    }
                    if (this.loop && this.duration && !this._stop && this.loopTime) {
                        this.nowTimer2 = setAndroidTime(() => {
                            !this._stop && this._animationStart();
                        }, this.duration + this.loopTime);
                    }
                }
            });
        } catch (e) {
            console.log(e, '_animationStart');
        }
    }

    stop () {
        try {
            this._stop = true;
            this.clearBindTiming();
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
