import { Component } from 'react';
import * as React from 'karet';
import { Dimensions, SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { css } from '../../assets/style/css';
import Slider from '../../components/Slider';
import ComTitle from '../../components/ComTitle';
import ImageAuto from '../../components/ImageAuto';
import answer1 from '../../assets/icon/answer/answer1.png';
import answer2 from '../../assets/icon/answer/answer2.png';
import answer3 from '../../assets/icon/answer/answer3.png';
import answer4 from '../../assets/icon/answer/answer4.png';
import answer5 from '../../assets/icon/answer/answer5.png';
import answer6 from '../../assets/icon/answer/answer6.png';
import answer7 from '../../assets/icon/answer/answer7.png';
import answer8 from '../../assets/icon/answer/answer8.png';
import answer9 from '../../assets/icon/answer/answer9.png';
import answer10 from '../../assets/icon/answer/answer10.png';
import answer11 from '../../assets/icon/answer/answer11.png';
import answer12 from '../../assets/icon/answer/answer12.png';
import answer13 from '../../assets/icon/answer/answer13.png';
import answer14 from '../../assets/icon/answer/answer14.png';
import Shadow from '../../components/Shadow';
import { _if, _tc } from '../../utils/util';
import Button from '../../components/Button';
import { N } from '../../utils/router';
import { getter } from '../../utils/store';

const { height, width } = Dimensions.get('window');
// btnStatus: 状态: 1进行中2待领取3已完成4敬请期待
const sprog = [{
    icon: answer1,
    label: '绑定账号，领金币',
    minTitle: '看视频还有很多小攻略',
    money: 5000,
    btnText: '领取奖励',
    btnStatus: 1,
}, {
    icon: answer3,
    label: '看视频，领金币',
    minTitle: '看视频还有很多小攻略',
    money: 5000,
    btnText: '领取奖励',
    btnStatus: 1,
}, {
    icon: answer13,
    label: '做任务，领金币',
    minTitle: '看视频还有很多小攻略',
    money: 5000,
    btnText: '领取奖励',
    btnStatus: 1,
}];
const taskList = [{
    icon: answer1,
    label: '绑定账号，领金币',
    minTitle: '看视频还有很多小攻略',
    btnText: '领取奖励',
    btnStatus: 1,
}, {
    icon: answer3,
    label: '看视频，领金币',
    minTitle: '看视频还有很多小攻略',
    btnText: '领取奖励',
    btnStatus: 1,
}, {
    icon: answer13,
    label: '做任务，领金币',
    minTitle: '看视频还有很多小攻略',
    btnText: '领取奖励',
    btnStatus: 1,
}];
const signList = [{
    money: 1000,
    sign: true,
    prop: false,
}, {
    money: 1000,
    sign: true,
    prop: false,
}, {
    money: 1000,
    sign: true,
    prop: false,
}, {
    money: 1000,
    sign: true,
    prop: false,
}, {
    money: 1000,
    sign: true,
    prop: false,
}, {
    money: 1000,
    sign: false,
    prop: false,
}, {
    money: 0,
    sign: false,
    prop: answer7,
}];
const { banner } = getter(['banner']);
export default class AnswerPage extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    renderList (list) {
        try {
            const view = [];
            list && list.forEach((item, index) => {
                view.push(
                    <View style={[styles.answerItemWrap, css.flex, css.sp, {
                        borderBottomWidth: index + 1 >= list.length ? 0 : 1,
                    }]} key={`${index}list`}>
                        <View style={[css.flex, styles.aiwLeft, css.js]}>
                            <ImageAuto source={item.icon} width={40}/>
                            <View style={[css.flex, css.fw, styles.aiwText]}>
                                <View style={[css.flex, css.js, { width: '100%' }]}>
                                    <Text style={[styles.labelText, { width: 'auto' }]}
                                        numberOfLines={1}>{item.label}</Text>
                                    {_if(item.money, res => <Text style={styles.labelMoney}
                                        numberOfLines={1}> +{res}</Text>)}
                                    {_if(item.money, res => <ImageAuto source={answer14} width={20}/>)}
                                </View>
                                <Text style={[styles.labelText, styles.labelMinTitle]}
                                    numberOfLines={1}>{item.minTitle}</Text>
                            </View>
                        </View>
                        <Shadow style={styles.todoBtn} color={'#d43912'}>
                            <Text style={styles.todoBtnText} karet-lift>领取奖励</Text>
                        </Shadow>
                    </View>,
                );
            });
            return view;
        } catch (e) {
            return null;
        }
    }

    _renderSignList () {
        const view = [];
        signList.forEach((item, index) => {
            view.push(<View key={`sign${index}`} style={[css.flex, css.fw, styles.signItemWrap, {
                backgroundColor: item.sign ? '#FF9C00' : '#F0F0F0',
            }]}>
                <Text style={[styles.signText, {
                    color: item.sign ? '#fff' : '#353535',
                }]}>{_if(item.money, res => res)}</Text>
                <ImageAuto source={item.prop ? item.prop : item.sign ? answer11 : answer9} width={width * 0.08}/>
                <Text style={[styles.signText, {
                    color: item.sign ? '#fff' : '#353535',
                    lineHeight: 18,
                }]}>{index + 1}天</Text>
            </View>);
        });
        return view;
    }

    _renderDaySign () {
        try {
            const that = this;
            const view = [];
            view.push(<View key={'dayList'} style={[styles.signAllTopWrap, css.flex]}>
                {this._renderSignList()}
            </View>);
            view.push(<View key={'signWrap'} style={[css.flex, css.sp, styles.signAllWrap]}>
                <View style={[css.flex, css.fw, styles.signTipsWrap]}>
                    <Text style={[styles.signTipsText, styles.maxSTT]}>完成进度: <Text style={{ color: '#FF6C00' }}>5</Text>/10</Text>
                    <Text style={[styles.signTipsText]}>提交并通过10单任务即可签到</Text>
                </View>
                <Button width={120} name={'签到领钱'} shadow={'#ff0008'}/>
            </View>);
            return view;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    _renderActivity () {
        try {
            const view = [];
            view.push(
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    N.navigate('DailyRedPackagePage');
                }}>
                    <ImageAuto source={answer5} width={width * 0.9 * 0.48}/>
                </TouchableOpacity>,
            );
            view.push(
                <View style={[css.flex, css.fw, styles.activityRight]}>
                    <TouchableOpacity activeOpacity={1} style={styles.arItemWrap} onPress={() => {
                        N.navigate('SharePage');
                    }}>
                        <ImageAuto source={answer6} width={width * 0.9 * 0.48}/>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.arItemWrap} onPress={() => {
                        N.navigate('DailyMoneyPage');
                    }}>
                        <ImageAuto source={answer8} width={width * 0.9 * 0.48}/>
                    </TouchableOpacity>
                </View>,
            );
            return <View style={[css.flex, css.sp, { paddingHorizontal: 10 }]} key={'activity'}>{view}</View>;
        } catch (e) {
            return null;
        }
    }

    render () {
        return <SafeAreaView style={[{ flex: 1, paddingTop: 20, backgroundColor: '#fff' }]}>
            <ScrollView style={[{ flex: 1 }]}>
                <View style={{ height: 20 }}/>
                <Slider data={banner.get()} height={width * 0.35} autoplay={true}/>
                <View style={styles.answerWrap}>
                    <ComTitle title={'每日签到'} minTitle={<Text style={css.minTitle}>
                        连续签到得 <Text style={{ color: '#FF6C00' }}>提现免手续费特权卡!</Text>
                    </Text>}/>
                    {this._renderDaySign()}
                </View>
                <View style={{ height: 15, backgroundColor: '#f8f8f8' }}/>
                <View style={styles.answerWrap}>
                    <ComTitle title={'火爆活动'}/>
                    {/* {this.renderList(sprog)} */}
                    {this._renderActivity()}
                </View>
                <View style={{ height: 15, backgroundColor: '#f8f8f8' }}/>
                <View style={styles.answerWrap}>
                    <ComTitle title={'新手福利'}/>
                    {this.renderList(sprog)}
                </View>
                <View style={{ height: 15, backgroundColor: '#f8f8f8' }}/>
                <View style={styles.answerWrap}>
                    <ComTitle title={'领金币'}/>
                    {this.renderList(taskList)}
                </View>
                <View style={{ height: 20, backgroundColor: '#f8f8f8' }}/>
            </ScrollView>
        </SafeAreaView>;
    }
}
const styles = StyleSheet.create({
    activityRight: {
        height: '100%',
        marginLeft: width * 0.9 * 0.05,
    },
    aiwLeft: {
        height: '100%',
        overflow: 'hidden',
        width: width * 0.9 - 80,
    },
    aiwText: {
        height: '100%',
        overflow: 'hidden',
        paddingLeft: 10,
        width: width * 0.9 - 120,
    },
    answerItemWrap: {
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        height: 65,
        paddingHorizontal: 10,
        width: width * 0.9,
        ...css.auto,
        backgroundColor: '#fff',
    },
    answerWrap: {
        backgroundColor: '#fff',
        height: 'auto',
        // marginTop: 15,
        minHeight: 100,
        paddingHorizontal: 10,
        paddingVertical: 15,
        width: '100%',
    },
    arItemWrap: {
        height: 'auto',
        marginBottom: width * 0.05,
        width: '100%',
    },
    labelMinTitle: {
        color: '#999',
        fontSize: 11,
    },
    labelMoney: {
        color: '#FF6C00',
        fontSize: 14,
        fontWeight: '900',
    },
    labelText: {
        color: '#222',
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'left',
        width: '100%',
    },
    maxSTT: {
        color: '#222',
        fontSize: 13,
        fontWeight: '900',
    },
    signAllTopWrap: {
        marginTop: 15,
    },
    signAllWrap: {
        height: 70,
        marginTop: 10,
        paddingHorizontal: 5,
    },
    signItemWrap: {
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        height: 70,
        marginRight: width * 0.9 * 0.01,
        overflow: 'hidden',
        width: width * 0.9 * 0.132,
    },
    signText: {
        color: '#666',
        fontSize: 10,
        lineHeight: 12,
        textAlign: 'center',
        width: '100%',
    },
    signTipsText: {
        color: '#353535',
        fontSize: 12,
        lineHeight: 22,
        textAlign: 'left',
        width: '100%',
    },
    signTipsWrap: {
        height: '100%',
        width: width * 0.9 - 120,
    },
    todoBtn: {
        borderRadius: 13,
        height: 26,
        width: 70,
    },
    todoBtnText: {
        backgroundColor: '#FF3E00',
        borderRadius: 12,
        color: '#fff',
        fontSize: 12,
        height: 26,
        lineHeight: 26,
        textAlign: 'center',
        width: '100%',
    },
});
