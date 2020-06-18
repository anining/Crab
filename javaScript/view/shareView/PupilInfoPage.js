import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, ImageBackground, Dimensions } from 'react-native';
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

    static _renderShareTitle (title, icon) {
        try {
            return <View style={[css.flex, css.js]}>
                <ImageAuto source={icon} style={{ width: 20, marginRight: 10 }}/>
                {/*<Text style={styles.}>{title || '-'}</Text>*/}
            </View>;
        } catch (e) {
            console.log(e)
            return null;
        }
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
                            <ImageBackground source={pupil8} style={[styles.infoHeader, css.pa]}></ImageBackground>
                        </View>
                        <View style={[css.flex, css.fw, styles.pupilItemWrap]}>
                            {PupilInfoPage._renderShareTitle(<Text></Text>)}
                        </View>
                        <View style={[css.flex, css.fw, styles.pupilItemWrap]}></View>
                        <View style={[css.flex, css.fw, styles.pupilItemWrap]}></View>
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
    infoHeader: {
        borderRadius: 10,
        height: width * 0.96 * 570 / 1107,
        left: '2%',
        overflow: 'hidden',
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
    pupilItemWrap: {
        backgroundColor: '#fff',
        marginBottom: 15,
        minHeight: 100,
    },
});
