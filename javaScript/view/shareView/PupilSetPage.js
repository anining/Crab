import React, { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Text,
    Image,
    TextInput,
    View,
    DeviceEventEmitter,
} from 'react-native';
import { css } from '../../assets/style/css';
import pupil5 from '../../assets/icon/pupil/pupil5.png';
import Crab from '../../components/Crab';
import { childrenSetting } from '../../utils/api';
import toast from '../../utils/toast';
import { N } from '../../utils/router';
import Button from '../../components/Button';

const { width } = Dimensions.get('window');

function PupilSetPage (props) {
    const { setting } = props.route.params;
    const [qq, setQq] = useState(setting.qq_group || '');
    const [wx, setWx] = useState(setting.wx || '');
    const [num, setNum] = useState((setting.need_invite_num && setting.need_invite_num.toString()) || 0);
    const [totalMoney, setTotalMoney] = useState((setting.need_income && setting.need_income.toString()) || 0);

    function save (callback) {
        if (qq && wx && !isNaN(num) && !isNaN(totalMoney)) {
            childrenSetting(qq, wx, num, totalMoney).then(r => {
                callback();
                if (!r.error) {
                    toast('保存成功');
                    DeviceEventEmitter.emit('reloadChildDetail');
                    N.goBack();
                }
            });
        } else {
            callback();
            toast('请填写正确的信息');
        }
    }

    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#f8f8f8' }]}>
            <ScrollView>
                <Text style={styles.setTips}>我们承诺不会泄露你的个人信息，请放心填写。</Text>
                <View style={styles.formAllWrap}>
                    <RenderShareTitle title='基本信息' icon={pupil5}/>
                    <View style={[css.flex, css.sp, styles.inputWrap]}>
                        <Text style={[styles.setInputText]} numberOfLines={1}>QQ群号</Text>
                        <TextInput style={[styles.setInput]} maxLength={30} value={qq} placeholder={'请输入QQ群号'} placeholderTextColor={'#BCBCBC'} onChangeText={e => setQq(e)}/>
                    </View>
                    <View style={[css.flex, css.sp, styles.inputWrap]}>
                        <Text style={[styles.setInputText]} numberOfLines={1}>微信号</Text>
                        <TextInput style={[styles.setInput]} maxLength={30} value={wx} placeholder={'请输入QQ群号'} placeholderTextColor={'#BCBCBC'} onChangeText={e => setWx(e)}/>
                    </View>
                    <View style={[css.flex, css.sp, styles.inputWrap]}>
                        <Text style={[styles.setInputText]} numberOfLines={1}>邀请人数</Text>
                        <TextInput style={[styles.setInput]} maxLength={30} value={num} placeholder={'需邀请多少人才展示信息(无要求不填)'} placeholderTextColor={'#BCBCBC'} onChangeText={e => setNum(e || 0)}/>
                    </View>
                    <View style={[css.flex, css.sp, styles.inputWrap]}>
                        <Text style={[styles.setInputText]} numberOfLines={1}>收益总和</Text>
                        <TextInput style={[styles.setInput]} maxLength={30} value={totalMoney} placeholder={'需达到多少收益才展示信息(无要求不填)'} placeholderTextColor={'#BCBCBC'} onChangeText={e => setTotalMoney(e || 0)}/>
                    </View>
                </View>
                <View style={styles.setInfoAllText}>
                    <Crab text="设置说明：" paddingLeft={0}/>
                    <Text style={styles.setLineText}>1.请先填写基本信息，不填展示的信息为空。</Text>
                    <Text style={styles.setLineText}>2.QQ群勾选渔友可见，达到要求的渔友可以一键加群。</Text>
                    <Text style={styles.setLineText}>3.微信号勾选渔友可见，达到要求的渔友可以复制微信并添加微信。</Text>
                    <Text style={styles.setLineText}>4.勾选并填写邀请人数，渔友达到邀请人数之后可见基本信息。</Text>
                    <Text style={styles.setLineText}>5.勾选并填写收益总和，渔友达到收益总和之后可见基本信息。</Text>
                    <Text style={styles.setLineText}>6.信息可以随时更换，更换信息之后只影响到之后的徒弟。</Text>
                </View>
            </ScrollView>
            <View style={styles.btn}>
                <Button name={'保存设置'} onPress={ callback => {
                    save(callback);
                }}/>
            </View>
        </SafeAreaView>
    );
}

function RenderShareTitle ({ title, icon, width = '100%' }) {
    return (
        <View style={[css.flex, css.js, { width }]}>
            <Image source={icon} style={{ width: 20, height: 20, marginRight: 10 }}/>
            <Text style={styles.pupTitleText}>{title || '-'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    btn: {
        alignItems: 'center',
        justifyContent: 'center'
    },
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
        fontSize: 12,
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
        fontSize: 12,
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
    }
});

export default PupilSetPage;
