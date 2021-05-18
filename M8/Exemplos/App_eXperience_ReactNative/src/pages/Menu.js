/**
 * Sample React Native Menu
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import {useNavigation} from '@react-navigation/native';
 import {
   StyleSheet,
   Text,
   View,
   Image,
   TouchableOpacity,
 } from 'react-native';

 import Footer from '../components/Footer'
 import Logo from '../icons/ElginDeveloperCommunity.png'


 
 const Menu =()=> {
   const navigator = useNavigation();
 
   return (
     <View style={styles.mainView}>
       <View style={styles.contentView}>
         <View style={styles.bannerView}>
           <Image style={styles.banner} source={Logo}/>
         </View>
         <View style={styles.menuView}>
           <View style={styles.buttonView}>
             <View style={styles.firstLine}> 
               <TouchableOpacity style={styles.buttonMenu} onPress={() => navigator.navigate('Printer') }>
                 <Image style={styles.icon} source={require('../icons/printer.png')}/>
                 <Text style={styles.textButton}>IMPRESSORA</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.buttonMenu} onPress={() => navigator.navigate('BarCodes')}>
                 <Image style={styles.icon} source={require('../icons/barCode.png')}/>
                 <Text style={styles.textButton}>CÓDIGO DE BARRAS</Text>
               </TouchableOpacity>
             </View>
             <View style={styles.firstLine}>
               <TouchableOpacity style={styles.buttonMenu} onPress={()=>navigator.navigate('TEF')}>
                 <Image style={styles.icon} source={require('../icons/msitef.png')}/>
                 <Text style={styles.textButton}>TEF</Text>
               </TouchableOpacity><TouchableOpacity style={styles.buttonMenu} onPress={()=>navigator.navigate('SAT')}>
                 <Image style={styles.icon} source={require('../icons/sat.png')}/>
                 <Text style={styles.textButton}>SAT</Text>
               </TouchableOpacity>
             </View>
           </View>
         </View>  
         <Footer/>
       </View>
       
       </View>
       
       
       
   );
 };
 
 const styles = StyleSheet.create({
  mainView:{
    flex:1,
    backgroundColor:'white',
  },
  contentView:{
    height:'100%',
    width:'90%',
    alignSelf:'center',

    justifyContent:'space-between',
  },
  bannerView:{
    alignItems: 'center',
    justifyContent:'center',
  },
  banner:{
    resizeMode:'contain',
    width: 490,
    height: 139,
  },
  menuView:{
    flexDirection:'row',
    flexDirection:'column',
    justifyContent:'space-around',
    alignItems:'center',
    height:325
  },
  buttonView:{
    justifyContent:'space-around',
  },
  buttonMenu:{
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    borderWidth:2,
    borderRadius:15,
    width:200,
    height:130,
    marginHorizontal:10,
    marginVertical:5
  },
  icon:{
    width:50,
    height:50,
  },
  firstLine:{
    flexDirection:'row'
  },
  textButton: {
    fontWeight: 'bold',
  }
 });
 
 export default Menu;
 