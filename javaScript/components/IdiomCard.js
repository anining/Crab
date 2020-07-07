import React, { Component } from 'react';
import { Text, StyleSheet, View, ImageBackground, ScrollView, Dimensions } from 'react-native';
import { css } from '../assets/style/css';
import PropTypes from 'prop-types';
import game6 from '../assets/icon/game/game6.png';
import game30 from '../assets/icon/game/game30.png';
import game64 from '../assets/icon/game/game64.png';
import ImageAuto from './ImageAuto';
const { height, width } = Dimensions.get('window');
export default class IdiomCard extends Component {
    constructor (props) {
        super(props);
        this.state = {};
        this.content = this.props.content;
        this.idiom = this.props.idiom;
    }

    _renderContent () {
        try {
            const view = [];
            this.content.split('').forEach((item) => {
                view.push(<ImageBackground source={game64} style={[css.flex, styles.contentItemWrap]}>
                    <Text style={[styles.contentItemText, css.gf]}>{item}</Text>
                </ImageBackground>);
            });
            return <View style={[css.flex, css.sp, styles.contentWrap]}>{view}</View>;
        } catch (e) {
            return null;
        }
    }

    _renderIdiom () {
        try {
            return <View style={[css.flex, styles.idiomAllWrap, css.fw, css.afs]}>
                <View style={[css.flex, css.js, styles.idiomAllTitleWrap]}>
                    <ImageAuto source={game30} style={{ width: 20, marginRight: 5 }}/>
                    <Text style={styles.idiomAllTitle}>释义</Text>
                </View>
                <Text style={[styles.idiomInnerText]}>
                    {this.idiom.meaning}
                </Text>
                <View style={[css.flex, css.js, styles.idiomAllTitleWrap]}>
                    <ImageAuto source={game6} style={{ width: 20, marginRight: 5 }}/>
                    <Text style={styles.idiomAllTitle}>出处</Text>
                </View>
                <Text style={[styles.idiomInnerText]}>
                    {this.idiom.source}
                </Text>
            </View>;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    render () {
        return (
            <View style={[css.flex, styles.idiomCardWrap, css.afs, css.fw]}>
                {/* 成语部分 */}
                {this._renderContent()}
                {this._renderIdiom()}
            </View>
        );
    }
}

IdiomCard.propTypes = {
    idiom: PropTypes.object,
    content: PropTypes.string
};
IdiomCard.defaultProps = {
    idiom: {
        meaning: '很快乐，不思念蜀国。比喻在新环境中得到乐很快乐，不思念蜀国。比喻在新环境中得到乐趣，不再想回到原来的环境中去',
        source: '《三国志·蜀书·后主传》裴松之注引《汉晋春秋》:“问禅曰：‘颇思蜀否？’禅曰：‘此间乐，不思蜀'
    },
    content: '词不达意'
};

const styles = StyleSheet.create({
    contentItemText: {
        color: '#594134',
        fontSize: 20,
    },
    contentItemWrap: {
        // backgroundColor: '#FFEBCC',
        height: 44,
        overflow: 'hidden',
        width: 44
    },
    contentWrap: {
        height: 80,
        overflow: 'hidden',
        width: '90%'
    },
    idiomAllTitle: {
        color: '#FAB800',
        fontSize: 17,
        ...css.gf
    },
    idiomAllTitleWrap: {
        marginBottom: 10,
        width: '100%',
    },
    idiomAllWrap: {
        backgroundColor: '#FCF0DB',
        borderRadius: 8,
        height: 'auto',
        maxHeight: height * 0.6,
        minHeight: 70,
        overflow: 'hidden',
        padding: 15,
        width: '96%',
    },
    idiomCardWrap: {
        // backgroundColor: 'red',
        paddingHorizontal: 10,
        width: '100%'
    },
    idiomInnerText: {
        color: '#353535',
        fontSize: 17,
        lineHeight: 30,
        ...css.gf,
        textAlign: 'left',
        width: '100%'
    },
    idiomScrollWrap: {
        flex: 1,
        maxHeight: 200,
        width: '100%',
    }
});
