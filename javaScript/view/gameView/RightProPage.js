import { Component } from 'react';
import * as React from 'karet';
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { css } from '../../assets/style/css';
import header3 from '../../assets/icon/header/header3.png';
import ImageAuto from '../../components/ImageAuto';
import activity6 from '../../assets/icon/activity/activity6.png';
import Header, { MAIN_HEADER_HEIGHT } from '../../components/Header';
import { gameErrorLog } from '../../utils/api';
import GameDialog from '../../components/GameDialog';
import IdiomCard from '../../components/IdiomCard';
import game37 from '../../assets/icon/game/game37.png';
import game11 from '../../assets/icon/game/game11.png';
import game66 from '../../assets/icon/game/game66.png';
import { bindData, getPath } from '../../global/global';
const { height, width } = Dimensions.get('window');
const LineTextBgWidth = width * 0.84;
const progressBoxWidth = LineTextBgWidth * 0.8;
export default class RightProPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            glossaryInfo: null,
            user: bindData('user', this),
            trCorrectRate: '100%',
        };
    }

    async _gameErrorLog () {
        const ret = await gameErrorLog();
        if (ret && !ret.error) {
            console.log(ret, '打错题目记录', this.state.user, getPath(['trCorrectRate', this.state.user]));
            this.setState({
                glossaryInfo: ret.data,
                trCorrectRate: getPath(['trCorrectRate'], this.state.user)
            });
        }
    }

    async componentDidMount () {
        await this._gameErrorLog();
    }

    _renderIdiomList () {
        try {
            if (this.state.glossaryInfo) {
                const view = [];
                this.state.glossaryInfo.forEach((item, index) => {
                    view.push(
                        <TouchableOpacity key={`content${index}`} activeOpacity={1} style={[css.flex, styles.idiomItemWrap]} onPress={() => {
                            DeviceEventEmitter.emit('showPop', <GameDialog btn={'我学会了'} content={<IdiomCard content={item.idiom.idiom} idiom={item.idiom}/>}/>);
                        }}>
                            <ImageAuto source={game37} style={{ width: 16, marginRight: 5 }}/>
                            <Text style={[css.gf, styles.lineIdiom]} numberOfLines={1}>{item.idiom.idiom}</Text>
                        </TouchableOpacity>,
                    );
                });
                return view;
            } else {
                return <Text style={[styles.emptyText]}>你还没有答错过成语~</Text>;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    render () {
        return (
            <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#FED465' }]}>
                <Header color={'#fff'} label={'答题正确率'} style={[{ backgroundColor: '#FED465', borderBottomWidth: 0 }]} icon={header3}/>
                <ScrollView style={{ flex: 1 }}>
                    <View style={[css.flex, css.fw, styles.rpPageWrap]}>
                        <Text style={[styles.rpTitleText, { textAlign: 'center' }]}>答题正确率</Text>
                        <View style={[css.flex, { marginTop: 20 }]}>
                            <ImageAuto source={game66} style={{ width: 30 }}/>
                            <Text style={[styles.rpTitleText, { textAlign: 'center', width: 120, color: '#FF6C00', fontSize: 28 }]}>{this.state.trCorrectRate}</Text>
                        </View>
                        <ImageBackground source={game11} style={[css.flex, styles.LineTextBg, css.fw]}>
                            <View style={[css.flex, styles.progressBox, css.js, css.pr]}>
                                <View style={[css.flex, styles.progressInner, {
                                    width: this.state.trCorrectRate
                                }]}/>
                                <View style={[css.pa, styles.zsView, { left: 10 }]}/>
                                <View style={[css.pa, styles.zsView, { left: progressBoxWidth * 0.5 - 8 }]}/>
                                <View style={[css.pa, styles.zsView, { right: 10 }]}/>
                            </View>
                            <View style={[css.flex, css.sp, { width: progressBoxWidth }]}>
                                <Text style={styles.proText}>一般</Text>
                                <Text style={styles.proText}>平平</Text>
                                <Text style={styles.proText}>优秀</Text>
                            </View>
                        </ImageBackground>
                        <Text style={styles.rpTitleText}>答题正确率越高，收益越大</Text>
                        <View style={[css.flex]}>
                            <Text style={styles.rpRedText}>答题收益</Text>
                            <View style={styles.rpRedEmptyBox}/>
                            <Text style={styles.rpRedMinText}>=</Text>
                            <View style={styles.rpRedEmptyBox}/>
                            <Text style={styles.rpRedText}>答题获得的金币</Text>
                            <View style={styles.rpRedEmptyBox}/>
                            <Text style={styles.rpRedMinText}>*</Text>
                            <View style={styles.rpRedEmptyBox}/>
                            <Text style={styles.rpRedText}>答题正确率</Text>
                        </View>
                    </View>
                    <View style={[css.flex, css.fw, styles.rpPageWrap, css.js]}>
                        <Text style={styles.rpTitleText}>累计答题{getPath(['user_level', 'total_num'], this.state.user, 0)}次，答错{getPath(['user_level', 'error_num'], this.state.user, 0)}次</Text>
                        <Text style={styles.rpTitleMinText}>答错记录:</Text>
                        {this._renderIdiomList()}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    LineTextBg: {
        height: LineTextBgWidth * 405 / 1071,
        width: LineTextBgWidth,
        ...css.auto,
        overflow: 'hidden',
        paddingTop: 40
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
        lineHeight: 40,
        textAlign: 'center',
        width: '100%',
        ...css.gf
    },
    glossaryInnerBox: {
        height: width * 1.25,
        left: width * 0.1,
        paddingLeft: 10,
        paddingTop: 20,
        top: width * 0.25,
        width: width * 0.8
    },
    glossaryWrap: {
        height: width * 2001 / 1125,
        width: width
    },
    idiomItemWrap: {
        borderColor: '#594134',
        borderRadius: 17,
        borderWidth: 1,
        height: 34,
        marginBottom: 10,
        marginLeft: width * 0.02,
        overflow: 'hidden',
        transform: [{ scale: 0.96 }],
        width: '30%',
    },
    lineIdiom: {
        fontSize: 15,
    },
    proText: {
        color: '#6A523C',
        fontSize: 15,
        height: 40,
        lineHeight: 40,
        ...css.gf
    },
    progressBox: {
        backgroundColor: '#FFE784',
        borderRadius: 8,
        height: 16,
        overflow: 'hidden',
        width: progressBoxWidth,
    },
    progressInner: {
        backgroundColor: '#FF6C00',
        borderRadius: 8,
        height: 16,
        width: 30,
    },
    rpPageWrap: {
        backgroundColor: '#FFF7A9',
        minHeight: 40,
        width: width * 0.94,
        ...css.auto,
        borderRadius: 8,
        marginTop: 20,
        overflow: 'hidden',
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    rpRedEmptyBox: {
        height: '100%',
        width: 1
    },
    rpRedMinText: {
        color: '#FF6C00',
        ...css.gf,
        fontSize: 20,
    },
    rpRedText: {
        backgroundColor: '#FF6C00',
        borderRadius: 14,
        color: '#fff',
        fontSize: 15,
        height: 28,
        lineHeight: 28,
        overflow: 'hidden',
        paddingHorizontal: 10,
        ...css.gf,
        transform: [{ scale: 0.85 }]
    },
    rpTitleMinText: {
        color: '#999',
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'left',
        width: '100%',
    },
    rpTitleText: {
        color: '#6A523C',
        fontSize: 18,
        lineHeight: 40,
        textAlign: 'left',
        width: '100%',
    },
    zsView: {
        backgroundColor: '#FFF6D0',
        borderRadius: 8,
        height: 16,
        width: 16
    }
});
