import React, { Component } from 'react';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    Animated, Easing,
} from 'react-native';
import { css } from '../../assets/style/css';
import game14 from '../../assets/icon/game/game14.png';
import game9 from '../../assets/icon/game/game9.png';
import game29 from '../../assets/icon/game/game29.png';
import game30 from '../../assets/icon/game/game30.png';
import game51 from '../../assets/icon/game/game51.png';
import game52 from '../../assets/icon/game/game52.png';
import game53 from '../../assets/icon/game/game53.png';
import game54 from '../../assets/icon/game/game54.png';
import game55 from '../../assets/icon/game/game55.png';
import ImageAuto from '../../components/ImageAuto';
import { N } from '../../utils/router';
import { _gv, _if, _tc, setAndroidTime } from '../../utils/util';
import { getGame } from '../../utils/api';
import ShiftView from '../../components/ShiftView';

const { height, width } = Dimensions.get('window');
const CANVAS_WIDTH = width - 20;
const HELP_HEIGHT = 60;
const CUBE_WIDTH = Math.floor((CANVAS_WIDTH) / 9);
const CUBE_HEIGHT = Math.floor((CANVAS_WIDTH) / 9);
const OVER_SITE_Y = CANVAS_WIDTH + HELP_HEIGHT - CUBE_WIDTH;
const MAX_LENGTH = 9; // 最大画布长度
const matrix = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];
export default class GamePage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            gameInfo: null,
            coordinate: null,
            answerObj: null, // 底部答案
            selectSite: null, // 当前选中坐标
            fillArray: {}, // 当前已完成的填词
        };
        this.rankType = Math.random() > 0.5 ? 0 : 1; // 0是横着排列，1是竖着排列
        // this.rankType = 0;
    }

    componentDidMount () {
        this._getGame();
    }

    _getGame () {
        _tc(async () => {
            const ret = await getGame();
            if (ret && !ret.error) {
                this.setState({
                    gameInfo: ret.data,
                    coordinate: this._countMaxPoint(ret.data),
                });
            } else {
                if (ret.error === 10) {
                    N.goBack();
                }
            }
        });
    }

    static _buildIdiomArray (data) {
        try {
            return data.content.map(x => x.split('')).flat();
        } catch (e) {
            return [];
        }
    }

    _countMaxPoint (data) {
        try {
            const coordinate = [];
            let nowSite = [0, 0]; // 每一个成语的起点坐标
            let str = ''; // 缓存上一个成语
            const idiomArray = GamePage._buildIdiomArray(data); // ['词', '不',...]所有单字数组
            const answerObj = {}; // 答案对象
            data.content.forEach((item, cyIndex) => {
                const focusPoint = GamePage.repeatStr(str, item); // 返回[老一个成语的交点索引，新一个成语的交点索引]
                const itemArray = item.split(''); // 单个成语字数组 ['词', '不',...]
                if (!this.rankType) { // 当前成语横向排列
                    nowSite = [nowSite[0] - focusPoint[1], nowSite[1] + focusPoint[0]];
                    itemArray.forEach((item, index) => {
                        coordinate.push([nowSite[0] + index, nowSite[1]]);
                    });
                } else { // 当前成语纵向排列
                    nowSite = [nowSite[0] + focusPoint[0], nowSite[1] - focusPoint[1]];
                    itemArray.forEach((item, index) => {
                        coordinate.push([nowSite[0], nowSite[1] + index]);
                    });
                }
                // 每一个成语都要挖走一个字当作答案
                const answerIndex = Math.floor(Math.random() * item.length);
                answerObj[cyIndex * 4 + answerIndex] = {
                    cyIndex,
                    answerIndex,
                    word: item.slice(answerIndex, answerIndex + 1),
                };
                this.rankType = Number(!this.rankType); // 交换横竖排列
                str = item; // 缓存当前成语
            });
            const xArray = coordinate.flat().map((item, index) => index % 2 === 0 ? item : 0);
            const yArray = coordinate.flat().map((item, index) => index % 2 === 1 ? item : 0);
            const maxXNumber = Math.max(...xArray);
            const maxYNumber = Math.max(...yArray);
            const minXNumber = Math.min(...xArray);
            const minYNumber = Math.min(...yArray);
            const transformX = Math.floor((MAX_LENGTH - maxXNumber + minXNumber) / 2) + Math.abs(minXNumber);
            const transformY = Math.floor((MAX_LENGTH - maxYNumber + minYNumber) / 2) + Math.abs(minYNumber);
            const keyCoordinate = {};
            let selectSite = null; // 选中坐标
            const answerObjOfKey = {}; // 答案坐标字去重
            coordinate.map((array, index) => {
                const keyName = [array[0] + transformX, array[1] + transformY].join('');
                if (!keyCoordinate[keyName] || answerObj[index]) {
                    answerObj[index] && (() => {
                        const idiomSortIndex = parseInt(index / 4);
                        const idiomPointArray = coordinate.slice(idiomSortIndex * 4, (idiomSortIndex + 1) * 4).map(idiom => [idiom[0] + transformX, idiom[1] + transformY].join(''));
                        const historyAnswerObjOfKey = answerObjOfKey[keyName] ? { ...answerObjOfKey[keyName] } : { idiomPointArray: [] };
                        answerObjOfKey[keyName] = { ...answerObj[index], key: keyName, idiomPointArray: [...new Set([...historyAnswerObjOfKey.idiomPointArray, ...idiomPointArray])] };
                        (!selectSite && (selectSite = keyName));
                        // eslint-disable-next-line func-call-spacing
                    })();
                    keyCoordinate[keyName] = {
                        word: idiomArray[index],
                        key: keyName,
                        answer: answerObjOfKey[keyName],
                    };
                }
            });
            console.log(answerObjOfKey, '答案');
            console.log(keyCoordinate);
            this.setState({ answerObj: answerObjOfKey, selectSite });
            return keyCoordinate;
        } catch (e) {
            console.log(e);
            return {};
        }
    }

    static repeatStr (oldStr, newStr) { // 老字符串， 新字符串
        try {
            const array = newStr.split('');
            let oldIndex = 0;
            let newIndex = 0;
            for (let i = 0; i < array.length; i++) {
                const item = array[i];
                if (oldStr.indexOf(item) > -1) {
                    oldIndex = oldStr.indexOf(item);
                    newIndex = i;
                    break;
                }
            }
            return [oldIndex, newIndex];
        } catch (e) {
            console.log(e);
            return [0, 0];
        }
    }

    _renderMatrixAnimation () {
        if (this.state.gameInfo) {
            const view = [];
            const keyCoordinate = this.state.coordinate;
            matrix.forEach((matrixLineArray, yIndex) => {
                matrixLineArray.forEach((item, xIndex) => {
                    const masterKey = `${xIndex}${yIndex}`;
                    const keyCoordinateItem = keyCoordinate[masterKey];
                    if (keyCoordinateItem) {
                        view.push(
                            // eslint-disable-next-line no-return-assign
                            <ShiftView ref={ref => this[`cube${xIndex}${yIndex}`] = ref}
                                startSite={[xIndex * CUBE_WIDTH, yIndex * CUBE_WIDTH]}
                                endSite={[10, OVER_SITE_Y]}>
                                <TouchableOpacity activeOpacity={1} style={[styles.cubeItem]}
                                    key={`animation${masterKey}`} onPress={() => {
                                    // this[`cube${xIndex}${yIndex}`].start();
                                        if (keyCoordinateItem.answer) {
                                            this.setState({
                                                selectSite: masterKey,
                                            });
                                        }
                                    }}>
                                    <ImageBackground source={game53}
                                        style={[css.flex, { width: '100%', height: '100%' }]}>
                                        <Text style={{ fontSize: 16, color: '#353535' }}>{keyCoordinateItem.word}</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </ShiftView>,
                        );
                    }
                });
            });
            return view;
        } else {
            return null;
        }
    }

    _renderMatrix () {
        if (this.state.gameInfo) {
            const view = [];
            const keyCoordinate = this.state.coordinate;
            const selectSite = this.state.selectSite;
            const fillArray = this.state.fillArray;
            matrix.forEach((matrixLineArray, yIndex) => {
                matrixLineArray.forEach((item, xIndex) => {
                    const masterKey = `${xIndex}${yIndex}`;
                    view.push(<View style={styles.cubeItem} key={`Game${masterKey}`}>
                        {_if(keyCoordinate[masterKey], res => {
                            if (res.answer) {
                                return <View style={{ width: '100%', height: '100%', padding: 1 }} key={`GameAnswer${masterKey}`}>
                                    <ImageBackground source={selectSite === masterKey ? game51 : game52}
                                        style={[css.flex, { width: '100%', height: '100%' }]}>
                                        {_if(fillArray[masterKey], res => <Text style={{ fontSize: 16, color: '#353535' }}>{res.word}</Text>)}
                                    </ImageBackground>
                                </View>;
                            } else {
                                return <View style={{ width: '100%', height: '100%', padding: 1 }} key={`GameWord${masterKey}`}>
                                    <ImageBackground source={game55}
                                        style={[css.flex, { width: '100%', height: '100%' }]}>
                                        <Text style={{ fontSize: 16, color: '#353535' }}>{res.word}</Text>
                                    </ImageBackground>
                                </View>;
                            }
                        }, () => {
                            return null;
                        })}
                    </View>);
                });
            });
            return view;
        } else {
            return null;
        }
    }

    _renderAnswer () {
        try {
            if (this.state.answerObj) {
                const view = [];
                for (const key in this.state.answerObj) {
                    const item = this.state.answerObj[key];
                    view.push(
                        <TouchableOpacity acityOpacity={1} style={[styles.cubeItemAnswer]} key={`answers${item.key}`} onPress={() => {
                            this.setState({
                                fillArray: {
                                    ...this.state.fillArray,
                                    [this.state.selectSite]: item
                                }
                            }, () => {
                                // console.log(this.state.fillArray);
                                if (item.key === this.state.selectSite) {
                                    item.idiomPointArray.forEach((moveKey, moveIndex) => {
                                        setAndroidTime(() => { this[`cube${moveKey}`] && this[`cube${moveKey}`].start(); }, 50 * moveIndex);
                                    });
                                }
                            });
                        }}>
                            <View style={{ width: '100%', height: '100%', padding: 2 }}>
                                <ImageBackground source={game55} style={[css.flex, { width: '100%', height: '100%' }]}>
                                    <Text style={{ fontSize: 16, color: '#353535' }}>{item.word}</Text>
                                </ImageBackground>
                            </View>
                        </TouchableOpacity>
                    );
                }
                return view;
            }
        } catch (e) {
            return null;
        }
    }

    render () {
        return <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#FED465' }]}>
            <View style={[styles.gameHeader, css.flex, css.sp]}>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    N.goBack();
                }}>
                    <ImageAuto source={game14} style={{ marginLeft: 10, width: 40, marginRight: 30 }}/>
                </TouchableOpacity>
                <View style={[css.flex, styles.titleWrap]}>
                    <Text style={styles.gameLabel}>第127关</Text>
                </View>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                }} style={[css.flex, css.fw, styles.ghRightBtn]}>
                    <Text style={[styles.rightText, { color: '#FF3154', fontSize: 12 }]}> 95% </Text>
                    <Text style={styles.rightText}>
                        答题正确率
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.animatedWrap, css.pr]}>
                {/* 字体动画画布 */}
                <View style={[styles.animatedCanvas, css.pa]}>
                    {this._renderMatrixAnimation()}
                </View>
                {/* 游戏画布 */}
                <View style={[styles.gameCanvasWrap]}>
                    <View style={[styles.gameCanvasInner, css.flex, css.fw]}>
                        {this._renderMatrix()}
                    </View>
                </View>
                {/* 帮助栏目 */}
                <View style={[css.flex, styles.helpWrap, css.js, css.pr]}>
                    <TouchableOpacity activeOpacity={1} style={[css.flex, styles.helpBtnWrap]}>
                        <ImageAuto source={game29} style={{ width: 22, marginRight: 5 }}/>
                        <Text style={styles.helpBtnText} numberOfLines={1}>生词本</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={[css.flex, styles.helpBtnWrap]}>
                        <ImageAuto source={game9} style={{ width: 22, marginRight: 5 }}/>
                        <Text style={styles.helpBtnText} numberOfLines={1}>剩1次</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1}
                        style={[css.flex, styles.helpBtnWrap, css.pa, {
                            right: 0,
                            marginRight: 0,
                            top: 20,
                        }]}>
                        <ImageAuto source={game30} style={{ width: 22, marginRight: 5 }}/>
                        <Text style={styles.helpBtnText} numberOfLines={1}>帮助</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* 底部答案选择区域 */}
            <View style={[css.flex, styles.answerWrap, css.js, css.pr]}>
                {this._renderAnswer()}
            </View>
        </SafeAreaView>;
    }
}
const styles = StyleSheet.create({
    animatedCanvas: {
        // backgroundColor: 'rgba(0,0,0,.4)',
        height: '100%',
        left: 10,
        top: 0,
        width: width - 20,
        zIndex: 2,
    },
    animatedWrap: {
        // backgroundColor: 'red'
        marginTop: 20,
    },
    answerWrap: {
        height: 'auto',
        paddingTop: 20,
        width: width - 20,
        ...css.auto,
        overflow: 'hidden',
    },
    cubeItem: {
        height: CUBE_HEIGHT,
        overflow: 'hidden',
        width: CUBE_WIDTH,
    },
    cubeItemAnswer: {
        height: CUBE_HEIGHT + 6,
        overflow: 'hidden',
        width: CUBE_WIDTH + 6,
    },
    gameCanvasInner: {
        backgroundColor: '#FE8E21',
        borderRadius: 10,
        height: '100%',
        overflow: 'hidden',
        width: '100%',
    },
    gameCanvasWrap: {
        backgroundColor: '#FE690B',
        height: width - 10,
        width: width - 20,
        ...css.auto,
        borderRadius: 10,
        overflow: 'hidden',
        paddingBottom: 10,
    },
    gameHeader: {
        height: 80,
        overflow: 'hidden',
        paddingTop: 30,
        width,
    },
    gameLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
    },
    ghRightBtn: {
        backgroundColor: 'rgba(255,255,255, .5)',
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        height: 40,
        overflow: 'hidden',
        paddingLeft: 6,
        width: 80,
    },
    helpBtnText: {
        color: '#fff',
        fontSize: 14,
    },
    helpBtnWrap: {
        backgroundColor: '#FF6C00',
        borderColor: '#594134',
        borderRadius: 18,
        borderWidth: 1,
        height: 36,
        marginRight: 10,
        overflow: 'hidden',
        paddingHorizontal: 10,
        width: 90,
    },
    helpWrap: {
        height: HELP_HEIGHT,
        paddingTop: 20,
        width: width - 20,
        ...css.auto,
        overflow: 'hidden',
    },
    rightText: {
        color: '#353535',
        fontSize: 10,
        lineHeight: 14,
        textAlign: 'center',
        width: '100%',
    },
    titleWrap: {
        // backgroundColor: 'red',
        flex: 1,
        height: '100%',
    },
});
