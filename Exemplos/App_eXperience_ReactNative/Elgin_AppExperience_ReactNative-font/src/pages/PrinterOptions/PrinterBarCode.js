import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import CheckBox from '@react-native-community/checkbox';
import RadioForm from 'react-native-simple-radio-button';
import {Picker} from '@react-native-picker/picker';

import PrinterService from '../../services/service_printer';

const alignTextOptionData = [
  {
    label: 'ESQUERDA',
    value: 'Esquerda',
  },
  {
    label: 'CENTRALIZADO',
    value: 'Centralizado',
  },
  {
    label: 'DIREITA',
    value: 'Direita',
  },
];

const PrinterBarCode = () => {
  var printerService = new PrinterService();

  //Variáveis de entrada
  const [codigo, setCodigo] = useState('40170725');
  const [selectedCodeType, setSelectedCodeType] = useState('EAN 8');
  const [selectedHeigthCode, setSelectedHeigthCode] = useState(20);
  const [selectedCodeWidth, setSelectedCodeWidth] = useState(1);
  const [optionTextAlign, setOptionTextAlign] = useState('Esquerda');
  const [isCutPaperActive, setIsCutPaperActive] = useState(false);

  //CHAMADA A FUNÇÃO DE TIPO DE BARCODE ESCOLHIDO - DEFAULT E QR CODE
  function doAllTypesOfBarCodes() {
    if (codigo === '') {
      Alert.alert('Alert!', 'Campo código vazio!');
    } else {
      if (selectedCodeType === 'QR CODE') {
        doPrinterQrCode();
      } else {
        doPrinterBarCodeDefault();
      }
    }
  }

  function setTypeCodeMessage(typeActual) {
    switch (typeActual) {
      case 'EAN 8':
        setCodigo('40170725');
        break;
      case 'EAN 13':
        setCodigo('0123456789012');
        break;
      case 'QR CODE':
        setCodigo('ELGIN DEVELOPERS COMMUNITY');
        break;
      case 'UPC-A':
        setCodigo('123601057072');
        break;
      case 'UPC-E':
        setCodigo('1234567');
        break;
      case 'CODE 39':
        setCodigo('CODE 39');
        break;
      case 'ITF':
        setCodigo('05012345678900');
        break;
      case 'CODE BAR':
        setCodigo('A3419500A');
        break;
      case 'CODE 93':
        setCodigo('CODE 93');
        break;
      case 'CODE 128':
        setCodigo('{C1233');
        break;
    }
  }

  function doPrinterBarCodeDefault() {
    printerService.sendPrinterBarCode(
      selectedCodeType,
      codigo,
      parseInt(selectedHeigthCode, 10),
      parseInt(selectedCodeWidth, 10),
      optionTextAlign,
    );

    printerService.jumpLine(10);
    if (isCutPaperActive) {
      printerService.cutPaper(10);
    }
  }

  function doPrinterQrCode() {
    printerService.sendPrinterQrCode(
      parseInt(selectedCodeWidth, 10),
      codigo,
      optionTextAlign,
    );

    printerService.jumpLine(10);
    if (isCutPaperActive) {
      printerService.cutPaper(10);
    }
  }

  return (
    <View style={styles.mainView}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>IMPRESSÃO DE CÓDIGO DE BARRAS</Text>
      </View>
      <View style={styles.printerSettingsView}>
        <View style={styles.mensageView}>
          <Text style={styles.labelText}>CÓDIGO:</Text>
          <TextInput
            style={styles.inputMensage}
            onChangeText={setCodigo}
            value={codigo}
          />
        </View>
        <View style={styles.codeTypePickerView}>
          <Text style={styles.labelText}>TIPO DE CÓDIGO DE BARRAS: </Text>
          <Picker
            style={styles.codeTypePicker}
            selectedValue={selectedCodeType}
            onValueChange={(itemValue, itemIndex) => {
              setTypeCodeMessage(itemValue);
              setSelectedCodeType(itemValue);
            }}>
            <Picker.Item label="EAN 8" value="EAN 8" />
            <Picker.Item label="EAN 13" value="EAN 13" />
            <Picker.Item label="QR CODE" value="QR CODE" />
            <Picker.Item label="UPC-A" value="UPC-A" />
            <Picker.Item label="CODE 39" value="CODE 39" />
            <Picker.Item label="ITF" value="ITF" />
            <Picker.Item label="CODE BAR" value="CODE BAR" />
            <Picker.Item label="CODE 93" value="CODE 93" />
            <Picker.Item label="CODE 128" value="CODE 128" />
          </Picker>
        </View>
        <View style={styles.alignSettingPrinterView}>
          <Text style={styles.labelText}>ALINHAMENTO:</Text>
          <View style={{alignSelf: 'center'}}>
            <RadioForm
              style={{marginVertical: 10}}
              labelStyle={{marginHorizontal: 5}}
              radio_props={alignTextOptionData}
              initial={0}
              buttonSize={10}
              formHorizontal={true}
              onPress={item => setOptionTextAlign(item)}
            />
          </View>
        </View>
        <View style={styles.barCodeStyleView}>
          <Text style={styles.labelText}>ESTILIZAÇÃO:</Text>
          <View style={styles.barCodeStyleSettingView}>
            <View style={styles.barCodeStylePicker}>
              <Text style={styles.optionText}>
                {selectedCodeType === 'QR CODE' ? 'SQUARE' : 'WIDTH'}
              </Text>
              <Picker
                style={styles.codeTypePicker}
                selectedValue={selectedCodeWidth}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedCodeWidth(itemValue)
                }>
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2" />
                <Picker.Item label="3" value="3" />
                <Picker.Item label="4" value="4" />
                <Picker.Item label="5" value="5" />
                <Picker.Item label="6" value="6" />
              </Picker>
            </View>
            {selectedCodeType !== 'QR CODE' ? (
              <View style={[styles.barCodeStylePickerHeigth]}>
                <Text style={styles.optionText}>HEIGTH:</Text>
                <Picker
                  style={styles.codeTypePicker}
                  selectedValue={selectedHeigthCode}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedHeigthCode(itemValue)
                  }>
                  <Picker.Item label="20" value="20" />
                  <Picker.Item label="60" value="60" />
                  <Picker.Item label="120" value="120" />
                  <Picker.Item label="200" value="200" />
                </Picker>
              </View>
            ) : (
              <></>
            )}
            <View style={styles.checkBoxStyleView}>
              <CheckBox
                disabled={false}
                value={isCutPaperActive}
                onValueChange={newValue => setIsCutPaperActive(newValue)}
              />
              <Text style={styles.optionText}>CUT PAPER</Text>
            </View>
          </View>
        </View>
        <View style={styles.printterButtonView}>
          <TouchableOpacity
            style={styles.printterButton}
            onPress={doAllTypesOfBarCodes}>
            <Text style={styles.textButton}>IMPRIMIR CÓDIGO DE BARRAS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleText: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  textButton: {
    color: 'white',
    fontWeight: 'bold',
  },
  mainView: {
    width: '90%',
  },
  printerSettingsView: {
    width: '100%',
  },
  mensageView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    width: '100%',
  },

  inputMensage: {
    width: '85%',
    borderBottomWidth: 0.5,
    borderBottomColor: 'black',
    textAlignVertical: 'bottom',
    padding: 0,
    fontSize: 17,
  },
  codeTypePickerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  codeTypePicker: {
    width: 150,
    height: 50,
  },
  barCodeStyleView: {
    flexDirection: 'column',
  },

  barCodeStylePicker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barCodeStylePickerHeigth: {
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
  },
  barCodeStyleSettingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkBoxStyleView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  printterButtonView: {
    width: '100%',
    justifyContent: 'center',
    height: 80,
  },
  printterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#0069A5',
    backgroundColor: '#0069A5',
    height: 50,
    marginVertical: 5,
  },
});

export default PrinterBarCode;
