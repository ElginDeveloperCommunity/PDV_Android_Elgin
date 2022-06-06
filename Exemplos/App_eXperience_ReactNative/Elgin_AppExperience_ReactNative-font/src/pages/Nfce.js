import React,{useState, useEffect} from 'react';
import { formatNumber } from 'react-native-currency-input';
import { FakeCurrencyInput } from 'react-native-currency-input';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Alert,
    ToastAndroid,
    DeviceEventEmitter,
    TextInput
} from 'react-native';

import Logo from '../icons/ElginDeveloperCommunity.png'
import Footer from '../components/Footer'
import PrinterService from '../services/service_printer';
import NfceService from '../services/service_nfce';

const Nfce = () => {

    var printerService = new PrinterService();
    var nfceService = new NfceService();

    useEffect(() => {
        startConnectPrinterIntern();

        return () => {
            stopPrinterIntern();
        }
      }, []);

    function startConnectPrinterIntern() {
        printerService.sendStartConnectionPrinterIntern();
    }
    
    function stopPrinterIntern() {
        printerService.printerStop();
    }

   

    const [isSendSaleNfceEnabled, setIsSendSaleNfceEnabled] = useState(false)
    const [productName, setProductName] = useState('CAFE');
    const [productPrice, setProductPrice] = useState('8.00');
    const [emitionTime, setEmitionTime] = useState('');
    const [noteNumber, setNoteNumber] = useState('');
    const [serieNumber, setSerieNumber] = useState('');


    const configButtons = [
        {id:'configNfce', textButton:'CONFIGURAR NFCE', onPress: () => sendConfigurateXmlNfce()},
        {id:'sendSaleNfce', textButton:'ENVIAR VENDA NFCE', onPress: () => sendSaleNfce()}
    ]

    function sendConfigurateXmlNfce(){
        let actualEvent = DeviceEventEmitter.addListener("eventConfigurateXmlNfce",
            eventReturn => {
                
                ToastAndroid.show(eventReturn, ToastAndroid.LONG);
                if(eventReturn === "NFC-e configurada com sucesso!");
                    setIsSendSaleNfceEnabled(true)

                actualEvent.remove();
            }
        );

        nfceService.sendConfigurateXmlNfce();
    }

    function sendSaleNfce(){
       console.log(productName, getProductPriceFormatted());
       let actualEvent = DeviceEventEmitter.addListener("eventSendSaleNfce",
            eventReturn => {
                
                const resultSplitted = eventReturn.split("|");

                if(resultSplitted[0] === "NFC-e emitida com sucesso!"){
                    setEmitionTime(resultSplitted[1] + " SEGUNDOS");
                    setNoteNumber(resultSplitted[2]);
                    setSerieNumber(resultSplitted[3]);
                } else if (resultSplitted[0] === "Erro ao emitir NFC-e online, a impressão será da nota em contingência!"){
                    setEmitionTime("");
                    setNoteNumber(resultSplitted[1]);
                    setSerieNumber(resultSplitted[2]);
                } 
                Alert.alert("NFC-e", resultSplitted[0]);
                

                actualEvent.remove();
            }
       );
    
       nfceService.sendSaleNfce(productName, getProductPriceFormatted());
    }

    function getProductPriceFormatted(){
        return formatNumber(productPrice, {
            separator: '.',
            prefix: '',
            precision: 2,
            delimiter: '',
            signPosition: 'beforePrefix',
          });
    }

    return(
        <View style={styles.mainView}>
            <View style={styles.contentView}>
                <View style={styles.bannerView}>
                    <Image style={styles.banner} source={Logo}/>
                </View>
                <View style={styles.menuView}>
                    <View style={styles.configView}>
                        <View style={styles.dataInputView}>
                            <Text style={styles.labelText}>NOME DO PRODUTO:</Text>
                            <TextInput
                                style={styles.inputMensage}
                                keyboardType='default'
                                onChangeText={setProductName}
                                value={productName}        
                            />
                        </View>
                        <View style={styles.dataInputView}>
                            <Text style={styles.labelText}>PREÇO DO PRODUTO:</Text>
                            <FakeCurrencyInput
                                containerStyle={styles.inputMensage}
                                value = {productPrice}
                                onChangeValue = {setProductPrice}
                                prefix = ""
                                delimiter = ""
                                separator = ","
                                precision = {2}
                                onChangeText = { formattedValue => {
                                    console.log(formattedValue);
                                }}
                            />
                            
                        </View>
                        <View style={styles.configButtonsView}>
                           
                            {configButtons.map(({id,textButton,onPress}, index)=>(                            
                                <TouchableOpacity 
                                    style = { ((id === "sendSaleNfce" && !isSendSaleNfceEnabled) ? styles.disabledActionButton : styles.doubleActionButton  )} 
                                    key = { index }
                                    onPress = { onPress }
                                    disabled = { ((id === "sendSaleNfce" && !isSendSaleNfceEnabled) ? true : false) }                                
                                >
                                <Text style={styles.buttonText}>{textButton}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <View style={styles.infoView}>
                        <View style={styles.returnDataView}>
                            <Text style={styles.labelText}>TEMPO DE EMISSÃO:</Text>
                            <Text style = {styles.emittionTimeView}>{emitionTime}</Text>
                        </View>
                        <View style={styles.returnDataView}>
                            <View style={styles.returnDataText}>
                                <Text style={styles.labelText}>NOTA Nº:</Text>
                                <Text style = { styles.noteInfoView} >{noteNumber}</Text>
                            </View>
                            <View style={styles.returnDataText}>
                                <Text style={styles.labelText}>SÉRIE Nº:</Text>
                                <Text style = { styles.noteInfoView }>{serieNumber}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <Footer/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create(
    {
  
    mainView:{
      flex:1,
      backgroundColor:'white',
    },
  
    contentView:{
      height:'100%',
      width:'80%',
      justifyContent:'center',
      alignSelf:'center',
      alignContent:'center',
      alignItems:'center',
    },

    bannerView:{
      alignItems: 'center',
      justifyContent:'center',
    },
  
    banner:{
      resizeMode: 'contain',
      height: 140,
      width: 350
    },

    labelText:{
        fontWeight:'bold',
        fontSize:12,
        color:'black',
        alignItems:'center',
    },
    buttonText:{
        color:'white',
        fontWeight:'bold',
        fontSize: 14,
    },
    
    menuView:{
      flexDirection:'column',
      justifyContent:'center',
      alignContent:'space-around',
      height:'75%',
      width:'80%',
      
    },

    configView:{
        flexDirection:'column',
        justifyContent:'space-around',
        alignItems:'center',
        borderWidth:2,
        borderRadius:25,
        width:'100%',
        height:200,
        paddingHorizontal:10,
        marginBottom:10,
    },
    configButtonsView:{
        flexDirection:'row',
        width:'100%',
        justifyContent:'space-between',
    },
    doubleActionButton:{
        width:'49%',
        height:45,
        backgroundColor:'#0069A5',
        alignItems:'center',
        borderRadius:15,
        justifyContent:'center',
    },
    disabledActionButton:{
        width:'49%',
        height:45,
        backgroundColor:'#808080',
        alignItems:'center',
        borderRadius:15,
        justifyContent:'center',
    },

    emittionTimeView:{
        marginRight: 20
    },
    
    noteInfoView : {
        marginLeft: 10,
        fontSize: 12,
        textAlignVertical: 'bottom'
    },

    infoView:{
        flexDirection:'row',
        justifyContent:'space-between',
    },

    returnDataView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderWidth:2,
        borderRadius:25,
        width:'48%',
        height:70,
        paddingHorizontal:10,
        marginBottom:10,
    },
    returnDataText:{
        flexDirection:'row',
        justifyContent:'space-around',
        width:'49%',
    },

    buttonView:{

    },

    footerView:{
      position:'relative',
    },
  
    buttonMenu:{
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      borderWidth:2,
      borderRadius:25,
      width:'100%',
      height:100,
      
    },
    
    icon:{
      resizeMode: 'contain',
      width: 150,
      height: 60,
    },
  
    textButton: {
      fontWeight: 'bold',
      textAlign:'center',
    },

    dataInputView:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      width:'100%',
    },
    inputMensage:{
        textAlign: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        width:'45%',
        borderBottomWidth:1,
        borderBottomColor:'black',
        textAlignVertical:'bottom',
        padding:0,
        fontSize:17,
    },
    configButtons:{
        width:'100%',
        height:70,
        backgroundColor:'#0069A5',
        alignItems:'center',
        borderRadius:15,
        justifyContent:'center',
    },
    
   });

export default Nfce;