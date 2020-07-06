import React from "react";
import { LoadingFooter, FooterStatus } from "./LoadingFooter";
import {
    ActivityIndicator,
    Animated,
    View,
    StyleSheet,
    Text
} from "react-native";

export class MyLoadFooter extends LoadingFooter {
    static height = 80;

    static style = "stickyContent";

    render() {
        if (this.state.status === "allLoaded")
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>{this.getTitle()}</Text>
                </View>
            );
        return (
            <View style={styles.container}>
                {this._renderIcon()}
                <View style={styles.rContainer}>
                    <Text style={styles.text}>{this.getTitle()}</Text>
                    {/*{this.renderContent()}*/}
                </View>
            </View>
        );
    }

    _renderIcon() {
        const s = this.state.status;
        if (s === "loading" || s === "cancelLoading" || s === "rebound") {
            return <ActivityIndicator color={"#FF6C00"} size={22}/>;
        }
        const { maxHeight, offset, bottomOffset } = this.props;
        return (
            <Animated.Image
                source={require("../assets/icon/login/loading.png")}
                style={{
                    width: 22,
                    height: 22,
                    transform: [
                        {
                            rotate: offset.interpolate({
                                inputRange: [
                                    bottomOffset - 1 + 45,
                                    bottomOffset + 45,
                                    bottomOffset + maxHeight,
                                    bottomOffset + maxHeight + 1
                                ],
                                outputRange: ["180deg", "180deg", "0deg", "0deg"]
                            })
                        }
                    ]
                }}
            />
        );
    }

    renderContent(){
        return null;
    }

    getTitle() {
        const s = this.state.status;
        if (s === "dragging" || s === "waiting") {
            return "加载更多";
        } else if (s === "draggingEnough") {
            return "松开加载更多";
        } else if (s === "loading") {
            return "加载中";
        } else if (s === "draggingCancel") {
            return "放弃加载";
        } else if (s === "rebound") {
            return "加载完成";
        } else if (s === "allLoaded") {
            return "到底啦";
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    rContainer: {
        marginLeft: 20
    },
    text: {
        marginVertical: 5,
        fontSize: 14,
        color: "#FF6C00",
        textAlign: "center",
    }
});
