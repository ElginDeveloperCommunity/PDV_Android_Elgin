import React, {useState, useEffect, useMemo} from 'react';
import Footer from '../components/Footer';

import {RadioButton} from 'react-native-paper';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  DeviceEventEmitter,
  Alert,
} from 'react-native';
import Dialog from 'react-native-dialog';
import {Picker} from '@react-native-picker/picker';

import Header from '../components/Header';
import PrinterBarCode from './PrinterOptions/PrinterBarCode';
import PrinterImage from './PrinterOptions/PrinterImage';
import PrinterText from './PrinterOptions/PrinterText';

import PrinterService from '../services/service_printer';

const printerService = new PrinterService();

const Printer = () => {
  const [typePrinter, setTypePrinter] = useState('TEXT');

  const [printerConnectionType, setPrinterConnectionType] = useState('M8');

  const [selectedPrinterModel, setSelectedPrinterModel] = useState('i7 PLUS');

  const [isModelDialogVisible, setIsModelDialogVisible] = useState(false);

  const [ipConection, setIpConection] = useState('192.168.0.31:9100');

  const buttonsPrinter = [
    {
      id: 'TEXT',
      icon: require('../icons/printerText.png'),
      textButton: 'IMPRESSÃO\nDE TEXTO',
      onPress: () => setTypePrinter('TEXT'),
    },
    {
      id: 'BARCODE',
      icon: require('../icons/printerBarCode.png'),
      textButton: 'IMPRESSÃO DE\nCÓDIGO DE BARRAS',
      onPress: () => setTypePrinter('BARCODE'),
    },
    {
      id: 'IMAGE',
      icon: require('../icons/printerImage.png'),
      textButton: 'IMPRESSÃO\nDE IMAGEM',
      onPress: () => setTypePrinter('IMAGE'),
    },
  ];

  useEffect(() => {
    startConnectPrinterIntern();

    return () => {
      printerService.printerStop();
    };
  }, []);

  const typePrinterAtual = useMemo(() => {
    switch (typePrinter) {
      case 'TEXT':
        return <PrinterText />;
      case 'BARCODE':
        return <PrinterBarCode />;
      case 'IMAGE':
        return <PrinterImage />;
    }
  }, [typePrinter]);

  function actualStatusPrinter() {
    printerService.getStatusPrinter();

    let actualEvent = DeviceEventEmitter.addListener(
      'eventStatusPrinter',
      event => {
        var actualReturn = event.statusPrinter;

        if (actualReturn === '5') {
          Alert.alert('Retorno', 'Papel está presente e não está próximo!');
        } else if (actualReturn === '6') {
          Alert.alert('Retorno', 'Papel está próximo do fim!');
        } else if (actualReturn === '7') {
          Alert.alert('Retorno', 'Papel ausente!');
        } else {
          Alert.alert('Retorno', 'Status Desconhecido');
        }
      },
    );

    setTimeout(() => {
      actualEvent.remove();
    }, 2000);
  }

  function actualStatusGaveta() {
    printerService.getStatusGaveta();

    let actualEvent = DeviceEventEmitter.addListener(
      'eventStatusGaveta',
      event => {
        var actualReturn = event.statusGaveta;

        if (actualReturn === '1') {
          Alert.alert('Retorno', 'Gaveta aberta!');
        } else if (actualReturn === '2') {
          Alert.alert('Retorno', 'Gaveta fechada!');
        } else {
          Alert.alert('Retorno', 'Status Desconhecido');
        }
      },
    );

    setTimeout(() => {
      actualEvent.remove();
    }, 2000);
  }

  function sendAbrirGaveta() {
    printerService.sendOpenGaveta();
  }

  function onChangePrinterConnectionType(value) {
    setPrinterConnectionType(value);
    if (value === 'M8') {
      startConnectPrinterIntern();
      return;
    }
    setIsModelDialogVisible(true);
  }

  function onChangePrinterModel() {
    switch (printerConnectionType) {
      case 'usb':
        startConnectPrinterUsb(selectedPrinterModel);
        break;
      case 'ip':
        startConnectPrinterIP(selectedPrinterModel);
        break;
      default:
        startConnectPrinterIntern();
        break;
    }
    setIsModelDialogVisible(false);
  }

  function startConnectPrinterIntern() {
    setPrinterConnectionType('M8');
    printerService.sendStartConnectionPrinterIntern();
  }

  function startConnectPrinterIP(model) {
    if (ipConection !== '') {
      var ip = ipConection.split(':')[0];
      var port = ipConection.split(':')[1];

      if (isIpAdressValid()) {
        printerService.sendStartConnectionPrinterExternIp(
          model,
          ip,
          parseInt(port, 10),
        );
        setSelectedPrinterModel(model);
      } else {
        Alert.alert('Alert', 'Digíte um endereço e porta IP válido!');
        setPrinterConnectionType('M8');
      }
    } else {
      Alert.alert('Alert', 'Digíte um endereço e porta IP válido!');
      setPrinterConnectionType('M8');
    }
  }

  function startConnectPrinterUsb(model) {
    setSelectedPrinterModel(model);
    printerService.sendStartConnectionPrinterExternUsb(model);
  }

  function isIpAdressValid() {
    let ipValid = false;

    if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?[0-9][0-9])$/.test(
        ipConection,
      )
    ) {
      ipValid = true;
      return ipValid;
    } else {
      ipValid = false;
      return ipValid;
    }
  }

  return (
    <View style={styles.mainView}>
      <Header textTitle="IMPRESSORA" />
      <View style={styles.menuView}>
        <View style={styles.optonsMenuView}>
          {buttonsPrinter.map(({id, icon, textButton, onPress}, index) => (
            <TouchableOpacity
              style={[
                styles.buttonMenu,
                {borderColor: id === typePrinter ? '#0069A5' : 'black'},
              ]}
              key={index}
              onPress={onPress}>
              <Image style={styles.icon} source={icon} />
              <Text style={styles.menuTextButton}>{textButton}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.statusButton}
            onPress={actualStatusPrinter}>
            <Image
              style={styles.statusIcon}
              source={require('../icons/status.png')}
            />
            <Text style={styles.statusButtonTXT}>STATUS IMPRESSORA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statusButton}
            onPress={actualStatusGaveta}>
            <Image
              style={styles.statusIcon}
              source={require('../icons/status.png')}
            />
            <Text style={styles.statusButtonTXT}>STATUS GAVETA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={sendAbrirGaveta}>
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
                  status={
                    printerConnectionType === 'M8' ? 'checked' : 'unchecked'
                  }
                  onPress={() => onChangePrinterConnectionType('M8')}
                />
                <Text style={styles.labelText}>IMP. INTERNA</Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton
                  value="usb"
                  color="#0069A5"
                  status={
                    printerConnectionType === 'usb' ? 'checked' : 'unchecked'
                  }
                  onPress={() => onChangePrinterConnectionType('usb')}
                />
                <Text style={styles.labelText}>
                  IMP. EXTERNA - USB{' '}
                  {printerConnectionType === 'usb' ? selectedPrinterModel : ''}
                </Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton
                  value="ip"
                  color="#0069A5"
                  status={
                    printerConnectionType === 'ip' ? 'checked' : 'unchecked'
                  }
                  onPress={() => onChangePrinterConnectionType('ip')}
                />
                <Text style={styles.labelText}>
                  IMP. EXTERNA - IP{' '}
                  {printerConnectionType === 'ip' ? selectedPrinterModel : ''}
                </Text>
              </View>
            </View>
            <View style={styles.conectionView}>
              <Text style={styles.textSizeDefault}>IP:</Text>
              <TextInput
                style={styles.inputMensage}
                placeholder="192.168.0.1:9100"
                placeholderTextColor="#999"
                autoCapitalize="none"
                keyboardType="default"
                autoCorrect={false}
                onChangeText={setIpConection}
                value={ipConection}
              />
            </View>
          </View>
          <View style={styles.settingPrinterBody}>{typePrinterAtual}</View>
        </View>
      </View>

      <Dialog.Container visible={isModelDialogVisible}>
        <Dialog.Title>
          Selecione o modelo de impressora a ser conectado
        </Dialog.Title>
        <Picker
          selectedValue={selectedPrinterModel}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedPrinterModel(itemValue);
          }}>
          {printerConnectionType === 'usb' && (
            <Picker.Item label="i7 PLUS" value="i7 PLUS" />
          )}
          <Picker.Item label="i8" value="i8" />
          <Picker.Item label="i9" value="i9" />
        </Picker>

        <Dialog.Button
          label="CANCELAR"
          onPress={() => {
            setIsModelDialogVisible(false);
            startConnectPrinterIntern();
          }}
        />

        <Dialog.Button
          label="OK"
          onPress={() => {
            onChangePrinterModel();
          }}
        />
      </Dialog.Container>
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
  menuView: {
    flexDirection: 'row',
    width: '90%',
    height: 400,
    justifyContent: 'space-between',
  },
  optonsMenuView: {
    flexDirection: 'column',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonMenu: {
    borderWidth: 2,
    borderColor: 'black',
    width: 150,
    height: 80,
    fontWeight: 'bold',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButton: {
    width: '100%',
    height: 35,
    backgroundColor: '#0069A5',
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
  },
  actionButtonTXT: {
    color: 'white',
    fontWeight: 'bold',
  },
  icon: {
    width: 50,
    height: 50,
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  menuTextButton: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
  },
  textButton: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusButton: {
    flexDirection: 'row',
    width: 150,
    height: 50,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: 'black',
    alignItems: 'center',
    marginBottom: 7,
  },
  statusButtonTXT: {
    fontSize: 10,
    marginLeft: 5,
  },
  statusIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  settingsPrinterView: {
    width: '78%',
    height: '100%',
    flexDirection: 'column',
  },
  settingsPrinterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '10%',
    paddingBottom: 5,
  },
  typePrinterOptionView: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingPrinterBody: {
    width: '100%',
    height: '90%',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conectionView: {
    flexDirection: 'row',
    paddingLeft: 5,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: 'black',
    justifyContent: 'center',
    width: 180,
    height: '100%',
    alignItems: 'center',
    alignContent: 'center',
  },
  conectionIpText: {
    fontWeight: 'bold',
  },
  conectionButton: {
    backgroundColor: '#0069A5',
    borderWidth: 2,
    borderRadius: 15,
    borderColor: '#0069A5',
    height: '100%',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: 150,
  },
  inputMensage: {
    width: '80%',
    // borderBottomColor: 'black',
    // borderBottomWidth: 2,
    fontSize: 16,
    color: 'black',
    // textAlignVertical: 'bottom',
    padding: 0,
  },
});

export default Printer;
