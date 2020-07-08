import React, { Component } from 'react';
import { Dimensions, SafeAreaView, ScrollView, Text } from 'react-native';
import { css } from '../../assets/style/css';
import { putNotice } from '../../utils/api';
import HTML from 'react-native-render-html';
const { width } = Dimensions.get('window');
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
                    <ScrollView>
                        <HTML html={this.props.route.params.content || ''} imagesMaxWidth={width} tagsStyles={{ p: { lineHeight: 24 } }}/>
                    </ScrollView>
                </SafeAreaView>
            );
        } catch (e) {
            return <Text/>;
        }
    }
}
