import React, { Component } from 'react';
import {
    StyleSheet,
    Animated,
    Easing,
    UIManager,
    Platform,
} from 'react-native';
import PropTypes from 'prop-types';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
export default class EnlargeView extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.style = this.props.style;
        this.state = {
            scale: new Animated.Value(1),
        };
        // this.scale = new Animated.Value(1);
        this.scaleStart = [
            Animated.timing(this.state.scale, {
                toValue: 1.15,
                duration: 150,
                delay: 0,
                useNativeDriver: true,
                easing: Easing.ease,
            }),
            Animated.timing(this.state.scale, {
                toValue: 1,
                duration: 150,
                delay: 0,
                useNativeDriver: true,
                easing: Easing.ease,
            }),
        ];
    }

    componentWillUnmount () {
        this.animation && this.animation.stop();
    }

    start () {
        this.animation = Animated.sequence(this.scaleStart).start(() => {
            this.animation && this.animation.stop();
        });
    }

    render () {
        return <Animated.View style={[{
            transform: [{ scale: this.state.scale }],
            ...this.style,
        }]}>
            {this.props.children}
        </Animated.View>;
    }
}
EnlargeView.propTypes = {
    style: PropTypes.object,
};
EnlargeView.defaultProps = {
    style: {},
};
const styles = StyleSheet.create({});
