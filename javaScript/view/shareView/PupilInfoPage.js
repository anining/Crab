import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { css } from '../../assets/style/css';
import Header from '../../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import Shadow from '../../components/Shadow';
import { N } from '../../utils/router';
import pupil1 from '../../assets/icon/pupil/pupil1.png';
import pupil2 from '../../assets/icon/pupil/pupil2.png';
import pupil3 from '../../assets/icon/pupil/pupil3.png';
import pupil4 from '../../assets/icon/pupil/pupil4.png';
import pupil5 from '../../assets/icon/pupil/pupil5.png';
import pupil6 from '../../assets/icon/pupil/pupil6.png';
import pupil7 from '../../assets/icon/pupil/pupil7.png';
import pupil8 from '../../assets/icon/pupil/pupil8.png';
import pupil9 from '../../assets/icon/pupil/pupil9.png';
import pupil10 from '../../assets/icon/pupil/pupil10.png';
import ListGeneral from '../../components/ListGeneral';
import ImageAuto from '../../components/ImageAuto';
import share8 from '../../assets/icon/share/share8.png';
const { height, width } = Dimensions.get('window');
export default class PupilInfoPage extends Component {
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

    _renderForm () {
        const that = this;
        return <View style={styles.formWrap}>
            <View style={[styles.formHeaderWrap, css.flex]}>
                <Text style={styles.fhwText}>徒孙人数</Text>
                <Text style={styles.fhwText}>徒孙人数</Text>
                <Text style={styles.fhwText}>徒孙人数</Text>
                <Text style={styles.fhwText}>徒孙人数</Text>
            </View>
            <View style={[styles.formLineWrap, css.flex]}>
                <Text style={styles.fhwLineText}>321</Text>
                <Text style={styles.fhwLineText}>321</Text>
                <Text style={styles.fhwLineText}>321</Text>
                <Text style={[styles.fhwLineText, { borderRightWidth: 0 }]}>321</Text>
            </View>
        </View>;
    }

    render () {
        return <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#f8f8f8' }]}>
            <Header label={'师徒信息'} onPress={() => {
                N.navigate('PupilSetPage');
            }} headerRight={<Text style={{ color: '#FF5C22' }}>收徒设置</Text>}/>
            <ListGeneral
                itemHeight={20}
                itemMarginTop={10}
                getList={async (page, num, callback) => {
                    // eslint-disable-next-line standard/no-callback-literal
                    callback([]);
                }} // 获取列表的api
                renderHeader={() => {
                    return <View>
                        <View style={[styles.infoHeaderWrap, css.pr]}>
                            <LinearGradient colors={['#FF9C00', '#FF3E00']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[styles.infoHeaderBg]} />
                            <ImageBackground source={pupil8} style={[styles.infoHeader, css.pa]}>
                                {PupilInfoPage._renderShareTitle('我的师傅', pupil5)}
                                <View style={[styles.teacherWrap, css.flex, css.sp]}>
                                    <ImageAuto source={pupil2} width={40}/>
                                    <Text style={{ color: '#999', fontSize: 12 }}>他的邀请码：A67BHD12 </Text>
                                </View>
                                <View style={[css.flex, styles.pupBtnWrap, css.auto, css.sp]}>
                                    <TouchableOpacity>
                                        <ImageAuto source={pupil7} width={width * 0.35}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <ImageAuto source={pupil10} width={width * 0.35}/>
                                    </TouchableOpacity>
                                </View>
                            </ImageBackground>
                        </View>
                        <View style={[css.flex, css.fw, styles.pupilItemWrap]}>
                            {PupilInfoPage._renderShareTitle('今日收徒数据', pupil1)}
                            {this._renderForm()}
                        </View>
                        <View style={[css.flex, css.fw, styles.pupilItemWrap]}>
                            {PupilInfoPage._renderShareTitle('昨日收徒数据', pupil2)}
                            {this._renderForm()}
                        </View>
                        <View style={[css.flex, css.fw, styles.pupilItemWrap]}>
                            {PupilInfoPage._renderShareTitle('累计收徒数据', pupil3)}
                            {this._renderForm()}
                        </View>
                        <View style={[styles.pupListWrap, css.flex, css.sp]}>
                            {PupilInfoPage._renderShareTitle('徒弟列表', pupil4, 200)}
                            <Text style={styles.pupListTips}>总贡献排序</Text>
                        </View>
                    </View>;
                }}
                renderItem={(item, index) => {
                    return (<View>

                    </View>);
                }}
            />
        </SafeAreaView>;
    }
}
const styles = StyleSheet.create({
    fhwLineText: {
        borderRightColor: '#FFE3CF',
        borderRightWidth: 1,
        color: '#666',
        flex: 1,
        fontSize: 13,
        height: 45,
        lineHeight: 45,
        textAlign: 'center',
    },
    fhwText: {
        color: '#353535',
        flex: 1,
        fontSize: 13,
        textAlign: 'center'
    },
    formHeaderWrap: {
        backgroundColor: '#FFE3CF',
        height: 45,
        width: '100%',
    },
    formLineWrap: {
        height: 45,
        width: '100%',
    },
    formWrap: {
        borderColor: '#FFE3CF',
        borderRadius: 6,
        borderWidth: 1,
        marginTop: 20,
        overflow: 'hidden',
        width: 0.92 * width,
        ...css.auto,
    },
    infoHeader: {
        borderRadius: 10,
        height: width * 0.96 * 570 / 1107,
        left: '2%',
        overflow: 'hidden',
        padding: 20,
        top: 10,
        width: width * 0.96
    },
    infoHeaderBg: {
        ...css.pa,
        height: 150,
        width: '100%',
        zIndex: -1
    },
    infoHeaderWrap: {
        backgroundColor: '#f8f8f8',
        height: 210,
    },
    pupBtnWrap: {
        height: 'auto',
        paddingHorizontal: 20,
        width: '100%'
    },
    pupListTips: {
        color: '#999',
        fontSize: 11,
    },
    pupListWrap: {
        backgroundColor: '#fff',
        borderRadius: 6,
        height: 50,
        overflow: 'hidden',
        width: width * 0.94,
        ...css.auto,
        marginBottom: 10,
        paddingHorizontal: 15
    },
    pupTitleText: {
        color: '#000',
        fontSize: 16,
    },
    pupilItemWrap: {
        backgroundColor: '#fff',
        marginBottom: 15,
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    teacherWrap: {
        height: 90,
        paddingHorizontal: 20,
        width: '100%'
    },
});
