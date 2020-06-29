import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { css } from '../assets/style/css';
import PropTypes from 'prop-types';
import game6 from '../assets/icon/game/game6.png';
import game30 from '../assets/icon/game/game30.png';

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
                view.push(<View style={[css.flex, styles.contentItemWrap]}>
                    <Text style={[styles.contentItemText, css.gf]}>{item}</Text>
                </View>);
            });
            return <View style={[css.flex, css.sp, styles.contentWrap]}>{view}</View>;
        } catch (e) {
            return null;
        }
    }

    _renderIdiom () {
        try {
            return <View style={[styles.idiomAllWrap]}>

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
        meaning: '译义',
        source: '出处'
    },
    content: '词不达意'
};

const styles = StyleSheet.create({
    contentItemText: {
        color: '#594134',
        fontSize: 20,
    },
    contentItemWrap: {
        backgroundColor: '#FFEBCC',
        height: 44,
        overflow: 'hidden',
        width: 44
    },
    contentWrap: {
        height: 80,
        overflow: 'hidden',
        width: '90%'
    },
    idiomAllWrap: {
        backgroundColor: '#FCF0DB',
        borderRadius: 8,
        height: 'auto',
        minHeight: 100,
        overflow: 'hidden',
        width: '96%'
    },
    idiomCardWrap: {
        backgroundColor: 'red',
        paddingHorizontal: 10,
        width: '100%'
    }
});
