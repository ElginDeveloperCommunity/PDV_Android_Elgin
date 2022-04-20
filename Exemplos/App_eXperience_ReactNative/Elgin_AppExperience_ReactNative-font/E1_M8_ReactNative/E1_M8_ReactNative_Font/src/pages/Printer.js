import React, { useState, useEffect }from 'react';
import Footer from '../components/Footer'

import { RadioButton } from 'react-native-paper';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    DeviceEventEmitter,
    Alert
} from 'react-native';

   
import Header from '../components/Header';
import PrinterBarCode from './PrinterOptions/PrinterBarCode';
import PrinterImage from './PrinterOptions/PrinterImage';
import PrinterText from './PrinterOptions/PrinterText';


import PrinterService from '../services/service_printer';

const Printer =()=> {
    var printerService = new PrinterService();

    const [typePrinter,setTypePrinter]=useState('TEXT');

    const [checked, setChecked] = useState('M8');

    const [selectedPrinterIp,setSelectedPrinterIp]= useState("");
    const [selectedPrinterUsb,setSelectedPrinterUsb]= useState("");


    const [ipConection,setIpConection]=useState('192.168.0.31:9100');
    const [ isUsingPrinterExtern, setIsUsingPrinterExtern ] = useState(false);

    
    const buttonsPrinter = [
        {id:'TEXT', icon: require('../icons/printerText.png'), textButton: 'IMPRESSÃO\nDE TEXTO',onPress:()=> setTypePrinter('TEXT')},
        {id:'BARCODE', icon: require('../icons/printerBarCode.png'), textButton: 'IMPRESSÃO DE\nCÓDIGO DE BARRAS',onPress:()=>setTypePrinter('BARCODE')},
        {id:'IMAGE', icon: require('../icons/printerImage.png'), textButton: 'IMPRESSÃO\nDE IMAGEM',onPress:()=>setTypePrinter('IMAGE')},
    ];
    
    useEffect(() => {
        startConnectPrinterIntern();
    },[]);

    const typePrinterAtual=()=>{
        switch(typePrinter){
            case 'TEXT':
                return(<PrinterText/>)
            case 'BARCODE':
                return(<PrinterBarCode/>)
            case 'IMAGE':
                return(<PrinterImage/>)
        }
    };

    function actualStatusPrinter(){
        printerService.getStatusPrinter();

        let actualEvent = DeviceEventEmitter.addListener('eventStatusPrinter', event => {
            var actualReturn = event.statusPrinter;

            if(actualReturn === '5'){
                Alert.alert("Retorno", "Papel está presente e não está próximo!");
            }else if(actualReturn === '6'){
                Alert.alert("Retorno", "Papel está próximo do fim!");
            }else if(actualReturn === '7'){
                Alert.alert("Retorno", "Papel ausente!");
            }else{
                Alert.alert("Retorno", "Status Desconhecido");
            }
        });

        setTimeout(() => {
            actualEvent.remove();
        }, 2000)        
    };

    function actualStatusGaveta(){
        printerService.getStatusGaveta();

        let actualEvent = DeviceEventEmitter.addListener('eventStatusGaveta', event => {
            var actualReturn = event.statusGaveta;

            if(actualReturn === '1'){
                Alert.alert("Retorno", "Gaveta aberta!");
            }else if(actualReturn === '2'){
                Alert.alert("Retorno", "Gaveta fechada!");
            }else{
                Alert.alert("Retorno", "Status Desconhecido");
            }
        });

        setTimeout(() => {
            actualEvent.remove();
        }, 2000)        
    };

    function sendAbrirGaveta(){
        printerService.sendOpenGaveta();
    }

    function changePrinterChoose(value){
       
        if(value === "usb"){
            
            Alert.alert("Impressora Externa USB","Escolha o modelo da impressora que deseja utilziar",[
                {text:'Cancelar',onPress:()=>startConnectPrinterIntern()},
                {text:"I8",onPress:()=>startConnectPrinterUsb('i8'),},
                {text:'i9',onPress:()=>startConnectPrinterUsb('i9')},
                ,
                
            ]);
        }else if(value ==="ip"){
            Alert.alert("Impressora Externa IP","Escolha o modelo da impressora que deseja utilziar",[
                {text:'Cancelar',onPress:()=>startConnectPrinterIntern()},
                {text:"I8",onPress:()=>startConnectPrinterIP('i8'),},
                {text:'i9',onPress:()=>startConnectPrinterIP('i9')},
                ,
                
            ]);
        
        }else{
            setIsUsingPrinterExtern(false);
            startConnectPrinterIntern();
            
        }
    };

    function startConnectPrinterIntern(){
        setChecked("M8");
        printerService.sendStartConnectionPrinterIntern();
    };

    function startConnectPrinterIP(model){
        if(ipConection !== ''){
            var ip = ipConection.split(":")[0];
            var port = ipConection.split(":")[1];

            if(isIpAdressValid()){
                
                printerService.sendStartConnectionPrinterExternIp(
                    model,
                    ip,
                    parseInt(port),
                );
                setChecked("ip");
                setSelectedPrinterIp(model);
                
            }else{
                Alert.alert("Alert", "Digíte um endereço e porta IP válido!");
            }   
        }else{
            Alert.alert("Alert", "Digíte um endereço e porta IP válido!");
        }        
    };

    function startConnectPrinterUsb(model){
        setChecked("usb");
        setSelectedPrinterUsb(model);
        printerService.sendStartConnectionPrinterExternUsb(model);
       
    }

    function isIpAdressValid(){
        let ipValid = false;

        if((/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?[0-9][0-9])$/.test(ipConection))){
            ipValid = true;
            return ipValid;
        }else{
            ipValid = false;
            return ipValid;
        };
    };

    return(
        <View style={styles.mainView}>
            <Header textTitle='IMPRESSORA'/>
            <View style={styles.menuView}>
                <View style={styles.optonsMenuView}>
                    {buttonsPrinter.map(({id,icon,textButton,onPress}, index)=>(
                        <TouchableOpacity 
                            style={[styles.buttonMenu, {borderColor: id===typePrinter ? '#0069A5':'black'}]} 
                            key={index}
                            onPress={onPress}
                        >
                                <Image style={styles.icon} source={icon}/>
                                <Text style={styles.menuTextButton}>{textButton}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.statusButton} onPress={actualStatusPrinter}>
                        <Image style={styles.statusIcon} source={require('../icons/status.png')}/>
                        <Text style={styles.statusButtonTXT}>STATUS IMPRESSORA</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.statusButton} onPress={actualStatusGaveta}>
                        <Image style={styles.statusIcon} source={require('../icons/status.png')}/>
                        <Text style={styles.statusButtonTXT}>STATUS GAVETA</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={sendAbrirGaveta}>
                        <Text style={styles.actionButtonTXT}>ABRIR GAVETA</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.settingsPrinterView}>
                    <View style={styles.settingsPrinterHeader}>
                        <View style={styles.typePrinterOptionView}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>                            
                            <RadioButton
                                value="M8"
                                color="#0069A5"
                                status={ checked === 'M8' ? 'checked' : 'unchecked' }
                                onPress={() => changePrinterChoose('M8')}
                            />
                            <Text style={styles.labelText}>IMP. INTERNA</Text>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center'}}>                            
                            <RadioButton
                                value="usb"
                                color="#0069A5"
                                status={ checked === 'usb' ? 'checked' : 'unchecked' }
                                onPress={() => changePrinterChoose('usb')}
                            />
                            <Text style={styles.labelText}>IMP. EXTERNA - USB {selectedPrinterUsb}</Text>
                        </View>  

                        <View style={{flexDirection: 'row', alignItems: 'center'}}>                            
                            <RadioButton
                                value="ip"
                                color="#0069A5"
                                status={ checked === 'ip' ? 'checked' : 'unchecked' }
                                onPress={() => changePrinterChoose('ip')}
                            />
                            <Text style={styles.labelText}>IMP. EXTERNA - IP {selectedPrinterIp}</Text>
                        </View>    
                        
                                                             
                        </View>
                        <View style={styles.conectionView}>
                            <Text style={styles.textSizeDefault}>IP:</Text>
                            <TextInput                                                                
                                style={styles.inputMensage}
                                placeholder="192.168.0.1:9100"
                                placeholderTextColor="#999"
                                autoCapitalize="none"
                                keyboardType='default'
                                autoCorrect={false}
                                onChangeText={setIpConection}
                                value={ipConection}
                            />
                        </View>
                        
                    </View>
                    <View style={styles.settingPrinterBody}>
                        {typePrinterAtual()}
                    </View>
                </View>
            </View>
            <Footer />
        </View>
    );
 };

 const styles =StyleSheet.create({
    mainView:{
        flex:1,
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'white',
    },
    menuView:{
        flexDirection:'row',
        width:'90%',
        height:400,
        justifyContent:'space-between',
    },
    optonsMenuView:{
        flexDirection:'column',
        height:'100%',
        alignItems:'center',
        justifyContent:"space-around",
    },
    buttonMenu:{
        borderWidth:2,
        borderColor:'black',
        width:150,
        height:80,
        fontWeight:'bold',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:8,
    },
    actionButton:{
        width:'100%',
        height:35,
        backgroundColor:'#0069A5',
        alignItems:'center',
        borderRadius:5,
        justifyContent:'center',
    },
    actionButtonTXT:{
        color:'white',
        fontWeight:'bold',
    },
    icon:{
        width:50,
        height:50,
    },
    labelText:{
        fontWeight:'bold',
        fontSize:11,
    },
    menuTextButton:{
        textAlign:'center',
        fontSize:10,
        fontWeight: 'bold'
    },
    textButton:{
        color:'white',
        fontWeight:'bold'
    },
    statusButton:{
        flexDirection:'row',
        width:150,
        height:50,
        borderWidth:2,
        borderRadius:5,
        borderColor:'black',
        alignItems:'center',
        marginBottom:7,
       
    },
    statusButtonTXT:{
        fontSize:10,
        marginLeft:5,
    },
    statusIcon:{
        width:20,
        height:20,
        marginLeft:5,
    },
    settingsPrinterView:{
        width:'78%',
        height:'100%',
        flexDirection:'column',    
    },
    settingsPrinterHeader:{
        flexDirection:'row',
        justifyContent:'space-between',
        height:'10%',
        paddingBottom:5,
    },
    typePrinterOptionView:{
        flexDirection:'row',
        alignContent:'center',
        justifyContent:'center',
        alignItems:'center',
    },
    settingPrinterBody:{
        width:'100%',
        height:'90%',
        borderColor:'black',
        borderWidth:2,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'space-between'
    },
    conectionView:{
        flexDirection:'row',
        paddingLeft:5,
        borderWidth:2,
        borderRadius:15,
        borderColor:'black',
        justifyContent:'center',
        width: 180,
        height:'100%',
        alignItems:'center',
        alignContent:'center'
    },
    conectionIpText:{
        fontWeight:'bold',
    },
    conectionButton:{
        backgroundColor:'#0069A5',
        borderWidth:2,
        borderRadius:15,
        borderColor:'#0069A5',
        height:'100%',
        alignItems:'center',
        alignContent:'center',
        justifyContent:'center',
        width:150
    },
    inputMensage: {
        width: '80%',
        // borderBottomColor: 'black',
        // borderBottomWidth: 2,
        fontSize: 16,
        color: 'black',
        // textAlignVertical: 'bottom',
        padding: 0
    },
 });

 export default Printer;