import React, { useState, useEffect } from 'react';
import {
    DeviceEventEmitter,
    Dimensions,
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { css } from '../../assets/style/css';
import activity7 from '../../assets/icon/activity/activity7.png';
import Header from '../../components/Header';
import header3 from '../../assets/icon/header/header3.png';
import ImageAuto from '../../components/ImageAuto';
import activity14 from '../../assets/icon/activity/activity14.png';
import { activityDetail, openRedPackage } from '../../utils/api';
import { N } from '../../utils/router';
import { transformMoney, transformTime } from '../../utils/util';
import LottieView from 'lottie-react-native';
import open from '../../lottie/open';
import { getGlobal, getPath } from '../../global/global';
const { width } = Dimensions.get('window');
function OpenMoneyPage (props) {
    const { activityId } = props.route.params;
    const [receivedStatus, setReceivedStatus] = useState(1);// 0 网络请求中，1没有领取过，2 已经领取过了
    const [pageInfo, setPageInfo] = useState([]);
    const [money, setMoney] = useState(0);
    const [data, setData] = useState({});
    const [totalNum, setTotalNum] = useState(0);
    let LottieViewRef;
    useEffect(() => {
        _showPop();
    }, []);

    async function _openRedPackage () {
        const ret = await openRedPackage(activityId);
        !ret.error && _activityDetail();
    }

    function _showPop () {
        const operatorAvatar = getPath(['configObj', 'app_other_info', 'value', 'operatorAvatar'], getGlobal('app'));
        DeviceEventEmitter.emit('showPop', {
            dom: (
                <TouchableOpacity style={[css.pr]} onPress={() => {
                    LottieViewRef && LottieViewRef.play();
                }}>
                    <TouchableOpacity style={[styles.redInnerWrap, css.pa, css.flex, css.fw]}>
                        <ImageAuto style={{
                            width: width * 0.2,
                            borderRadius: width * 0.1,
                            borderWidth: 1,
                            borderColor: '#ee894a'
                        }} source={operatorAvatar}/>
                        <Text style={styles.redNameText}>运营商送你一个红包</Text>
                        <Text style={styles.redTipsText}>现在打开</Text>
                        <Text style={styles.redTipsText}>最低20w金币等着你</Text>
                        <LottieView ref={ref => {
                            ref && (LottieViewRef = ref);
                        }} renderMode={'HARDWARE'} style={[css.pa, { width: width, top: '22%' }]}
                        imageAssetsFolder={'open'} source={open} loop={false} autoPlay={false} speed={2} onAnimationFinish={async () => {
                            await _openRedPackage();
                        }}/>
                    </TouchableOpacity>
                    <ImageAuto width={width * 0.96} source={activity14}/>
                </TouchableOpacity>
            ),
        });
    }

    function _activityDetail () {
        activityDetail(activityId || 2).then(r => {
            if (r && !r.error) {
                const { data } = r;
                const { total_num, all_history, log } = data;
                const { money } = log;
                if (money) {
                    setData(data);
                    setReceivedStatus(2);
                    setPageInfo(all_history);
                    setMoney(money);
                    setTotalNum(total_num);
                    DeviceEventEmitter.emit('hidePop');
                } else {
                    setReceivedStatus(1);
                    _showPop();
                }
            } else {
                N.goBack();
            }
        });
    }

    function RenderRedPackage ({ receivedStatus, activityId, money, data }) {
        if (receivedStatus !== 2) {
            return <Text style={[css.pa, styles.openMainBtn]} onPress={() => {
                _showPop();
            }}>打开红包</Text>;
        }

        const { title, icon: uri } = data;

        return (
            <View style={styles.redPackageView}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={styles.redPackageAvatar} source={{ uri }}/>
                    <Text style={styles.redPackageText}>{title}</Text>
                </View>
                <Text style={{ fontSize: 15, color: '#FDEAB9' }}>恭喜您获得</Text>
                <Text style={{ fontWeight: '500', color: 'rgba(254,204,81,1)' }}><Text
                    style={{ fontSize: 49, fontWeight: '800' }}>{money}W</Text> 金币</Text>
                <TouchableOpacity style={styles.withdrawBtn} onPress={() => {
                    N.navigate('DailyMoneyPage', { activityId, pageInfo: data });
                }}>
                    <Text style={{ fontSize: 16, color: '#fff' }}>立即兑换</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#f8f8f8' }]}>
            <ScrollView style={[{ flex: 1, backgroundColor: '#f8f8f8' }]}>
                <ImageBackground source={activity7} style={styles.dmWrap}>
                    <Header color={'#fff'} label={'天天领现金'}
                        style={{ backgroundColor: 'rgba(0,0,0,0)', borderBottomWidth: 0 }} icon={header3}/>
                    <RenderRedPackage money={money} receivedStatus={receivedStatus} activityId={activityId}
                        data={data}/>
                </ImageBackground>
                <RenderView receivedStatus={receivedStatus} pageInfo={pageInfo} totalNum={totalNum}/>
            </ScrollView>
        </SafeAreaView>
    );
}

function RenderView ({ receivedStatus, pageInfo, totalNum }) {
    if (receivedStatus !== 2) {
        return <></>;
    }
    const view = [];
    pageInfo.forEach(item => {
        const { created_at, money, user_nickname, avatar: uri } = item;
        view.push(
            <View style={styles.listView}>
                <Image style={styles.listAvatar} source={{ uri }}/>
                <View style={styles.listRight}>
                    <View>
                        <Text numberOfLines={1}
                            style={{ color: 'rgba(53,53,53,1)', fontSize: 16, maxWidth: 250 }}>{user_nickname}</Text>
                        <Text numberOfLines={1}
                            style={{ color: 'rgba(53,53,53,1)', fontSize: 13 }}>{transformTime(created_at)}</Text>
                    </View>
                    <Text numberOfLines={1} style={{ color: 'rgba(53,53,53,1)', fontSize: 16 }}>{transformMoney(money)}金币</Text>
                </View>
            </View>,
        );
    });
    return (
        <View style={styles.listContainer}>
            <Text style={styles.listTitle}>已领取 {totalNum} 个</Text>
            {view}
        </View>
    );
}

const styles = StyleSheet.create({
    dmWrap: {
        height: 1056 / 1128 * width,
        width: width,
    },
    listAvatar: {
        borderRadius: 45,
        height: 45,
        marginRight: 10,
        width: 45,
    },
    listContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 40,
        width,
    },
    listRight: {
        alignItems: 'center',
        borderBottomColor: 'rgba(237,237,237,1)',
        borderBottomWidth: 1,
        flex: 1,
        flexDirection: 'row',
        height: 65,
        justifyContent: 'space-between',
    },
    listTitle: {
        color: 'rgba(153,153,153,1)',
        fontSize: 12,
        lineHeight: 50,
    },
    listView: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 65,
    },
    loadingText: {
        color: '#fff',
        fontSize: 15,
        marginTop: width * 0.3,
        textAlign: 'center',
        width: '100%',
    },
    openMainBtn: {
        backgroundColor: '#FECD5B',
        borderRadius: 25,
        color: '#834D00',
        fontSize: 18,
        height: 50,
        left: '50%',
        lineHeight: 50,
        overflow: 'hidden',
        textAlign: 'center',
        top: '50%',
        transform: [{ translateX: -width * 0.4 }],
        width: width * 0.8,
    },
    redInnerWrap: {
        flex: 1,
        paddingTop: width * 0.15,
        width: '100%'
    },
    redNameText: {
        color: '#FDFAB1',
        fontSize: 14,
        lineHeight: 40,
        marginTop: 10,
        textAlign: 'center',
        width: '100%',
    },
    redPackageAvatar: {
        borderRadius: 16,
        height: 32,
        marginRight: 10,
        width: 32,
    },
    redPackageText: {
        color: '#FDEAB9',
        fontSize: 17,
        fontWeight: '500',
    },
    redPackageView: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-around',
        paddingBottom: '10%',
        paddingTop: '10%',
    },
    redTipsText: {
        color: '#FDFAB1',
        fontSize: 17,
        fontWeight: '900',
        lineHeight: 40,
        textAlign: 'center',
        width: '100%',
    },
    withdrawBtn: {
        alignItems: 'center',
        backgroundColor: 'rgba(252,192,43,1)',
        borderRadius: 20,
        height: 40,
        justifyContent: 'center',
        width: width * 0.6,
    },
});

export default OpenMoneyPage;
