import React, { Component } from 'react';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { StyleSheet, Text, View } from 'react-native';

/**
 * 使用示例
 <ListHeader label={["页面1", "页面2"]}/>
 * **/
export default class ListHeader extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidMount () {
        console.log(this.props);
    }

    renderChild () {
        const view = [];
        console.log(this.props.children);
        view.push(<View tabLabel="React">
            <Text>321</Text>
        </View>);
        return view;
    }

    render () {
        try {
            if (this.props.label.length && Array.isArray(this.props.label)) {
                return <ScrollableTabView style={{}} value={this.props.value || 0} tabBarInactiveTextColor={'#999999'}
                    tabBarActiveTextColor={'#3E3E3E'} tabBarUnderlineStyle={styles.tabBarUnderLine} renderTabBar={() => (
                        <ScrollableTabBar style={{ borderBottomWidth: 0 }} />
                    )}>
                    {this.renderChild.call(this)}
                </ScrollableTabView>;
            } else {
                return (
                    <Text style={styles.error}>
                        label not in Props ! as:  label: ["page1", "page2"]
                    </Text>);
            }
        } catch (e) {
            return (
                <Text style={styles.error}>
                    label not in Props ! as:  label: ["page1", "page2"]
                </Text>);
        }
    }
}
const styles = StyleSheet.create({
    error: {
        color: '#666666',
        height: 80,
        lineHeight: 80,
        textAlign: 'center',
        width: '100%',
    },
    tabBarUnderLine: {
        backgroundColor: '#FF6C00',
        borderRadius: 2,
        height: 4,
        marginBottom: 4,
        transform: [{ scaleX: 0.5 }],
    },
});
