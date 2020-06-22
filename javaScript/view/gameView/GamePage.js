import React, { Component } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { css } from '../../assets/style/css';
export default class GamePage extends Component {
    componentDidMount () {
    }

    render () {
        return <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#FED465' }]}>
            <Text>321</Text>
        </SafeAreaView>;
    }
}
