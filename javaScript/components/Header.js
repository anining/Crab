import React from 'react';
import {Dimensions, Text, Image, TouchableOpacity, StyleSheet, View} from 'react-native';

const {height, width} = Dimensions.get('window');

export default function Header({scene, previous, navigation}) {
  const {options} = scene.descriptor;

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={() => {
          navigation.goBack();
        }} style={styles.returnBtn}>
          <Image source={require('../assets/icon/header/header-return.png')} style={styles.return}/>
        </TouchableOpacity>
      </View>
      <Text style={styles.headerCenter}>{options.title || scene.route.name}</Text>
      <View style={styles.headerRight}/>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width,
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  headerLeft: {
    height: 50,
    width: 70,
  },
  returnBtn: {
    height: 50,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    height: 50,
    width: 70,
    lineHeight: 50,
    textAlign: 'center',
  },
  headerCenter: {
    height: 50,
    width: width - 140,
    lineHeight: 50,
    textAlign: 'center',
  },
  return: {
    height: 20,
    width: 20,
  },
});
