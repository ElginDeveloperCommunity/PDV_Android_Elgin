import React, {useState} from 'react';
import RadioForm from 'react-native-simple-radio-button';
import {Picker} from '@react-native-picker/picker';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';

import Header from '../components/Header';
import Footer from '../components/Footer';
import BalancaService from '../services/service_balanca';

const modelsOptionData = [
  {
    label: 'DP30CK',
    value: 'DP30CK',
  },
  {
    label: 'SA110',
    value: 'SA110',
  },
  {
    label: 'DPSC',
    value: 'DPSC',
  },
];

const Balanca = () => {
  var balancaService = new BalancaService();

  const [weigthValue, setWeigthValue] = useState('00.00');
  const [selectedModel, setSelectaedModel] = useState('DP30CK');
  const [selectedProtocol, setSelectedProtocol] = useState('PROTOCOLO 0');

  function sendLerPeso() {
    balancaService.sendLerPeso();

    let actualEvent = DeviceEventEmitter.addListener('eventLerPeso', event => {
      var actualReturn = event.resultLerPeso;
      setWeigthValue(actualReturn);
    });

    setTimeout(() => {
      actualEvent.remove();
    }, 2000);
  }

  function sendConfigBalanca() {
    balancaService.sendConfigBalanca(selectedModel, selectedProtocol);
  }

  return (
    <View style={styles.mainView}>
      <Header textTitle="BALANÇA" />
      <View style={styles.balanceView}>
        <View style={styles.outputView}>
          <Text style={styles.optionText}>VALOR:</Text>
          <Text style={styles.optionText}>{weigthValue}</Text>
        </View>
        <View style={styles.modelsView}>
          <Text style={styles.optionText}>Modelos:</Text>
          <View style={styles.radioFormContainer}>
            <RadioForm
              style={styles.modelsRadioButton}
              labelStyle={styles.radioFormLabel}
              radio_props={modelsOptionData}
              initial={0}
              buttonSize={10}
              formHorizontal={true}
              onPress={item => setSelectaedModel(item)}
            />
          </View>
        </View>
        <View style={styles.pickersView}>
          <View style={styles.pickerView}>
            <View style={styles.pickerAlign}>
              <Text style={styles.optionText}>PROTOCOLO: </Text>
              <Picker
                style={styles.fontPicker}
                selectedValue={selectedProtocol}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedProtocol(itemValue)
                }>
                <Picker.Item label="PROTOCOLO 0" value="PROTOCOLO 0" />
                <Picker.Item label="PROTOCOLO 1" value="PROTOCOLO 1" />
                <Picker.Item label="PROTOCOLO 2" value="PROTOCOLO 2" />
                <Picker.Item label="PROTOCOLO 3" value="PROTOCOLO 3" />
                <Picker.Item label="PROTOCOLO 4" value="PROTOCOLO 4" />
                <Picker.Item label="PROTOCOLO 5" value="PROTOCOLO 5" />
                <Picker.Item label="PROTOCOLO 6" value="PROTOCOLO 6" />
                <Picker.Item label="PROTOCOLO 7" value="PROTOCOLO 7" />
              </Picker>
            </View>
          </View>
          <View style={styles.buttonsView}>
            <View style={styles.lineButtonView}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={sendConfigBalanca}>
                <Text style={styles.textButton}>CONFIGURAR MODELO BALANÇA</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={sendLerPeso}>
                <Text style={styles.textButton}>LER PESO</Text>
              </TouchableOpacity>
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
  },
  balanceView: {
    alignItems: 'center',
    flexDirection: 'column',
    width: '80%',
    height: 450,
    justifyContent: 'center',
  },
  outputView: {
    flexDirection: 'row',
    width: '100%',
    height: '5%',
  },
  modelsView: {
    width: '100%',
    height: '20%',

    justifyContent: 'space-evenly',
  },
  modelsRadioButton: {},
  pickersView: {
    width: '100%',
    height: '30%',
    justifyContent: 'space-between',
  },
  pickerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  radioFormContainer: {alignSelf: 'center'},
  radioFormLabel: {marginHorizontal: 10},
  fontPicker: {
    width: 200,
    height: 50,
  },
  pickerAlign: {
    flexDirection: 'row',

    alignItems: 'center',
  },
  buttonsView: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70%',
  },
  lineButtonView: {
    flexDirection: 'row',
  },
  actionButton: {
    height: 45,
    width: 300,
    backgroundColor: '#0069A5',
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    marginHorizontal: 30,
    marginVertical: 10,
  },
  textButton: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Balanca;
