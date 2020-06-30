import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, Text, View, ScrollView, Image } from 'react-native';
import { css } from '../../assets/style/css';
import help1 from '../../assets/icon/help/help1.png';
import { N } from '../../utils/router';
import { helpCenter } from '../../utils/api';

const { width } = Dimensions.get('window');

function HelpCenterPage () {
    const [answers, setAnswers] = useState([]);
    const helpCenterView = [];

    useEffect(() => {
        helpCenter().then(r => {
            if (!r.error) {
                const localArray = [
                    {
                        id: 1,
                        title: '新人必看',
                        children: []
                    },
                    {
                        id: 2,
                        title: '活动相关',
                        children: []
                    },
                    {
                        id: 3,
                        title: '做单教程',
                        children: []
                    },
                    {
                        id: 4,
                        title: '绑定教程',
                        children: []
                    }
                ];
                r.data.forEach(item => localArray[item.category - 1].children.push(item));
                setAnswers(localArray);
            }
        });
    }, []);

    answers.forEach(answer => {
        const { id, title, children } = answer;
        if (children.length === 0) {
            return;
        }
        helpCenterView.push(
            <View style={styles.container} key={id}>
                <Text style={styles.itemTitle}>{title}</Text>
                <RenderAnswerItem children={children} />
            </View>
        );
    });

    return (
        <SafeAreaView style={[css.safeAreaView, { backgroundColor: '#F8F8F8' }]}>
            <ScrollView >
                {helpCenterView}
            </ScrollView>
        </SafeAreaView>
    );
}

function RenderAnswerItem ({ children = [] }) {
    const answersView = [];
    children.forEach(child => {
        const { content, help_center_id, title, video_url } = child;
        answersView.push(
            <TouchableOpacity onPress={() => {
                N.navigate('HelpCenterDetailPage', { content, video_url });
            }} style={styles.item} key={help_center_id}>
                <Text style={{ color: '#666' }}>{title}</Text>
                <Image source={help1} style={{ height: 13, width: 6 }}/>
            </TouchableOpacity>
        );
    });
    return <>{answersView}</>;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginTop: 15,
        paddingLeft: 15,
        width
    },
    item: {
        alignItems: 'center',
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
        paddingRight: 15,
        width: '100%'
    },
    itemTitle: {
        color: '#353535',
        fontSize: 18,
        fontWeight: '500',
        height: 50,
        lineHeight: 50,
        width: '100%'
    }
});

export default HelpCenterPage;
