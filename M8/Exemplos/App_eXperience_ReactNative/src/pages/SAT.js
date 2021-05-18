import React,{Component,useState} from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput
  } from 'react-native';

import Header from '../components/Header'
import Footer from '../components/Footer'

const satButtons = [
    {id:'SELL', textButton: 'REALIZAR VENDA'},
    {id:'STATUS',  textButton: 'CONSULTAR STATUS'},
    {id:'CANCEL', textButton: 'CANCELAMENTO'},
]

const SAT =()=>{
    const [ipValue,setipValue]=useState("000.000.000.00");
    const [macValue,setMacValue]=useState("000A0.000.0AAA");
    return(
        <View style={styles.mainView} >
            <Header textTitle={'SAT'}/>
            <View style={styles.satMenuView}>
                <View style={styles.returnSatView}>
                    <Text style={styles.labelText}>RETORNO SAT</Text>
                    <Text style={styles.returnText}>
                        It is a long established fact that a reader will be distracted by the It is a long established fact that
                    </Text>
                    <Text style={styles.returnText}>
                        It is a long established fact that a reader will be distracted by the It is a long established fact that
                    </Text>
                    <Text>IP: {ipValue}</Text>
                    <Text>MAC: {macValue}</Text>
                    
                </View>
                <View style={styles.buttonsView}>
                    {satButtons.map(({id,textButton},index)=>(
                        <TouchableOpacity 
                            style={styles.submitionButton} 
                            key={index}
                        >
                                <Text style={styles.textButton}>{textButton}</Text>
                        </TouchableOpacity>
                    ))}

                </View>

            </View>
            
            <Footer/>
        </View>
    );

};

const styles=StyleSheet.create({
    mainView:{
        flex:1,
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'white',

    },
    labelText:{
        fontWeight:'bold',
        fontSize:15,
        marginBottom:20,
    },
    optionText:{
        fontSize:14,
        fontWeight:'bold',
    },
    titleText:{
        textAlign:'center',
        fontSize:30,
        fontWeight:'bold',
    },
    satMenuView:{
        flexDirection:'row',
        height:450,
        width:'90%',
        justifyContent:'space-between'
    },
    returnSatView:{
        flexDirection:'column',
        width:'68%',
        padding:30,
        borderWidth:2.5,
        borderColor:'black',
        borderRadius:10,
    },
    buttonsView:{
        flexDirection:'column',
        width:'28%',
        alignItems:'center',
        justifyContent:'center',
    },

    submitionButton:{
        width:'90%',
        height:50,
        backgroundColor:'#0069A5',
        alignItems:'center',
        borderRadius:10,
        justifyContent:'center',
        margin:8,
    },
    textButton:{
        color:'white',
        fontWeight:'bold',
        fontSize:18,
    },
    returnText:{
        borderBottomWidth:2,
        borderBottomColor:'black',
        paddingBottom:30,
        marginBottom:20,
    }
});



export default SAT;