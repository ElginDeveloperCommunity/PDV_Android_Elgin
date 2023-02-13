import React, {useState} from 'react';
import RadioForm from 'react-native-simple-radio-button';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  DeviceEventEmitter,
} from 'react-native';

import Header from '../components/Header';
import Footer from '../components/Footer';

import ServiceSat from '../services/service_sat';

import XmlEnviarDadosVendaSat from '../services/service_xmlEnviarDadosVendaSat';
import XmlCancelarUltimaVendaSat from '../services/service_xmlCancelarUltimaVendaSat';
import XmlSatGo from '../services/service_xmlSatGo';

import {TextInput} from 'react-native-gesture-handler';

const satOptionsRadioButton = [
  {
    label: 'SMART SAT',
    value: 'SMART SAT',
  },
  {
    label: 'SATGO',
    value: 'SATGO',
  },
];

const SAT = () => {
  var RNFS = require('react-native-fs');
  var pathLog = RNFS.ExternalCachesDirectoryPath + '/SaTLog.txt';

  var xmlEnviarDadosVendaSat = new XmlEnviarDadosVendaSat();
  var xmlCancelarUltimaVendaSat = new XmlCancelarUltimaVendaSat();
  var xmlSATGo = new XmlSatGo();

  var satService = new ServiceSat();

  const [cfeCancelamento, setCFeCancelamento] = useState('');
  const [textReturn, setTextReturn] = useState('');
  const [selectedOptionSat, setSelectedOptionSat] = useState('SMART SAT');
  const [activationCode, setActvationCode] = useState('123456789');

  const satButtonsLeft = [
    {textButton: 'CONSULTAR SAT', onPress: () => sendConsultarSat()},
    {textButton: 'STATUS OPERACIONAL', onPress: () => sendStatusOperacional()},
    {textButton: 'REALIZAR VENDA', onPress: () => enviarDadosVendaSat()},
    {textButton: 'EXTRAIR LOGS', onPress: () => extrairLog()},
  ];

  const satButtonsRigth = [
    {textButton: 'CANCELAMENTO', onPress: () => cancelarVendaSat()},
    {textButton: 'ATIVAR', onPress: () => sendAtivarSat()},
    {textButton: 'ASSOCIAR', onPress: () => sendAssociarSat()},
  ];

  function sendAtivarSat() {
    var numSessao = Math.floor(Math.random() * 999999).toString();

    satService.sendActivateSat(
      parseInt(numSessao, 10),
      2,
      activationCode,
      '14200166000166',
      15,
    );

    let actualEvent = DeviceEventEmitter.addListener(
      'eventAtivarSat',
      event => {
        var actualReturn = event.resultAtivarSat;
        setTextReturn(actualReturn);
      },
    );

    setTimeout(() => {
      actualEvent.remove();
    }, 2000);
  }

  function sendAssociarSat() {
    var numSessao = Math.floor(Math.random() * 999999).toString();

    satService.sendAssociateSignature(
      parseInt(numSessao, 10),
      activationCode,
      '16716114000172',
      'SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT',
    );

    let actualEvent = DeviceEventEmitter.addListener(
      'eventAssociateSignature',
      event => {
        var actualReturn = event.resultAssociateSignature;
        setTextReturn(actualReturn);
      },
    );

    setTimeout(() => {
      actualEvent.remove();
    }, 2000);
  }

  function sendConsultarSat() {
    var numSessao = Math.floor(Math.random() * 999999).toString();

    const mapParam = {
      typeSat: 'consultSat',
      numSessao: parseInt(numSessao, 10),
    };

    satService.sendFunctionToAndroid(mapParam);

    let actualEvent = DeviceEventEmitter.addListener(
      'eventConsultSat',
      event => {
        var actualReturn = event.resultConsultSat;
        setTextReturn(actualReturn);
      },
    );

    setTimeout(() => {
      actualEvent.remove();
    }, 2000);
  }

  function sendStatusOperacional() {
    var numSessao = Math.floor(Math.random() * 999999).toString();

    satService.sendStatusSat(parseInt(numSessao, 10), activationCode);
    let actualEvent = DeviceEventEmitter.addListener(
      'eventStatusOperacional',
      event => {
        var actualReturn = event.resultStatusOperacional;
        setTextReturn(actualReturn);
      },
    );

    setTimeout(() => {
      actualEvent.remove();
    }, 2000);
  }

  function enviarDadosVendaSat() {
    var numSessao = Math.floor(Math.random() * 999999).toString();

    var xmlSale = '';
    setCFeCancelamento('');

    if (selectedOptionSat === 'SMART SAT') {
      xmlSale = xmlEnviarDadosVendaSat.getXmlEnviarDadosVendaSat();
    } else {
      xmlSale = xmlSATGo.getXmlSatGo();
    }

    satService.sendSendSell(parseInt(numSessao, 10), activationCode, xmlSale);

    let actualEvent = DeviceEventEmitter.addListener('eventSendSell', event => {
      var actualReturn = event.resultSendSell;

      //TRATAMENTO PARA PEGAR O CÓDIGO CFE ATUAL PARA CANCELAMENTO
      if (actualReturn.includes('|')) {
        var listOfReturn = actualReturn.split('|');
        var newReturn = listOfReturn.find(value => value.includes('CFe'));
        if (newReturn) {
          setCFeCancelamento(newReturn);
        }
      }
      setTextReturn(actualReturn);
    });

    setTimeout(() => {
      actualEvent.remove();
    }, 2000);
  }

  function cancelarVendaSat() {
    var numSessao = Math.floor(Math.random() * 999999).toString();
    const xmlCancel = xmlCancelarUltimaVendaSat.getXmlCancelarUltimaVendaSat();

    var newXmlCancel = xmlCancel.replace('novoCFe', cfeCancelamento);

    satService.sendCancelSell(
      parseInt(numSessao, 10),
      activationCode,
      cfeCancelamento.toString(),
      newXmlCancel,
    );

    let actualEvent = DeviceEventEmitter.addListener(
      'eventCancelSell',
      event => {
        var actualReturn = event.resultCancelSell;
        setTextReturn(actualReturn);
      },
    );

    setTimeout(() => {
      actualEvent.remove();
    }, 2000);
  }

  function extrairLog() {
    var numSessao = Math.floor(Math.random() * 999999);

    satService.sendGetLogs(numSessao, activationCode);

    let actualEvent = DeviceEventEmitter.addListener('eventGetLog', event => {
      var actualReturn = event.resultGetLog;
      if (actualReturn === 'DeviceNotFound') {
        setTextReturn('DeviceNotFound');
      } else {
        RNFS.writeFile(pathLog, actualReturn, 'utf8')
          .then(success => {
            console.log('FILE WRITTEN!');
          })
          .catch(err => {
            console.log(err.message);
          });
        setTextReturn('O log do SAT está salvo em:' + pathLog);
      }
    });

    setTimeout(() => {
      actualEvent.remove();
    }, 2000);
  }

  return (
    <View style={styles.mainView}>
      <Header textTitle={'SAT'} />
      <View style={styles.satMenuView}>
        <View style={styles.returnSatView}>
          <Text style={styles.labelText}>RETORNO SAT</Text>
          <ScrollView>
            <Text style={styles.returnText}>{textReturn}</Text>
          </ScrollView>
        </View>
        <View style={styles.inputSatView}>
          <View style={styles.radioButtonsView}>
            <RadioForm
              style={{marginVertical: 10}}
              labelStyle={{marginHorizontal: 5}}
              radio_props={satOptionsRadioButton}
              initial={0}
              buttonSize={10}
              formHorizontal={true}
              onPress={item => setSelectedOptionSat(item)}
            />
          </View>
          <View style={styles.inputCodeView}>
            <Text style={styles.optionText}>Código de Ativação: </Text>
            <TextInput
              placeholder={'000'}
              style={styles.inputMensage}
              keyboardType="numeric"
              onChangeText={setActvationCode}
              value={activationCode}
            />
          </View>
          <View style={styles.actionButtonsView}>
            <View style={styles.buttonsView}>
              {satButtonsLeft.map(({id, textButton, onPress}, index) => (
                <TouchableOpacity
                  style={styles.submitionButton}
                  key={index}
                  onPress={onPress}>
                  <Text style={styles.textButton}>{textButton}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonsView}>
              {satButtonsRigth.map(({id, textButton, onPress}, index) => (
                <TouchableOpacity
                  style={styles.submitionButton}
                  key={index}
                  onPress={onPress}>
                  <Text style={styles.textButton}>{textButton}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
    marginBottom: 20,
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
  satMenuView: {
    flexDirection: 'row',
    height: 450,
    width: '90%',
    justifyContent: 'space-between',
  },
  returnSatView: {
    flexDirection: 'column',
    width: '49%',
    padding: 30,
    borderWidth: 2.5,
    borderColor: 'black',
    borderRadius: 10,
  },
  inputSatView: {
    flexDirection: 'column',
    width: '49%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonsView: {
    width: '100%',
  },
  inputCodeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 25,
    alignContent: 'center',
    alignItems: 'center',
  },
  inputMensage: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    width: '50%',
  },
  actionButtonsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonsView: {
    width: '48%',
    alignItems: 'center',
  },
  submitionButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#0069A5',
    alignItems: 'center',
    borderRadius: 13,
    justifyContent: 'center',
    margin: 5,
  },
  textButton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  returnText: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    paddingBottom: 30,
    marginBottom: 20,
  },
});

export default SAT;
