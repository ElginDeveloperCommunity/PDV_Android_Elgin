import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Footer = () => {
  return (
    <View style={styles.viewFooter}>
      <Text style={styles.textFooter}>REACT NATIVE 3.1.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  viewFooter: {
    width: '90%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  textFooter: {
    fontWeight: 'bold',
    color: 'gray',
  },
});

export default Footer;
