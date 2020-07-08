import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    BackHandler
} from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../../components/Header';
export default class WebViewPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            canGoBack: false,
            url: null,
            title: '-'
        };
    }

    async componentDidMount () {
        try {
            const { url, title } = this.props.route.params;
            this.setState({
                url,
                title,
            });
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        } catch (e) {
            console.log(e, 'componentDidMount');
        }
    }

    componentWillUnmount () {
        this.setState({ url: null });
        this.backHandler && this.backHandler.remove();
    }

    onBackAndroid () {
        if (this.state.canGoBack) {
            this._webview.goBack();
        } else {
            this.setState({ url: null });
        }
        return true;
    }

    render () {
        try {
            if (!this.state.url) {
                return <View>
                    <Header label={this.state.title}/>
                </View>;
            }
            let source;
            if (this.state.url && this.state.url.indexOf('http') === 0) {
                source = {
                    uri: this.state.url
                };
            } else {
                source = {
                    html: this.state.url
                };
            }
            return (
                <View style={styles.webWrap}>
                    <Header label={this.state.title}/>
                    <WebView
                        onNavigationStateChange={navState => {
                            this.setState({ canGoBack: navState.canGoBack });
                        }}
                        // injectedJavaScript={JsCode}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        style={styles.webView}
                        originWhitelist={['*']}
                        ref={ref => {
                            this._webview = ref;
                        }}
                        source={source}
                        // onMessage={event => {
                        // }}
                    />
                </View>
            );
        } catch (e) {
            console.log(e);
            return <View/>;
        }
    }
}

const styles = StyleSheet.create({
    webView: {
        flex: 1,
    },
    webWrap: {
        backgroundColor: '#ffffff',
        flex: 1,
    },
});
