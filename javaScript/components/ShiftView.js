import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, LayoutAnimation, NativeModules, Animated, Easing } from 'react-native';
import PropTypes from 'prop-types';
/**
 * <ShiftView startSite={[0,0]} endSite={[0,0]} duration={1000} delay={1000}/>
 * **/
export default class ShiftView extends Component {
    constructor (props) {
        super(props);
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
                duration: 100,
                delay: this.delay,
                useNativeDriver: true,
                easing: Easing.ease,
            }),
            Animated.timing(this.modelOpacity, {
                toValue: 0,
                duration: 200,
                delay: this.duration - 600,
                useNativeDriver: true,
                easing: Easing.ease,
            })
        ];
        this.transformXStart = [
            Animated.timing(this.translateX, {
                toValue: this.props.endSite[0] - this.props.startSite[0],
                duration: this.duration,
                delay: this.delay,
                useNativeDriver: true,
                easing: Easing.ease,
            })
        ];
        this.transformYStart = [
            Animated.timing(this.translateY, {
                toValue: this.props.endSite[1] - this.props.startSite[1],
                duration: this.duration,
                delay: this.delay,
                useNativeDriver: true,
                easing: Easing.ease,
            })
        ];
    }

    componentDidMount () {
        Animated.parallel([Animated.sequence(this.opacityStart), Animated.sequence(this.transformXStart), Animated.sequence(this.transformYStart)]).start(() => {});
    }

    render () {
        return <Animated.View style={[{ left: this.left, top: this.top, opacity: this.modelOpacity, transform: [{ translateX: this.translateX }, { translateY: this.translateY }] }]}>
            {this.props.children}
        </Animated.View>;
    }
}
ShiftView.propTypes = {
    startSite: PropTypes.array,
    endSite: PropTypes.array
};
ShiftView.defaultProps = {
    startSite: [100, 100],
    endSite: [200, 200],
    delay: 1000,
    duration: 1000,
};
const styles = StyleSheet.create({});
