import React from 'react';
import {View, Text, StyleSheet,Image} from 'react-native';

import Logo from '../icons/ElginDeveloperCommunity.png'

const Header = ({textTitle}) =>{
    return(
        <View style={styles.headerView}>
        <Text style={styles.headerText}>{textTitle}</Text>
        <Image style={styles.headerIcon} resizeMode='contain' source={Logo}/>
      </View>
    );
};

const styles = StyleSheet.create({
headerView:{
  flexDirection:'row',
  justifyContent:'space-between',
  alignItems:'center',
  height:50,
  width:'90%',
  
},
headerText:{
  fontSize:30,
  fontWeight:'bold',
},
headerIcon:{
    width:150,
    height:50,

},
})

export default Header