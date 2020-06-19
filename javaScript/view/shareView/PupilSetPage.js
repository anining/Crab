import React, { Component } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { css } from '../../assets/style/css';
import ImageAuto from '../../components/ImageAuto';
import pupil5 from '../../assets/icon/pupil/pupil5.png';
const { height, width } = Dimensions.get('window');
export default class PupilSetPage extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    static _renderShareTitle (title, icon, width) {
        try {
            return <View style={[css.flex, css.js, { width: width || '100%' }]}>
                <ImageAuto source={icon} style={{ width: 20, marginRight: 10 }}/>
                <Text style={styles.pupTitleText}>{title || '-'}</Text>
            </View>;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    render () {
        return <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#f8f8f8' }]}>
            <Text style={styles.setTips}>我们承诺不会泄露你的个人信息，请放心填写。</Text>
            <View style={styles.formAllWrap}>
                {PupilSetPage._renderShareTitle('基本信息', pupil5)}
                <View style={[css.flex, css.sp, styles.inputWrap]}>
                    <Text style={[styles.setInputText]} numberOfLine={1}>QQ群号</Text>
                    <TextInput style={[styles.setInput]} maxLength={30} placeholder={'请输入QQ群号'} placeholderTextColor={'#BCBCBC'} onChangeText={() => {

                    }}/>
                </View>
                <View style={[css.flex, css.sp, styles.inputWrap]}>
                    <Text style={[styles.setInputText]} numberOfLine={1}>微信号</Text>
                    <TextInput style={[styles.setInput]} maxLength={30} placeholder={'请输入QQ群号'} placeholderTextColor={'#BCBCBC'} onChangeText={() => {

                    }}/>
                </View>
            </View>
            <View style={styles.setInfoAllText}>
                <Text style={styles.setTitle}>设置说明</Text>
                <Text style={styles.setLineText}>1.请先填写基本信息，不填展示的信息为空。</Text>
                <Text style={styles.setLineText}>2.QQ群勾选徒弟可见，达到要求的徒弟可以一键加群。</Text>
                <Text style={styles.setLineText}>3.微信号勾选徒弟可见，达到要求的徒弟可以复制微信并添加微信。</Text>
                <Text style={styles.setLineText}>4.勾选并填写邀请人数，徒弟达到邀请人数之后可见基本信息。</Text>
                <Text style={styles.setLineText}>5.勾选并填写收益总和，徒弟达到收益总和之后可见基本信息。</Text>
                <Text style={styles.setLineText}>6.信息可以随时更换，更换信息之后只影响到之后的徒弟。</Text>
            </View>
        </SafeAreaView>;
    }
}
const styles = StyleSheet.create({
    formAllWrap: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    inputWrap: {
        marginTop: 15
    },
    pupTitleText: {
        color: '#000',
        fontSize: 16,
        lineHeight: 40
    },
    setInfoAllText: {
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    setInput: {
        backgroundColor: '#eee',
        borderRadius: 4,
        color: '#353535',
        fontSize: 14,
        overflow: 'hidden',
        paddingHorizontal: 15,
        width: width * 0.9 - 70
    },
    setInputText: {
        fontSize: 14,
        textAlign: 'right',
        width: 70,
    },
    setLineText: {
        color: '#999',
        fontSize: 14,
        lineHeight: 25,
    },
    setTips: {
        backgroundColor: '#FFE8C5',
        color: '#FF6C00',
        fontSize: 13,
        lineHeight: 36,
        textAlign: 'center',
        width: '100%',
    },
    setTitle: {
        color: '#000',
        fontSize: 16,
        lineHeight: 45
    },
});
