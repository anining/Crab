import { Component } from 'react';
import * as React from 'karet';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    Animated, Easing, DeviceEventEmitter,
} from 'react-native';
import { N } from '../../utils/router';
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
import game56 from '../../assets/icon/game/game56.png';
import game57 from '../../assets/icon/game/game57.png';
import game61 from '../../assets/icon/game/game61.png';
import game62 from '../../assets/icon/game/game62.png';
import ImageAuto from '../../components/ImageAuto';
import { _gv, _if, _tc, _toFixed, setAndroidTime } from '../../utils/util';
import { gameError, getGame, upgradeGameLevel, useProp } from '../../utils/api';
import ShiftView from '../../components/ShiftView';
import EnlargeView from '../../components/EnlargeView';
import OpacityView from '../../components/OpacityView';
import * as Animatable from 'react-native-animatable';
import GameDialog from '../../components/GameDialog';
import chest from '../../lottie/chest';
import LottieView from 'lottie-react-native';
import game22 from '../../assets/icon/game/game22.png';
import { getter } from '../../utils/store';
import * as U from 'karet.util';
import * as R from 'kefir.ramda';
import toast from '../../utils/toast';
import game20 from '../../assets/icon/game/game20.png';
import help from '../../lottie/help';
import { updateUser } from '../../utils/update';
import { bindData, getPath } from '../../global/global';

const { height, width } = Dimensions.get('window');
const CANVAS_WIDTH = width - 20;
const HELP_HEIGHT = 60;
const CUBE_WIDTH = Math.floor((CANVAS_WIDTH) / 9);
const CUBE_HEIGHT = Math.floor((CANVAS_WIDTH) / 9);
const OVER_SITE_Y = CANVAS_WIDTH + HELP_HEIGHT - CUBE_WIDTH;
const MAX_LENGTH = 9; // 最大画布长
const FONT_SIZE = 17;// 字大小
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
const { trCorrectRate, level_num: userLevel, propNumsObj } = getter(['user.trCorrectRate', 'user.user_level.level_num', 'user.propNumsObj']);
const gameTipsProp = U.mapValue((res) => {
    return res || 0;
}, R.path(['3'], propNumsObj)); // 获取游戏提醒的数量
export default class GamePage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            user: bindData('user', this),
            loading: false, // 网络请求加载中
            gameInfo: null, // 整个页面的全部数据, 用于等待加载
            coordinate: null, // 格式化后的汉子对象列表，用于渲染填词背景，所有字的坐标已确定在该对象内
            answerObj: null, // 底部答案对象
            selectSite: null, // 当前选中坐标,用于选择框位置显示
            fillArray: {}, // 当前已完成的填词,可能对可能错，用于判断交互逻辑
            completedCharacterArray: [], // 已经变成绿色字的数组，不能有交互
        };
        this.successNumber = 0;
        // this.needToAnswer = 0;
        this.rightButAwait = {}; // 选对了，但是还在等待中的词语,用于判断后期是否触发动画
        this.rankType = Math.random() > 0.5 ? 0 : 1; // 0是横着排列，1是竖着排列
        // this.rankType = 0;
    }

    componentDidMount () {
        this._getGame();
        updateUser();
    }

    static async _gameError (str) {
        await gameError(str);// 打错题目
    }

    async _upgradeGameLevel () {
        const ret = await upgradeGameLevel(JSON.stringify(this.state.gameInfo.content));
        if (ret && !ret.error) {
            setAndroidTime(() => {
                N.replace('PassGamePage', {
                    info: {
                        ...ret.data,
                        ...this.state.gameInfo,
                        userLevel: userLevel.get(),
                        myGradeLevel: getPath(['myGradeLevel'], this.state.user, 1)
                    }
                });
            }, 1000);
        } else {
            // N.goBack();
        }
    }

    _getGame () {
        _tc(async () => {
            const ret = await getGame();
            console.log(ret, '游戏详情');
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
            const answerWord = [];// 答案字数组，用于不取到重复的字
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
                let answerIndex = Math.floor(Math.random() * item.length);
                if (answerWord.includes(item.slice(answerIndex, answerIndex + 1))) {
                    answerIndex = Math.abs(answerIndex - 1);
                }
                answerWord.push(item.slice(answerIndex, answerIndex + 1));// 每次都添加到answerWord 尽量不添加重复到字
                answerObj[cyIndex * 4 + answerIndex] = {
                    cyIndex,
                    answerIndex,
                    word: item.slice(answerIndex, answerIndex + 1),
                    filled: false,
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
            // console.log(answerObj, )
            coordinate.map((array, index) => {
                const keyName = [array[0] + transformX, array[1] + transformY].join('');
                answerObj[index] && (() => {
                    const idiomSortIndex = parseInt(index / 4);
                    const idiomPointArray = coordinate.slice(idiomSortIndex * 4, (idiomSortIndex + 1) * 4).map(idiom => [idiom[0] + transformX, idiom[1] + transformY].join(''));
                    const historyAnswerObjOfKey = answerObjOfKey[keyName] ? { ...answerObjOfKey[keyName] } : { idiomPointArray: [] };
                    answerObjOfKey[keyName] = {
                        ...answerObj[index],
                        key: keyName,
                        idiomPointArray: [...new Set([...historyAnswerObjOfKey.idiomPointArray, ...idiomPointArray])],
                        isAwait: null,
                        success: null,
                    };
                    (!selectSite && (selectSite = keyName));
                    // eslint-disable-next-line func-call-spacing
                    console.log(idiomArray[index], keyName, historyAnswerObjOfKey, answerObj);
                })();
                keyCoordinate[keyName] = {
                    word: idiomArray[index],
                    key: keyName,
                    answer: answerObjOfKey[keyName],
                };
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
            const fillArray = this.state.fillArray;
            const answerObj = this.state.answerObj;
            const characterArray = this.state.completedCharacterArray;
            matrix.forEach((matrixLineArray, yIndex) => {
                matrixLineArray.forEach((item, xIndex) => {
                    const masterKey = `${xIndex}${yIndex}`;
                    const keyCoordinateItem = keyCoordinate[masterKey];
                    if (keyCoordinateItem) {
                        view.push(
                            // eslint-disable-next-line no-return-assign
                            <ShiftView ref={ref => this[`cube${xIndex}${yIndex}`] = ref}
                                startSite={[xIndex * CUBE_WIDTH, yIndex * CUBE_WIDTH]}
                                endSite={[10, OVER_SITE_Y]} duration={700}>
                                <TouchableOpacity activeOpacity={1} style={[styles.cubeItem]}
                                    key={`animation${masterKey}`} onPress={() => {
                                        const isCompleted = characterArray.includes(masterKey);
                                        if (isCompleted) {
                                            console.log('已完成已完成', masterKey, answerObj, fillArray);
                                            return fillArray;
                                        }
                                        if (keyCoordinateItem.answer) {
                                            this.setState({
                                                selectSite: masterKey,
                                            }, () => {
                                                console.log(this.state.selectSite);
                                            });
                                        }
                                        console.log(fillArray, masterKey);
                                        if (fillArray[masterKey]) {
                                            this[`answerOpacity${fillArray[masterKey].key}`] && this[`answerOpacity${fillArray[masterKey].key}`].show();
                                            this.setState({
                                                fillArray: {
                                                    ...fillArray,
                                                    [masterKey]: null,
                                                },
                                                answerObj: {
                                                    ...answerObj,
                                                    [fillArray[masterKey].key]: {
                                                        ...answerObj[fillArray[masterKey].key],
                                                        filled: null,
                                                        success: null,
                                                        isAwait: null,
                                                    },
                                                },
                                            }, () => {
                                                console.log(this.state.answerObj);
                                            });
                                        }
                                    }}>
                                    <ImageBackground source={game53}
                                        style={[css.flex, { width: '100%', height: '100%' }]}>
                                        <Text style={[styles.squareText]}>{keyCoordinateItem.word}</Text>
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
            const answerObj = this.state.answerObj;
            const characterArray = this.state.completedCharacterArray;
            matrix.forEach((matrixLineArray, yIndex) => {
                matrixLineArray.forEach((item, xIndex) => {
                    const masterKey = `${xIndex}${yIndex}`;
                    const isCompleted = characterArray.includes(masterKey);
                    view.push(<View style={styles.cubeItem} key={`Game${masterKey}`}>
                        {_if(keyCoordinate[masterKey], res => {
                            const answerItemInfo = answerObj[res.key];
                            if (answerItemInfo && !answerItemInfo.success && !answerItemInfo.isAwait) {
                                return <View style={{ width: '100%', height: '100%', padding: 1 }}
                                    key={`GameAnswer${masterKey}`}>
                                    <ImageBackground
                                        source={fillArray[masterKey] ? game61 : selectSite === masterKey ? game62 : game54}
                                        style={[css.flex, { width: '100%', height: '100%' }]}>
                                        {_if(fillArray[masterKey], res => <Animatable.View
                                            ref={ref => this[`animationText${masterKey}`] = ref}><Text style={[styles.squareText, { color: 'red' }]}>
                                                {res.word}</Text>
                                        </Animatable.View>)}
                                    </ImageBackground>
                                </View>;
                            } else {
                                const answerItemInfo = answerObj[res.key];
                                if ((answerItemInfo && answerItemInfo.success) || isCompleted) {
                                    return <EnlargeView ref={ref => this[`enlarge${xIndex}${yIndex}`] = ref}
                                        style={{ width: '100%', height: '100%', padding: 1 }}
                                        key={`GameWord${masterKey}`}>
                                        <ImageBackground source={game53}
                                            style={[css.flex, { width: '100%', height: '100%' }]}>
                                            <Text style={[styles.squareText]}>{res.word}</Text>
                                        </ImageBackground>
                                    </EnlargeView>;
                                } else {
                                    // eslint-disable-next-line no-return-assign
                                    return <EnlargeView ref={ref => this[`enlarge${xIndex}${yIndex}`] = ref}
                                        style={{ width: '100%', height: '100%', padding: 1 }}
                                        key={`GameWord${masterKey}`}>
                                        <ImageBackground source={game55}
                                            style={[css.flex, { width: '100%', height: '100%' }]}>
                                            {/* [styles.squareText, { color: '#353535' }] */}
                                            <Text style={[styles.squareText, {
                                                color: answerItemInfo && answerItemInfo.isAwait ? 'red' : '#353535',
                                            }]}>{res.word}</Text>
                                        </ImageBackground>
                                    </EnlargeView>;
                                }
                            }
                        }, (e) => {
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

    static comparisonArray (array1, array2) {
        try {
            const newArray = [...new Set(array1), ...new Set(array2)];
            console.log(array1, array2, [...new Set(newArray)].length, newArray.length, [...new Set(newArray)], newArray);
            return [...new Set(newArray)].length === newArray.length;
        } catch (e) {
            console.log(e, array1, array2);
            return true;
        }
    }

    successAnimation (array, callback) { // 每次答对都有动特效
        try {
            array.forEach((moveKey, moveIndex) => {
                setAndroidTime(() => {
                    this[`cube${moveKey}`] && this[`cube${moveKey}`].start();
                    this[`enlarge${moveKey}`] && this[`enlarge${moveKey}`].start();
                    if (moveIndex + 1 >= array.length) {
                        callback && callback();
                        this.successNumber++;// 答对次数加1
                        if (this.successNumber >= Object.entries(this.state.answerObj).length) {
                            // 通关逻辑
                            this._upgradeGameLevel();
                        }
                    }
                }, 64 * moveIndex);
            });
        } catch (e) {
            console.log(e);
        }
    }

    _buildAnswerObj (item, success = false, isAwait = false, callback) {
        try {
            let answerObj = {
                ...this.state.answerObj,
                [item.key]: {
                    ...item,
                    success,
                    isAwait,
                    filled: true,
                },
            };
            this.state.fillArray[this.state.selectSite] && (() => {
                // 把本格原来选中的字还回去
                const preItem = this.state.fillArray[this.state.selectSite];
                answerObj = {
                    ...answerObj,
                    [preItem.key]: {
                        ...preItem,
                        filled: false, // 把本格原来选中的字还回去
                        success: false,
                        isAwait: false,
                    },
                };
                callback && callback(preItem.key);
            })();
            return answerObj;
        } catch (e) {
            console.log(e);
        }
    }

    _checkAnswer (item) {
        try {
            if (item.filled) {
                console.log(item, '已经被选中');
                return false;
            }
            this[`answerOpacity${item.key}`] && this[`answerOpacity${item.key}`].hide();
            const newAnswerObj = this._buildAnswerObj(item);
            console.log(newAnswerObj, '提前假设这样选的答案对象');
            const surplusAnswer = Object.entries(newAnswerObj).map(x => {
                if (x && x[0] && !x[1].filled) {
                    return x[0];
                }
            }).filter(function (s) {
                return s && s.trim();
            }); // 未被填充答案的key数组
            const rightChoice = item.key === this.state.selectSite;
            const isSuccess = rightChoice && GamePage.comparisonArray(surplusAnswer, item.idiomPointArray);
            console.log(surplusAnswer, '下一个数组第一项');
            console.log(this.state.fillArray, item.key, '======', this.state.selectSite);
            const nextAnswerObj = this._buildAnswerObj(item, isSuccess, rightChoice && !isSuccess, (preItemKey) => {
                this[`answerOpacity${preItemKey}`] && this[`answerOpacity${preItemKey}`].show();
            });
            this.setState({
                fillArray: {
                    ...this.state.fillArray,
                    [this.state.selectSite]: item,
                },
                answerObj: nextAnswerObj,
                completedCharacterArray: [...this.state.completedCharacterArray, ...(isSuccess ? item.idiomPointArray : [])],
                selectSite: !rightChoice ? this.state.selectSite : surplusAnswer[0],
            }, () => {
                console.log(this.state.selectSite);
                if (isSuccess) {
                    this.successAnimation(item.idiomPointArray, () => {
                        setAndroidTime(() => {
                            this._chest && this._chest.start();
                        }, 800);
                    });
                    // 已经触发了，应该从rightButAwait剔除
                    this.rightButAwait[item.key] && (() => {
                        delete this.rightButAwait[item.key];
                    })();
                    // 遍历rightButAwait， 触发应该触发的动画
                    Object.entries(this.rightButAwait).forEach((rbaItem, rbaIndex) => {
                        const rbaItemObj = rbaItem[1];
                        if (rbaItemObj && rbaItemObj.idiomPointArray && rbaItemObj.idiomPointArray.includes(item.key)) {
                            const rbaNewAnswerObj = {
                                ...this.state.answerObj,
                                [rbaItemObj.key]: {
                                    ...rbaItemObj,
                                    filled: true,
                                },
                            };
                            const rbaSurplusAnswer = Object.entries(rbaNewAnswerObj).map(x => {
                                if (x && x[0] && !x[1].filled) {
                                    return x[0];
                                }
                            }).filter(function (s) {
                                return s && s.trim();
                            }); // 未被填充答案的key数组
                            this.setState({
                                answerObj: {
                                    ...this.state.answerObj,
                                    [rbaItemObj.key]: {
                                        ...rbaItemObj,
                                        filled: true,
                                        success: true,
                                        isAwait: false,
                                    },
                                },
                                completedCharacterArray: [...this.state.completedCharacterArray, ...rbaItemObj.idiomPointArray],
                                selectSite: rbaSurplusAnswer[0],
                            }, () => {
                                this.successAnimation(rbaItemObj.idiomPointArray);
                            });
                        }
                    });
                    // // 全部答对逻辑
                } else {
                    if (rightChoice && !isSuccess) { // 选对了，但是尚未触发动画的
                        !this.rightButAwait[item.key] && (() => {
                            this.rightButAwait[item.key] = item;
                        })();
                    } else { // 没选对，从rightButAwait剔除
                        this.rightButAwait[item.key] && (() => {
                            this.rightButAwait[item.key] = null;
                        })();
                        this[`animationText${this.state.selectSite}`] && this[`animationText${this.state.selectSite}`].tada();
                        console.log(item, '???选错的字', this.state.coordinate, item.idiomPointArray.map((key) => { return this.state.coordinate[key].word; }).join(''));
                        GamePage._gameError(item.idiomPointArray.map((key) => { return this.state.coordinate[key].word; }).join(''));
                    }
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    _renderAnswer () {
        try {
            const answerObj = this.state.answerObj;
            if (answerObj) {
                const view = [];
                // const answerKeyList = [];
                for (const key in answerObj) {
                    const item = answerObj[key];
                    // answerKeyList.push(key);
                    view.push(
                        <TouchableOpacity activeOpacity={1} style={[styles.cubeItemAnswer]} key={`answers${item.key}`}
                            onPress={() => {
                                this._checkAnswer(item);
                            }}>
                            {/* eslint-disable-next-line no-return-assign */}
                            <OpacityView ref={ref => this[`answerOpacity${item.key}`] = ref}
                                key={`answererViewKey${item.key}`}
                                style={{ width: '100%', height: '100%', padding: 2 }}>
                                <ImageBackground source={game55} style={[css.flex, { width: '100%', height: '100%' }]}>
                                    <Text style={[styles.squareText, { color: '#353535' }]}>{item.word}</Text>
                                </ImageBackground>
                            </OpacityView>
                        </TouchableOpacity>,
                    );
                }
                return view;
            }
        } catch (e) {
            return null;
        }
    }

    render () {
        const gameTipsPropFn = U.mapValue((res) => {
            return async () => {
                try {
                    if (res) {
                        const ret = await useProp();
                        if (ret && !ret.error) {
                            const answerObj = this.state.answerObj;
                            for (const key in answerObj) {
                                const item = answerObj[key];
                                if (item.key === this.state.selectSite) {
                                    this._checkAnswer(item);
                                    break;
                                }
                            }
                            toast('消耗成功');
                            updateUser();
                        }
                    } else {
                        toast('提示次数不足');
                    }
                } catch (e) {
                    toast('系统出错');
                }
            };
        }, R.path(['3'], propNumsObj));
        return <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#FED465' }]}>
            <View style={[styles.gameHeader, css.flex, css.sp]}>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    N.goBack();
                }}>
                    <ImageAuto source={game14} style={{ marginLeft: 10, width: 40, marginRight: 30 }}/>
                </TouchableOpacity>
                <View style={[css.flex, styles.titleWrap]}>
                    <Text style={styles.gameLabel} karet-lift>第{userLevel}关</Text>
                </View>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    N.navigate('RightProPage');
                }} style={[css.flex, css.fw, styles.ghRightBtn]}>
                    <Text style={{
                        ...styles.rightText,
                        ...{ color: '#FF3154', fontSize: 10 }
                    }} karet-lift> {trCorrectRate} </Text>
                    <Text style={styles.rightText}> 答题正确率 </Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.animatedWrap, css.pr]}>
                {/* 字体动画画布 */}
                <View style={[styles.animatedCanvas, css.pa]}>
                    {this._renderMatrixAnimation()}
                    {/* 帮助栏目 */}
                    <View style={[css.flex, styles.helpWrap, css.js, css.pa, styles.helpWrapPosition]}>
                        {/* eslint-disable-next-line no-return-assign */}
                        <EnlargeView ref={ref => this._chest = ref}>
                            <ImageAuto source={game56} width={30} style={{ width: 30, marginRight: 10 }}/>
                        </EnlargeView>
                        <TouchableOpacity activeOpacity={1} style={[css.flex, styles.helpBtnWrap]} onPress={() => {
                            // GlossaryPage
                            N.navigate('GlossaryPage');
                        }}>
                            <ImageAuto source={game29} style={{ width: 22, marginRight: 5 }}/>
                            <Text style={styles.helpBtnText} numberOfLines={1}>生词本</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} style={{ ...css.flex, ...styles.helpBtnWrap }} karet-lift onPress={gameTipsPropFn}>
                            <ImageAuto source={game9} style={{ width: 22, marginRight: 5 }}/>
                            <Text style={styles.helpBtnText} numberOfLines={1} karet-lift>剩{gameTipsProp}次</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} style={[css.pa, { right: 0 }]} onPress={() => {
                            DeviceEventEmitter.emit('showPop', <GameDialog callback={() => {
                                this.lottieHelp && this.lottieHelp.pause();
                            }} btn={'明白了'} content={
                                <LottieView ref={ref => this.lottieHelp = ref} key={'lottieHelp'} renderMode={'HARDWARE'} style={{ width: '100%', height: 'auto' }} imageAssetsFolder={'help'} source={help} loop={true} autoPlay={true} speed={1}/>
                            }/>);
                        }}>
                            <ImageAuto source={game57} style={{ width: 34, marginRight: 5, top: 8 }}/>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* 游戏画布 */}
                <View style={[styles.gameCanvasWrap]}>
                    <View style={[styles.gameCanvasInner, css.flex, css.fw]}>
                        {this._renderMatrix()}
                    </View>
                </View>
                <View style={[css.flex, styles.helpWrap, css.js, css.pr]} />
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
        ...css.gf
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
        ...css.gf
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
    helpWrapPosition: {
        top: width - 10,
    },
    rightText: {
        color: '#353535',
        fontSize: 10,
        lineHeight: 14,
        textAlign: 'center',
        width: '100%',
        ...css.gf
    },
    squareText: {
        color: '#fff',
        fontSize: FONT_SIZE,
        ...css.gf
    },
    titleWrap: {
        // backgroundColor: 'red',
        flex: 1,
        height: '100%',
    },
});
