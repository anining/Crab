import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { css } from '../assets/style/css';
import ImageAuto from './ImageAuto';

export default class ComTitle extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    _buildWidth () {
        try {
            return this.props.title.length * 19;
        } catch (e) {
            return 100;
        }
    }

    render () {
        return (
            <View style={[styles.titleWrap, css.pr]}>
                <Text style={styles.title}>
                    {this.props.title || '默认标题'}
                    {this.props.minTitle}
                </Text>
                <View style={[styles.redB, {
                    backgroundColor: this.props.decorateColor || 'rgba(255, 108, 0, .3)',
                    width: this._buildWidth()
                }]}/>
                {/* <View> */}
                {/*    <ImageAuto source={}/> */}
                {/* </View> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    minTitle: {
        color: '#999999',
        fontSize: 12,
    },
    redB: {
        bottom: 4,
        height: 8,
        left: 0,
        position: 'absolute',
        right: 0,
        zIndex: -2,
    },
    title: {
        color: '#353535',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 1,
        lineHeight: 30,
    },
    // titleWrap: {
    //     height: 25,
    //     marginVertical: 8,
    //     position: 'relative',
    // },
});
