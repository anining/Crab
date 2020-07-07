import React, { Component } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { css } from '../../assets/style/css';
import { putNotice } from '../../utils/api';
export default class NoticeDetailPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount () {
        try {
            if ('notice_id' in this.props.route.params) {
                await putNotice(this.props.route.params.notice_id);
            }
        } catch (e) {
            console.log(e);
        }
    }

    render () {
        try {
            return (
                <SafeAreaView style={[css.safeAreaView, { padding: 15 }]}>
                    <Text style={{ lineHeight: 25 }}>{this.props.route.params.content || ''}</Text>
                </SafeAreaView>
            );
        } catch (e) {
            return <Text/>;
        }
    }
}
