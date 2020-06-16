import React, { Component } from 'react';
import { StyleSheet, Text, ScrollView, RefreshControl } from 'react-native';
import { ChineseNormalFooter, ChineseNormalHeader } from 'react-native-spring-scrollview/Customize';
import { LargeList } from 'react-native-largelist-v3';
let page = 1;
/**
 * 使用说明
 * 通用列表，更方便的使用list,不用关心page等处理
 * <ListGeneral
 itemHeight={itemHeight}
 itemMarginTop={itemMarginTop}
 getList={async (page, num, callback) => {...}} // 获取列表的api
 renderItem={(item, index) => {  return (  <View>{this._renderList.call(this, item, index)}</View> );}}
 />**/
export default class ListGeneral extends Component {
    constructor (props) {
        super(props);
        this.state = {
            list: [{
                items: [],
            }],
            allLoaded: false, // 数据全部加载完成
            empty: null,
            refreshing: false,
        };
        this._list = null;
        this.num = this.props.num || 10; // 默认一页10个,非必填
    }

    componentDidMount () {
        this._onRefresh();
    }

    componentWillUnmount () {
        try {
            this.setState = () => {
                return null;
            };
        } catch (e) {
            console.log(e);
        }
    }

    /* 列 的每一个元素UI */
    _renderIndexPath ({ section, row }) {
        const item = this.state.list[section].items[row];
        if (this.props.renderItem && typeof this.props.renderItem === 'function') {
            return this.props.renderItem(item, row);
        } else {
            return null;
        }
    }

    _netWork () {
        if (typeof this.props.getList === 'function') {
            this.setState({
                refreshing: true,
            });
            this.props.getList(page, this.num, (results) => {
                this._enRefresh();
                /* 如果网络请求的数据不存在或者为空，则表示列表数据全部加载完成 */
                if (!results || !results.length) {
                    if (page === 1) {
                        this.setState({
                            list: [{
                                items: [],
                            }],
                            empty: true,
                            allLoaded: true,
                            refreshing: false,
                        });
                    } else {
                        this.setState({
                            empty: null,
                            allLoaded: true,
                            refreshing: false,
                        });
                    }
                    return false;
                }
                const list = this.state.list;
                let ret = results;
                if (this.props.formatData && typeof this.props.formatData === 'function') {
                    if (page === 1) {
                        ret = this.props.formatData(results);
                    } else {
                        ret = [...list[0].items, ...this.props.formatData(results)];
                    }
                } else {
                    if (page === 1) {
                    } else {
                        ret = [...list[0].items, ...results];
                    }
                }
                list[0].items = ret;
                this.setState({
                    list: list,
                    empty: null,
                    refreshing: false,
                });
            });
        }
    }

    _onEndReached () {
        // EndRefresh判断是否需要上拉加载
        if (this.props.EndRefresh) {
            this._enRefresh();
        } else {
            if (!this.state.allLoaded) {
                page += 1;
                this._netWork();
            }
        }
    }

    _onRefresh () {
        page = 1;
        this.setState({
            allLoaded: null,
        }, () => {
            this._netWork();
        });
        if (this.props.refresh && typeof this.props.refresh === 'function') {
            this.props.refresh();
        }
    }

    _enRefresh () {
        if (this._list) {
            try {
                this._list.endRefresh();
                this._list.endLoading();
            } catch (e) {
                console.log(e);
            }
        }
    }

    renderHeader () {
        if (this.props.renderHeader && typeof this.props.renderHeader === 'function') {
            try {
                return this.props.renderHeader();
            } catch (e) {
                console.log(e);
            }
        }
    }

    render () {
        if (!('itemHeight' in this.props) || !('itemMarginTop' in this.props)) {
            return (
                <Text style={styles.error}>
                    {/* 提示使用者itemHeight 或 itemMarginTop 必填 */}
                    itemHeight or itemMarginTop not in Props !
                </Text>);
        }
        if (!this.props.getList || !this.props.renderItem) {
            return (
                <Text style={styles.error}>
                    {/* 提示使用者getList 或 renderItem 必填 */}
                    getList or renderItem not in Props !
                </Text>);
        }
        const listView = [];
        if (!this.state.list[0].items.length) {
            const emptyView = this.props.empty || <Text>null</Text>;
            listView.push(emptyView);
            return <ScrollView refreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh.bind(this)}
                    colors={['#c88883', '#ffa11b']}
                    tintColor={'#ffa11b'}
                    size={10}
                />
            } showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                {listView}
            </ScrollView>;
        } else {
            listView.push(
                <LargeList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    ref={ref => (this._list = ref)}
                    key={'largeList'}
                    style={styles.largeList}
                    data={this.state.list}
                    renderHeader={this.renderHeader.bind(this)}
                    onScroll={({ nativeEvent: { contentOffset: { x, y } } }) => {
                        if (this.props.onScroll && typeof this.props.onScroll === 'function') {
                            this.props.onScroll(x, y);
                        }
                    }}
                    heightForIndexPath={() => this.props.itemHeight + this.props.itemMarginTop}
                    renderIndexPath={this._renderIndexPath.bind(this)}
                    onRefresh={this._onRefresh.bind(this)}
                    onLoading={this._onEndReached.bind(this)}
                    allLoaded={this.state.allLoaded}
                    refreshHeader={ChineseNormalHeader}
                    loadingFooter={ChineseNormalFooter}
                />,
            );
            return listView;
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
    largeList: {
        flex: 1,
    },
});
