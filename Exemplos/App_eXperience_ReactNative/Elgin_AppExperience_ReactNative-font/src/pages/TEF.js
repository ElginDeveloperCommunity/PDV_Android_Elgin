import React, {useRef, useState, useEffect} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  TextInput,
  Pressable,
} from 'react-native';

import {DeviceEventEmitter} from 'react-native';

import Header from '../components/Header';
import Footer from '../components/Footer';

import PrinterService from '../services/service_printer';
import SitefReturn from '../services/services_tef/msitef/sitefReturn';
import SitefController from '../services/services_tef/msitef/sitefController';
import TefElginController from '../services/services_tef/tefElgin/tefElginController';
import TefElginReturn from '../services/services_tef/tefElgin/tefElginReturn';
import PayGoService from '../services/services_tef/service_paygo';

//import TefElginService from '../services/service_tefelgin';

const printerService = new PrinterService();
const paygoService = new PayGoService();
//const tefElginService = new TefElginService();
const sitefController = new SitefController();
const sitefReturn = new SitefReturn();
const tefElginController = new TefElginController();
const tefElginReturn = new TefElginReturn();

const TEF = () => {
  const [listOfResults, setListOfResults] = useState([]);

  const [typeTEF, setTypeTEF] = useState('PayGo');

  const [image64, setImage64] = useState('');

  const [valor, setValor] = useState('1000');
  const [numParcelas, setNumParcelas] = useState('1');
  const [numIP, setNumIP] = useState('192.168.0.00');
  const [paymentMethod, setPaymentMethod] = useState('Crédito');
  const [installmentType, setInstallmentType] = useState('Loja');

  const [lastElginTefNSU, setLastElginTefNSU] = useState('');

  const numIPRef = useRef(null);

  const buttonsTEFs = [
    {id: 'PayGo', textButton: 'PayGo', onPress: () => changeTypeTEF('PayGo')},
    {
      id: 'M-Sitef',
      textButton: 'M-Sitef',
      onPress: () => changeTypeTEF('M-Sitef'),
    },
    {
      id: 'TefElgin',
      textButton: 'Tef Elgin',
      onPress: () => changeTypeTEF('TefElgin'),
    },
  ];

  const buttonsPayment = [
    {
      id: 'Crédito',
      icon: require('../icons/card.png'),
      textButton: 'CRÉDITO',
      onPress: () => {
        setPaymentMethod('Crédito');
        setInstallmentType('Loja');
        setNumParcelas('2');
      },
      invisible: false,
    },
    {
      id: 'Débito',
      icon: require('../icons/card.png'),
      textButton: 'DÉBITO',
      onPress: () => setPaymentMethod('Débito'),
      invisible: false,
    },
    {
      id: 'Todos',
      icon: require('../icons/voucher.png'),
      textButton: 'TODOS',
      onPress: () => setPaymentMethod('Todos'),
      invisible: typeTEF === 'TefElgin',
    },
  ];

  const buttonsInstallment = [
    {
      id: 'Loja',
      icon: require('../icons/store.png'),
      textButton: 'LOJA',
      onPress: () => {
        setInstallmentType('Loja');
        setNumParcelas('2');
      },
      invisible: paymentMethod === 'Débito',
    },
    {
      id: 'Adm',
      icon: require('../icons/adm.png'),
      textButton: 'ADM ',
      onPress: () => {
        setInstallmentType('Adm');
        setNumParcelas('2');
      },
      invisible: paymentMethod === 'Débito',
    },
    {
      id: 'Avista',
      icon: require('../icons/card.png'),
      textButton: 'A VISTA',
      onPress: () => {
        setInstallmentType('Avista');
        setNumParcelas('1');
      },
      invisible: paymentMethod === 'Débito' || typeTEF === 'M-Sitef',
    },
  ];

  useEffect(() => {
    startConnectPrinterIntern();

    DeviceEventEmitter.addListener('eventResultPaygo', data => {
      var actualReturn = data.resultPaygo;
      var saleVia = data.resultPaygoSale;

      setImage64(saleVia);
      optionsReturnPaygo(actualReturn, saleVia);
    });
  }, []);

  function startConnectPrinterIntern() {
    printerService.sendStartConnectionPrinterIntern();
  }

  function changeTypeTEF(tefChoosed) {
    setPaymentMethod('Crédito');
    setInstallmentType('Loja');
    setNumParcelas('2');
    setTypeTEF(tefChoosed);
  }

  function startActionTEF(optionReceived) {
    if (typeTEF === 'M-Sitef') {
      sendSitefParams(optionReceived);
    } else if (typeTEF === 'PayGo') {
      sendPaygoParams(optionReceived);
    } else {
      sendTefElginParams(optionReceived);
    }
  }

  function sendPaygoParams(optionReceived) {
    if (optionReceived === 'CONFIGS') {
      paygoService.sendOptionConfigs();
    } else if (optionReceived === 'CANCEL') {
      paygoService.sendOptionCancel(
        valor,
        parseInt(numParcelas, 10),
        paymentMethod,
        installmentType,
      );
    } else {
      paygoService.sendOptionSale(
        valor,
        parseInt(numParcelas, 10),
        paymentMethod,
        installmentType,
      );
    }
  }

  function sendSitefParams(optionReceived) {
    // const numIPUnMask = numIPRef?.current.getRawValue();

    if (numIPRef !== '' && isIpAdressValid()) {
      sitefController.sitefEntrys.setValue(valor);
      sitefController.sitefEntrys.setNumberInstallments(
        parseInt(numParcelas, 10),
      );
      sitefController.sitefEntrys.setIp(numIP);
      sitefController.sitefEntrys.setPaymentMethod(paymentMethod);
      sitefController.sitefEntrys.setInstallmentsMethods(installmentType);

      try {
        sitefController.sendParamsSitef(optionReceived);

        let resultReceiveTemp = DeviceEventEmitter.addListener(
          'eventResultSitef',
          event => {
            var actualReturn = event.restultMsitef;

            sitefReturn.receiveResultInJSON(actualReturn);
            optionsReturnMsitef(optionReceived);
          },
        );

        setTimeout(() => {
          resultReceiveTemp.remove();
        }, 2000);
      } catch (e) {
        //ERRO
      }
    } else {
      Alert.alert('Alerta', 'Verifique seu endereço IP.');
    }
  }

  function sendTefElginParams(optionReceived) {
    if (optionReceived === 'CANCEL') {
      if (lastElginTefNSU === '') {
        Alert.alert(
          'Atenção',
          'É necessário realizar uma transação antres para realizar o cancelamento no TEF ELGIN!',
        );
        return;
      }
      tefElginController.tefelginEntrys.setLastElginTefNSU(lastElginTefNSU);
    }

    tefElginController.tefelginEntrys.setValue(valor);
    tefElginController.tefelginEntrys.setNumberInstallments(
      parseInt(numParcelas, 10),
    );
    tefElginController.tefelginEntrys.setPaymentMethod(paymentMethod);
    tefElginController.tefelginEntrys.setInstallmentsMethod(installmentType);

    try {
      tefElginController.sendParamsTefElgin(optionReceived);

      let resultReceiveTemp = DeviceEventEmitter.addListener(
        'eventResultSitef',
        event => {
          var actualReturn = event.restultMsitef;

          tefElginReturn.receiveResultInJSON(actualReturn);
          optionsReturnTefElgin(optionReceived);
        },
      );

      setTimeout(() => {
        resultReceiveTemp.remove();
      }, 2000);
    } catch (e) {
      console.log(1212);
    }
  }

  function optionsReturnPaygo(returnReceive, imageBase64) {
    if (returnReceive === 'Operacao cancelada') {
      Alert.alert('Alerta', 'Operação Cancelada.');
    } else if (returnReceive === 'Erro pinpad') {
      Alert.alert('Alerta', 'Erro Pinpad.');
    } else if (returnReceive === 'Transacao autorizada') {
      Alert.alert('Alerta', 'Transação Autorizada.');

      printerService.sendPrinterCupomTEF(imageBase64);

      printerService.jumpLine(20);
      printerService.cutPaper(10);
    } else {
      Alert.alert('Alerta', returnReceive);
    }
  }

  function optionsReturnMsitef(sitefFunctions) {
    if (
      parseInt(sitefReturn.getcODRESP(), 10) < 0 &&
      sitefReturn.getcODAUTORIZACAO() === ''
    ) {
      Alert.alert('Alerta', 'Ocorreu um erro durante a transação.');
    } else {
      if (sitefFunctions === 'SALE') {
        var textToPrinter = sitefReturn.vIACLIENTE();

        printerService.sendPrinterText(
          textToPrinter,
          'Centralizado',
          false,
          false,
          'FONT B',
          0,
        );
        printerService.jumpLine(10);
        printerService.cutPaper(10);

        updateListOfResults(textToPrinter);
      }

      Alert.alert('Alerta', 'Ação realizada com sucesso.');
    }
  }

  function optionsReturnTefElgin(tefElginFunction) {
    if (
      !tefElginReturn.getcODRESP() ||
      parseInt(tefElginReturn.getcODRESP(), 10) < 0
    ) {
      Alert.alert('Alerta', 'Ocorreu um erro durante a transação.');
    } else {
      var textToPrinter = tefElginReturn.vIACLIENTE();
      setLastElginTefNSU(tefElginReturn.nSUSITEF());

      printerService.sendPrinterText(
        textToPrinter,
        'Centralizado',
        false,
        false,
        'FONT B',
        0,
      );
      printerService.jumpLine(10);
      printerService.cutPaper(10);

      updateListOfResults(textToPrinter);

      Alert.alert('Alerta', 'Ação realizada com sucesso.');
    }
  }

  function isIpAdressValid() {
    let ipValid = false;

    if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        numIP,
      )
    ) {
      ipValid = true;
      return ipValid;
    } else {
      ipValid = false;
      return ipValid;
    }
  }

  function updateListOfResults(textToPrinter) {
    const copyOfListResultsActual = Array.from(listOfResults);

    copyOfListResultsActual.unshift({
      id: Math.floor(Math.random() * 9999999).toString(),
      time: new Date().toLocaleString('pt-BR'),
      text: textToPrinter,
    });

    setListOfResults(copyOfListResultsActual);
  }

  return (
    <View style={styles.mainView}>
      <Header textTitle={'TEF'} />
      <View style={styles.menuView}>
        <View style={styles.configView}>
          <View style={styles.paymentsButtonView}>
            {buttonsTEFs.map(({id, textButton, onPress}, index) => (
              <TouchableOpacity
                style={[
                  styles.typeTEFButton,
                  id === typeTEF && styles.optionSelected,
                ]}
                key={index}
                onPress={onPress}>
                <Text style={[styles.buttonText, styles.optionText]}>
                  {textButton}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.mensageView}>
            <Text style={styles.labelText}>VALOR:</Text>
            <TextInput
              placeholder={'000'}
              style={styles.inputMensage}
              keyboardType="numeric"
              onChangeText={setValor}
              value={valor}
            />
          </View>

          <View
            style={[
              styles.mensageView,
              paymentMethod === 'Débito' && styles.optionHidden,
            ]}>
            <Text style={styles.labelText}>Nº PARCELAS:</Text>
            <TextInput
              placeholder={'00'}
              style={styles.inputMensage}
              editable={
                paymentMethod !== 'Débito' && installmentType !== 'Avista'
              }
              keyboardType="numeric"
              onChangeText={setNumParcelas}
              value={numParcelas}
            />
          </View>

          <View style={styles.mensageView}>
            <Text style={styles.labelText}>IP:</Text>
            <TextInput
              placeholder={'000.000.0.000'}
              style={styles.inputMensage}
              editable={
                typeTEF === 'PayGo' || typeTEF === 'M-Sitef' ? false : true
              }
              onChangeText={setNumIP}
              value={numIP}
            />
          </View>

          <View style={styles.paymentView}>
            <Text style={styles.labelText}> FORMAS DE PAGAMENTO </Text>
            <View style={styles.paymentsButtonView}>
              {buttonsPayment.map(
                ({id, icon, textButton, onPress, invisible}, index) => (
                  <Pressable
                    style={[
                      styles.paymentButton,
                      id === paymentMethod && styles.optionSelected,
                      invisible && styles.optionHidden,
                    ]}
                    key={index}
                    onPress={onPress}
                    disabled={invisible}>
                    <Image style={styles.icon} source={icon} />
                    <Text style={styles.buttonText}>{textButton}</Text>
                  </Pressable>
                ),
              )}
            </View>
          </View>

          <View style={styles.paymentView}>
            <Text style={styles.labelText}> TIPO DE PARCELAMENTO </Text>
            <View style={styles.paymentsButtonView}>
              {buttonsInstallment.map(
                ({id, icon, textButton, onPress, invisible}, index) => (
                  <Pressable
                    style={[
                      styles.paymentButton,
                      id === installmentType && styles.optionSelected,
                      invisible && styles.optionHidden,
                    ]}
                    key={index}
                    onPress={onPress}
                    disabled={invisible}>
                    <Image style={styles.icon} source={icon} />
                    <Text style={styles.buttonText}>{textButton}</Text>
                  </Pressable>
                ),
              )}
            </View>
          </View>

          <View style={styles.submitionButtonsView}>
            <TouchableOpacity
              style={styles.submitionButton}
              onPress={() => startActionTEF('SALE')}>
              <Text style={styles.textButton}>ENVIAR TRANSAÇÃO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitionButton}
              onPress={() => startActionTEF('CANCEL')}>
              <Text style={styles.textButton}>CANCELAR TRANSAÇÃO</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.submitionButtonsView}>
            <TouchableOpacity
              style={[
                styles.submitionButton,
                typeTEF === 'TefElgin' && styles.optionHidden,
              ]}
              onPress={() => startActionTEF('CONFIGS')}
              disabled={typeTEF === 'TefElgin'}>
              <Text style={styles.textButton}>CONFIGURAÇÃO</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.returnView}>
          <View style={styles.titleReturnView}>
            <Text style={styles.labelText}>RETORNO</Text>
          </View>

          {typeTEF === 'PayGo' ? (
            <Image
              style={styles.paygoImage}
              source={{uri: `data:image/jpeg;base64,${image64}`}}
            />
          ) : (
            <FlatList
              data={listOfResults}
              key={index => String(listOfResults)}
              renderItem={({item}, index) => (
                <>
                  <Text key={index} style={styles.textList}>
                    {item.time}:
                  </Text>
                  <Text key={index} style={styles.textList}>
                    {item.text}
                  </Text>
                  <Text key={index} style={styles.textList}>
                    -------------------------------------------
                  </Text>
                </>
              )}
            />
          )}
        </View>
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  optionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  titleText: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  menuView: {
    flexDirection: 'row',
    width: '90%',
    height: '80%',
    justifyContent: 'space-between',
  },
  mensageView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    width: '100%',
  },
  inputMensage: {
    flexDirection: 'row',
    width: '70%',
    borderBottomWidth: 0.5,
    borderBottomColor: 'black',
    textAlignVertical: 'bottom',
    padding: 0,
    fontSize: 17,
  },
  configView: {
    flexDirection: 'column',
    width: '47%',
    justifyContent: 'space-between',
  },
  returnView: {
    height: 400,
    padding: 15,
    borderWidth: 3,
    borderRadius: 7,
    borderColor: 'black',
    flexDirection: 'column',
    width: '47%',
    // justifyContent:'space-between'
  },
  paymentView: {
    marginTop: 15,
  },
  paymentsButtonView: {
    flexDirection: 'row',
  },
  paymentButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 15,
    borderColor: 'black',
    width: 60,
    height: 60,
    marginHorizontal: 5,
    opacity: 1,
  },
  typeTEFButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 15,
    borderColor: 'black',
    width: 100,
    height: 35,
    marginHorizontal: 5,
  },
  optionSelected: {
    borderColor: '#23F600',
  },
  optionHidden: {
    opacity: 0,
  },
  icon: {
    width: 30,
    height: 30,
  },
  submitionButtonsView: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitionButton: {
    width: '48%',
    height: 35,
    backgroundColor: '#0069A5',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
  },
  textButton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  titleReturnView: {
    marginBottom: 10,
  },
  paygoImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default TEF;
