import React, { Component } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { css } from '../../assets/style/css';
import Slider from '../../components/Slider';
const { height, width } = Dimensions.get('window');
export default class AnswerPage extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render () {
        return <SafeAreaView style={css.safeAreaView}>
            <Slider height={width * 0.35} autoplay={true}/>
        </SafeAreaView>;
    }
}
