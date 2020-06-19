import React, { Component } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View, ImageBackground } from 'react-native';
import { css } from '../../assets/style/css';
import ImageAuto from '../../components/ImageAuto';
import activity3 from '../../assets/icon/activity/activity3.png';
import activity4 from '../../assets/icon/activity/activity4.png';
import activity5 from '../../assets/icon/activity/activity5.png';
import Header from '../../components/Header';
const { height, width } = Dimensions.get('window');
export default class DailyMoneyPage extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidMount () {
    }

    render () {
        return <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#f8f8f8' }]}>
            <ScrollView style={[{ flex: 1 }]}>
                <ImageBackground source={activity5} style={[styles.dmWrap]}>
                    <Header label={'天天领现金'} style={{ backgroundColor: 'rgba(0,0,0,0)', borderBottomWidth: 0 }}/>
                </ImageBackground>
            </ScrollView>
        </SafeAreaView>;
    }
}
const styles = StyleSheet.create({
    dmWrap: {
        height: 1377 / 1125 * width,
        width: width
    }
});
