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
export default class OpacityView extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(1),
        };
        this.style = this.props.style;
        this.opacityShow = [
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 500,
                delay: 0,
                useNativeDriver: true,
                easing: Easing.ease,
            })
        ];
        this.opacityHide = [
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 200,
                delay: 0,
                useNativeDriver: true,
                easing: Easing.ease,
            })
        ];
    }

    // componentWillUnmount () {
    //     this.animationShow && this.animationShow.stop();
    //     this.animationHide && this.animationHide.stop();
    // }

    show () {
        Animated.sequence(this.opacityShow).start();
    }

    hide () {
        Animated.sequence(this.opacityHide).start();
    }

    render () {
        return <Animated.View style={[{
            ...this.style,
            opacity: this.state.opacity,
        }]}>
            {this.props.children}
        </Animated.View>;
    }
}
OpacityView.propTypes = {
    style: PropTypes.object,
};
OpacityView.defaultProps = {
    style: {},
};
const styles = StyleSheet.create({});
