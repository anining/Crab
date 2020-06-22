import React, { Component } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { css } from '../../assets/style/css';
import game14 from '../../assets/icon/game/game14.png';
import game9 from '../../assets/icon/game/game9.png';
import game29 from '../../assets/icon/game/game29.png';
import game30 from '../../assets/icon/game/game30.png';
import game32 from '../../assets/icon/game/game32.png';
import game33 from '../../assets/icon/game/game33.png';
import game34 from '../../assets/icon/game/game34.png';
import game38 from '../../assets/icon/game/game38.png';
import ImageAuto from '../../components/ImageAuto';
import { N } from '../../utils/router';
import { _gv, _tc } from '../../utils/util';
import { getGame } from '../../utils/api';
const { height, width } = Dimensions.get('window');
const CANVAS_WIDTH = width - 20;
const CUBE_WIDTH = Math.floor((CANVAS_WIDTH) / 9);
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
// {"error":null,"data":{"created_at":"2020-06-16T16:38:10.086015","updated_at":"2020-06-22T21:10:17.464136","level_id":1,"level":1,"content":["\u4e3a\u6240\u6b32\u4e3a","\u4e3a\u5229\u662f\u56fe","\u6e14\u7fc1\u5f97\u5229","\u60a3\u5f97\u60a3\u5931"],"rate":0.1}}?
export default class GamePage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            gameInfo: null,
            coordinate: [],
        };
        this.rankType = Math.random() > 0.5 ? 0 : 1; // 0是横着排列，1是竖着排列
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
                    // coordinate: this._countMaxPoint(ret.data),
                });
            } else {
                if (ret.error === 10) {
                    N.goBack();
                }
            }
        });
    }

    // _countMaxPoint (data) {
    //     try {
    //         const coordinate = [];
    //         let nowSite = [0, 0];
    //         let str = '';
    //         data.content.forEach((item, index) => {
    //             const focusPoint = this.repeatStr(str, index);
    //             if (this.rankType === 0) {
    //                 nowSite = [nowSite[0] + focusPoint[0], nowSite[1] - focusPoint[1]];
    //                 item.split('').forEach((item, index) => {
    //                     coordinate.push([nowSite[0] + index, nowSite[1]]);
    //                 });
    //             } else {
    //                 nowSite = [nowSite[0] - focusPoint[1], nowSite[1] - focusPoint[1]];
    //                 item.split('').forEach((item, index) => {
    //                     coordinate.push([nowSite[0] + index, nowSite[1]]);
    //                 });
    //             }
    //             this.rankType = Number(!this.rankType);
    //             str = item;
    //         });
    //         console.log(coordinate);
    //         return coordinate;
    //     } catch (e) {
    //         return [];
    //     }
    // }

    repeatStr (oldStr, newStr) { // 老字符串， 新字符串
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
            return [0, 0];
        }
    }

    _renderMatrix () {
        if (this.state.gameInfo) {
            const view = [];
            matrix.forEach((matrixLineArray, yIndex) => {
                matrixLineArray.forEach((item, xIndex) => {
                    view.push(<View style={styles.cubeItem} key={`Game${xIndex}${yIndex}`}>
                        <Text>{xIndex}{yIndex}</Text>
                    </View>);
                });
            });
            return view;
        } else {
            return null;
        }
    }

    render () {
        return <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#FED465' }]}>
            <View style={[styles.gameHeader, css.flex, css.sp]}>
                <TouchableOpacity activeOpacity={1} onPress={() => { N.goBack(); }}>
                    <ImageAuto source={game14} style={{ marginLeft: 10, width: 40, marginRight: 30 }}/>
                </TouchableOpacity>
                <View style={[css.flex, styles.titleWrap]}>
                    <Text style={styles.gameLabel}>第127关</Text>
                </View>
                <TouchableOpacity activeOpacity={1} onPress={() => { }} style={[css.flex, css.fw, styles.ghRightBtn]}>
                    <Text style={[styles.rightText, { color: '#FF3154', fontSize: 12, }]}> 95% </Text>
                    <Text style={styles.rightText}>
                        答题正确率
                    </Text>
                </TouchableOpacity>
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
                <TouchableOpacity activeOpacity={1} style={[css.flex, styles.helpBtnWrap, css.pa, { right: 0, marginRight: 0 }]}>
                    <ImageAuto source={game30} style={{ width: 22, marginRight: 5 }}/>
                    <Text style={styles.helpBtnText} numberOfLines={1}>帮助</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>;
    }
}
const styles = StyleSheet.create({
    cubeItem: {
        backgroundColor: 'red',
        height: CUBE_WIDTH,
        overflow: 'hidden',
        width: CUBE_WIDTH
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
        marginVertical: 20,
        overflow: 'hidden',
        paddingBottom: 10,
    },
    gameHeader: {
        height: 80,
        overflow: 'hidden',
        paddingTop: 30,
        width
    },
    gameLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900'
    },
    ghRightBtn: {
        backgroundColor: 'rgba(255,255,255, .5)',
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        height: 40,
        overflow: 'hidden',
        paddingLeft: 6,
        width: 80
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
        width: 90
    },
    helpWrap: {
        height: 40,
        width: width - 20,
        ...css.auto,
        overflow: 'hidden'
    },
    rightText: {
        color: '#353535',
        fontSize: 10,
        lineHeight: 14,
        textAlign: 'center',
        width: '100%'
    },
    titleWrap: {
        // backgroundColor: 'red',
        flex: 1,
        height: '100%'
    }
});
