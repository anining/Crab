import React, { Component } from 'react';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { StyleSheet, Text, View } from 'react-native';

/**
 * 使用示例
 <ListHeader>
 <View tabLabel="React"></View>
 <View tabLabel="React1"></View>
 </ListHeader>
 * **/
export default class ListHeader extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render () {
        try {
            if (this.props.children && Array.isArray(this.props.children)) {
                return <ScrollableTabView style={{}} initialPage={this.props.value || 0} tabBarInactiveTextColor={'#999999'}
                    tabBarActiveTextColor={'#3E3E3E'} tabBarUnderlineStyle={styles.tabBarUnderLine} renderTabBar={() => (
                        <ScrollableTabBar style={{ borderBottomWidth: 0 }} />
                    )}>
                    {this.props.children}
                </ScrollableTabView>;
            } else {
                return (
                    <Text style={styles.error}>
                        this.props.children mast isArray
                    </Text>);
            }
        } catch (e) {
            return (
                <Text style={styles.error}>
                    this.props.children mast isArray
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
