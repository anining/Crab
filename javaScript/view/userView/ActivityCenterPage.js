import React, { useEffect, useState } from 'react';
import { SafeAreaView, Image, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { css } from '../../assets/style/css';
import { N } from '../../utils/router';
import { activity } from '../../utils/api';
import { transformTime } from '../../utils/util';
import { getActivityDetail } from '../../utils/update';

function ActivityCenterPage () {
    const [data, setData] = useState([]);
    const view = [];

    useEffect(() => {
        activity().then(r => {
            !r.error && setData(r.data);
        });
    }, []);

    data.forEach(item => {
        const { activity_id, des, path, icon: uri, start_datetime, end_datetime, title } = item;
        view.push(
            <View style={styles.itemView} key={activity_id}>
                <View style={[css.flexRCSB, styles.item]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={{ uri }} style={styles.image} />
                        <Text numberOfLines={1} style={{ fontWeight: '500', color: '#353535', maxWidth: 150 }}>{title}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        if (path === 'OpenMoneyPage') {
                            getActivityDetail();
                        } else {
                            N.navigate(path);
                        }
                    }}>
                        <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: '500', color: '#353535' }}>查看详情 》</Text>
                    </TouchableOpacity>
                </View>
                <Text numberOfLines={2} style={styles.text}>{des}</Text>
                <View style={[styles.item, css.flexRCSB, { borderTopWidth: 1, borderTopColor: '#EDEDED', marginTop: 20 }]}>
                    <Text numberOfLines={1} style={{ maxWidth: 250, color: '#666', fontSize: 12 }}>活动时间：{transformTime(start_datetime)} - {transformTime(end_datetime)}</Text>
                </View>
            </View>
        );
    });

    return (
        <SafeAreaView style={[css.safeAreaView, { paddingLeft: 15, paddingRight: 15, flex: 1, backgroundColor: '#F8F8F8' }]}>
            {view}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    image: {
        height: 20,
        marginRight: 5,
        width: 20
    },
    item: {
        height: 50,
        paddingLeft: 15,
        paddingRight: 15,
        width: '100%'
    },
    itemView: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        marginTop: 10,
        minHeight: 150
    },
    text: {
        color: '#999',
        fontSize: 12,
        lineHeight: 25,
        paddingLeft: 15,
        paddingRight: 15
    }
});

export default ActivityCenterPage;
