import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { css } from '../../assets/style/css';

export default class DailyRedPackagePage extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidMount () {
    }

    render () {
        return <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#f8f8f8' }]}>
        </SafeAreaView>;
    }
}
const styles = StyleSheet.create({

});
