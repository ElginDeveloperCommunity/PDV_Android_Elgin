import React, {useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';

import {DeviceEventEmitter} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import moment from 'moment';
import Dialog from 'react-native-dialog';
import {Picker} from '@react-native-picker/picker';

import Header from '../components/Header';
import Footer from '../components/Footer';

import BridgeService from '../services/service_bridge';

const todayDate = moment().utcOffset('-04:00').format('DD/MM/YY');

const Bridge = () => {
  var bridgeService = new BridgeService();

  const [valor, setValor] = useState('2000');
  const [numParcelas, setnumParcelas] = useState('1');
  const [numIP, setNumIP] = useState('192.168.0.104');
  const [paymentMeth, setPaymentMeth] = useState('Crédito');
  const [installmentType, setInstallmentType] = useState('1');

  const PDV = 'PDV1';
  const [refCode, setRefCode] = useState('');

  const [isCancelationDialogVisible, setIsCancelationDialogVisible] = useState(
    false,
  );
  const [isAdmDialogVisible, setIsAdmDialogVisible] = useState(false);
  const [isCuponDialogVisible, setIsCuponDialogVisible] = useState(false);
  const [isPasswordDialogVisible, setIsPasswordDialogVisible] = useState(false);
  const [selectedPasswordConfig, setSelectedPasswordConfig] = useState(
    'enablePassword',
  );
  const [
    isInputPasswordDialogVisible,
    setIsInputPasswordDialogVisible,
  ] = useState(false);
  const [isTimeOutInputVisible, setIsTimeOutInputVisible] = useState(false);

  const [selectedAdmOperation, setSelectedAdmOperation] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState('nfce');

  const [newTimeOut, setNewTimeOut] = useState('');

  const [trasactionPort, setTrasactionPort] = useState('3000');
  const [statusPort, setStatusPort] = useState('3001');

  const [sendPassword, setSendPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordEntered, setPasswordEntered] = useState('');

  const buttonsPayment = [
    {
      id: 'Crédito',
      icon: require('../icons/card.png'),
      textButton: 'CRÉDITO',
      onPress: () => setPaymentMeth('Crédito'),
    },
    {
      id: 'Débito',
      icon: require('../icons/card.png'),
      textButton: 'DÉBITO',
      onPress: () => setPaymentMeth('Débito'),
    },
  ];

  const buttonsInstallment = [
    {
      id: '3',
      icon: require('../icons/store.png'),
      textButton: 'LOJA',
      onPress: () => setInstallmentType('3'),
    },
    {
      id: '2',
      icon: require('../icons/adm.png'),
      textButton: 'ADM ',
      onPress: () => setInstallmentType('2'),
    },
    {
      id: '1',
      icon: require('../icons/card.png'),
      textButton: 'A VISTA',
      onPress: () => setInstallmentType('1'),
    },
  ];

  const checkBoxType = [
    {
      id: 'passwordSender',
      textButton: 'ENVIAR SENHA NAS TRANSAÇÕES',
      value: sendPassword,
      setValue: value => setSendPassword(value),
    },
  ];

  const consultButtons = [
    {
      id: 'terminalStatus',
      textButton: 'CONSULTAR STATUS DO TERMINAL',
      onPress: () => checkTerminalStatus(),
    },
    {
      id: 'timeOutConfig',
      textButton: 'CONSULTAR TIMEOUT CONFIGURADO',
      onPress: () => checkConfiguredTimeout(),
    },
    {
      id: 'lastTransition',
      textButton: 'CONSULTAR ULTIMA TRANSAÇÃO',
      onPress: () => checkLastTransaction(),
    },
  ];

  const configButtons = [
    {
      id: 'terminalPassword',
      textButton: 'CONFIGURAR SENHA DO TERMINAL',
      onPress: () => setIsPasswordDialogVisible(true),
    },
    {
      id: 'transactionTimeOut',
      textButton: 'CONFIGURAR TIMEOUT PARA TRANSAÇÕES',
      onPress: () => setIsTimeOutInputVisible(true),
    },
  ];

  //Funções dos botões da aplicação

  function sendTransaction() {
    if (
      tryToUpdateBridgeServer() &&
      isValueValidToElginPay() &&
      isInstallmentsFieldValid()
    ) {
      shouldSendPassword();

      if (paymentMeth === 'Crédito') {
        bridgeService.sendIniciaVendaCredito(
          parseInt(generateRandomForBridgeTransactions(), 10),
          PDV,
          valor.replace(/[^\d]+/g, ''),
          parseInt(installmentType, 10),
          parseInt(numParcelas, 10),
        );

        let actualEvent = DeviceEventEmitter.addListener(
          'eventVendaCredito',
          event => {
            var actualReturn = event.resultVendaCredito;
            Alert.alert('Retorno E1 - BRIDGE', actualReturn);
          },
        );

        setTimeout(() => {
          actualEvent.remove();
        }, 2000);
      } else {
        bridgeService.sendIniciaVendaDebito(
          parseInt(generateRandomForBridgeTransactions(), 10),
          PDV,
          valor.replace(/[^\d]+/g, ''),
        );

        let actualEvent = DeviceEventEmitter.addListener(
          'eventVendaDebito',
          event => {
            var actualReturn = event.resultVendaDebito;
            Alert.alert('Retorno E1 - BRIDGE', actualReturn);
          },
        );

        setTimeout(() => {
          actualEvent.remove();
        }, 2000);
      }
    }
  }

  function cancelTransaction() {
    if (refCode.trim() !== '') {
      setIsCancelationDialogVisible(false);

      if (tryToUpdateBridgeServer()) {
        bridgeService.sendIniciaCancelamentoVenda(
          parseInt(generateRandomForBridgeTransactions(), 10),
          PDV,
          valor.replace(/[^\d]+/g, ''),
          todayDate,
          refCode,
        );

        let actualEvent = DeviceEventEmitter.addListener(
          'eventCancelamentoVenda',
          event => {
            var actualReturn = event.resultCancelamentoVenda;
            Alert.alert('Retorno E1 - BRIDGE', actualReturn);
          },
        );

        setTimeout(() => {
          actualEvent.remove();
        }, 2000);
      }
    } else {
      Alert.alert(
        'Código de Referência Vazio',
        'Por favor, insira um código de referência válido',
      );
    }
    setTimeout(() => {
      setRefCode('');
    }, 500);
  }

  function admOperation() {
    setIsAdmDialogVisible(false);
    if (tryToUpdateBridgeServer()) {
      shouldSendPassword();
      bridgeService.sendIniciaOperacaoAdministrativa(
        parseInt(generateRandomForBridgeTransactions(), 10),
        PDV,
        parseInt(selectedAdmOperation, 10),
      );

      let actualEvent = DeviceEventEmitter.addListener(
        'eventOperacaoAdministrativa',
        event => {
          var actualReturn = event.resultOperacaoAdministrativa;
          Alert.alert('Retorno E1 - BRIDGE', actualReturn);
        },
      );

      setTimeout(() => {
        actualEvent.remove();
      }, 2000);
    }
  }

  function printCouponTest(couponType) {
    if (tryToUpdateBridgeServer()) {
      shouldSendPassword();

      if (couponType === 'nfce') {
        doBridgeXmlNFCe();
      } else if (couponType === 'sat') {
        doBridgeXmlSAT();
      } else {
        doBridgeXmlCancelment();
      }
    }
  }

  function doBridgeXmlNFCe() {
    bridgeService.sendBridgeNFCe();

    let actualEvent = DeviceEventEmitter.addListener(
      'eventBridgeNFCe',
      event => {
        var actualReturn = event.resultBridgeNFCe;
        Alert.alert('Retorno E1 - BRIDGE', actualReturn, [
          {text: 'OK', onPress: () => setIsCuponDialogVisible(false)},
        ]);

        setTimeout(() => {
          actualEvent.remove();
        }, 2000);
      },
    );
  }

  function doBridgeXmlSAT() {
    bridgeService.sendBridgeSAT();

    let actualEvent = DeviceEventEmitter.addListener(
      'eventBridgeSAT',
      event => {
        var actualReturn = event.resultBridgeSAT;
        Alert.alert('Retorno E1 - BRIDGE', actualReturn, [
          {text: 'OK', onPress: () => setIsCuponDialogVisible(false)},
        ]);

        setTimeout(() => {
          actualEvent.remove();
        }, 2000);
      },
    );
  }

  function doBridgeXmlCancelment() {
    bridgeService.sendBridgeCancelation();

    let actualEvent = DeviceEventEmitter.addListener(
      'eventBridgeCancelation',
      event => {
        var actualReturn = event.resultBridgeCancelation;
        Alert.alert('Retorno E1 - BRIDGE', actualReturn, [
          {text: 'OK', onPress: () => setIsCuponDialogVisible(false)},
        ]);

        setTimeout(() => {
          actualEvent.remove();
        }, 2000);
      },
    );
  }

  function checkTerminalStatus() {
    if (tryToUpdateBridgeServer()) {
      shouldSendPassword();
      bridgeService.sendConsultarStatus();

      let actualEvent = DeviceEventEmitter.addListener(
        'eventConsultarStatus',
        event => {
          var actualReturn = event.resultConsultarStatus;
          Alert.alert('Retorno E1 - BRIDGE', actualReturn);
        },
      );

      setTimeout(() => {
        actualEvent.remove();
      }, 2000);
    }
  }

  function checkConfiguredTimeout() {
    if (tryToUpdateBridgeServer()) {
      shouldSendPassword();
      bridgeService.sendGetTimeOut();

      let actualEvent = DeviceEventEmitter.addListener(
        'eventGetTimeOut',
        event => {
          var actualReturn = event.resultGetTimeOut;
          Alert.alert('Retorno E1 - BRIDGE', actualReturn);
        },
      );

      setTimeout(() => {
        actualEvent.remove();
      }, 2000);
    }
  }

  function checkLastTransaction() {
    if (tryToUpdateBridgeServer()) {
      shouldSendPassword();
      bridgeService.sendConsultarUltimaTransacao(PDV);

      let actualEvent = DeviceEventEmitter.addListener(
        'eventUltimaTransacao',
        event => {
          var actualReturn = event.resultUltimaTransacao;
          Alert.alert('Retorno E1 - BRIDGE', actualReturn);
        },
      );

      setTimeout(() => {
        actualEvent.remove();
      }, 2000);
    }
  }

  function configureTerminalPassword() {
    if (selectedPasswordConfig === 'enablePassword') {
      setIsInputPasswordDialogVisible(true);
    } else {
      if (!sendPassword) {
        Alert.alert(
          'Alerta',
          'Habilite a opção de envio de senha e envie a senha mais atual para desabilitar a senha do terminal',
        );
      } else {
        if (tryToUpdateBridgeServer()) {
          shouldSendPassword();
          bridgeService.sendSetSenhaServer('', false);
          closeDialog('passwordConfigDialog');

          let actualEvent = DeviceEventEmitter.addListener(
            'eventSetSenhaServer',
            event => {
              var actualReturn = event.resultSetSenhaServer;
              Alert.alert('Retorno E1 - BRIDGE', actualReturn);
            },
          );

          setTimeout(() => {
            actualEvent.remove();
          }, 2000);
        }
      }
    }
  }

  function enableTerminalPassword() {
    if (passwordEntered === '') {
      Alert.alert(
        'Erro na Senha',
        'Por favor insira um valor para a senha desejada!',
      );
    } else {
      if (tryToUpdateBridgeServer()) {
        shouldSendPassword();
        bridgeService.sendSetSenhaServer(passwordEntered, true);
        closeDialog('successPassword');

        let actualEvent = DeviceEventEmitter.addListener(
          'eventSetSenhaServer',
          event => {
            var actualReturn = event.resultSetSenhaServer;
            Alert.alert('Retorno E1 - BRIDGE', actualReturn);
          },
        );

        setTimeout(() => {
          actualEvent.remove();
        }, 2000);
      }
    }
  }

  function setTransactionTimeOut() {
    if (newTimeOut.trim() === '') {
      Alert.alert('Alerta', 'O valor para o TimeOut não pode ser vazio.');
    } else {
      if (tryToUpdateBridgeServer()) {
        shouldSendPassword();
        bridgeService.sendSetTimeOut(parseInt(newTimeOut, 10));

        let actualEvent = DeviceEventEmitter.addListener(
          'eventSetTimeOut',
          event => {
            var actualReturn = event.resultSetTimeOut;
            Alert.alert('Retorno E1 - BRIDGE', actualReturn);
          },
        );

        setTimeout(() => {
          actualEvent.remove();
        }, 2000);
      }
      setIsTimeOutInputVisible(false);
      setNewTimeOut('');
    }
  }

  //Funções de validação

  function isIpAdressValid() {
    let ipValid = false;

    if (
      /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]){1}$/.test(
        numIP,
      )
    ) {
      ipValid = true;
      return ipValid;
    } else {
      ipValid = false;
      Alert.alert(
        'Erro de IP',
        'O endereço IP está incorreto, digite um endereço válido',
      );
      return ipValid;
    }
  }

  function isValueValidToElginPay() {
    if (valor < 1) {
      Alert.alert(
        'Erro na entrada de valor',
        'O valor mínimo para transações é de R$1.00!',
      );
      return false;
    } else {
      return true;
    }
  }

  function isInstallmentsFieldValid() {
    if (paymentMeth === 'Crédito') {
      if (
        (installmentType === '2' || installmentType === '3') &&
        parseInt(numParcelas, 10) < 2
      ) {
        Alert.alert(
          'Erro no parcelamento',
          'O número de parcelas deve ser maior que 2!',
        );
        return false;
      } else if (numParcelas === '') {
        Alert.alert(
          'Erro no parcelamento',
          'O número de parcelas não pode ser vazio!',
        );
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  function isTransactionPortValid() {
    if (parseInt(trasactionPort, 10) > 65535) {
      Alert.alert(
        'Erro na Porta de Transação',
        'O valor inserido na porta de transação excede o limite esbelecido de 65535!',
        'OK',
      );
      return false;
    } else if (trasactionPort.trim() === '') {
      Alert.alert(
        'Erro na Porta de Transação',
        'O valor inserido na porta de transação não pode ser vazio',
      );
      return false;
    } else {
      return true;
    }
  }

  function isStatusPortValid() {
    if (parseInt(trasactionPort, 10) > 65535) {
      Alert.alert(
        'Erro na Porta de Status',
        'O valor inserido na porta de status excede o limite esbelecido de 65535!',
      );
      return false;
    } else if (trasactionPort.trim() === '') {
      Alert.alert(
        'Erro na Porta de Status',
        'O valor inserido na porta de status não pode ser vazio',
      );
      return false;
    } else {
      return true;
    }
  }

  //Funções de configurações do Server Bridge

  function tryToUpdateBridgeServer() {
    if (isIpAdressValid() && isTransactionPortValid() && isStatusPortValid()) {
      bridgeService.sendSetServer(
        numIP,
        parseInt(trasactionPort, 10),
        parseInt(statusPort, 10),
      );

      return true;
    } else {
      return false;
    }
  }

  function shouldSendPassword() {
    if (sendPassword) {
      bridgeService.sendSetSenha(password, true);
    } else {
      bridgeService.sendSetSenha(password, false);
    }
  }

  // Outras funções

  function generateRandomForBridgeTransactions() {
    return Math.floor(Math.random() * (1000000 - 0)) + 0;
  }

  function closeDialog(wichDialogToClose) {
    switch (wichDialogToClose) {
      case 'cancelationDialog':
        setIsCancelationDialogVisible(false);
        setRefCode('');
        break;
      case 'passwordConfigDialog':
        setIsPasswordDialogVisible(false);
        setSelectedPasswordConfig('');
        break;
      case 'passwordInputDialog':
        setPasswordEntered('');
        setIsInputPasswordDialogVisible(false);
        break;
      case 'successPassword':
        setIsPasswordDialogVisible(false);
        setIsInputPasswordDialogVisible(false);
        setPasswordEntered('');
        break;
      case 'timeOutInputDialog':
        setIsTimeOutInputVisible(false);
        setNewTimeOut('');
        break;
    }
  }

  /*
    useEffect(() => {
        if(isFirstTime){
            startConnectPrinterIntern();
            isFirstTime = false;
        }

        DeviceEventEmitter.addListener('eventResultPaygo', (data) => {
            var actualReturn = data.resultPaygo;
            var saleVia =  data.resultPaygoSale;

            setImage64(saleVia);
            optionsReturnPaygo(actualReturn, saleVia);
        });
    },[]);*/
  return (
    <View style={styles.mainView}>
      <Header textTitle={'E1 - BRIDGE'} />
      <View style={styles.menuView}>
        <View style={styles.configView}>
          <View style={styles.mensageView}>
            <Text style={styles.labelText}>IP:</Text>
            <TextInput
              placeholder={'000.000.0.000'}
              style={styles.inputMensage}
              onChangeText={setNumIP}
              value={numIP}
            />
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

          <View style={styles.mensageView}>
            <Text style={styles.labelText}>Nº PARCELAS:</Text>
            <TextInput
              placeholder={'00'}
              style={styles.inputMensage}
              editable={paymentMeth === 'Crédito' ? true : false}
              keyboardType="numeric"
              onChangeText={setnumParcelas}
              value={numParcelas}
            />
          </View>

          <View style={styles.paymentView}>
            <Text style={styles.labelText}> FORMAS DE PAGAMENTO </Text>
            <View style={styles.paymentsButtonView}>
              {buttonsPayment.map(({id, icon, textButton, onPress}, index) => (
                <TouchableOpacity
                  style={[
                    styles.paymentButton,
                    id === paymentMeth && styles.paymentButtonSelected,
                  ]}
                  key={index}
                  onPress={onPress}>
                  <Image style={styles.icon} source={icon} />
                  <Text style={styles.buttonText}>{textButton}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.paymentView}>
            <Text style={styles.labelText}> TIPO DE PARCELAMENTO </Text>
            <View style={styles.paymentsButtonView}>
              {buttonsInstallment.map(
                ({id, icon, textButton, onPress}, index) => (
                  <TouchableOpacity
                    style={[
                      styles.paymentButton,
                      id === installmentType && styles.paymentButtonSelected,
                    ]}
                    key={index}
                    onPress={onPress}>
                    <Image style={styles.icon} source={icon} />
                    <Text style={styles.buttonText}>{textButton}</Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          </View>

          <View>
            <Dialog.Container visible={isCancelationDialogVisible}>
              <Dialog.Title>Código de Referência</Dialog.Title>
              <Dialog.Input
                label="Insira o código de referência"
                onChangeText={setRefCode}
                value={refCode}
                keyboardType={'numeric'}
              />
              <Dialog.Button
                label="CANCELAR"
                onPress={() => closeDialog('cancelationDialog')}
              />
              <Dialog.Button label="OK" onPress={() => cancelTransaction()} />
            </Dialog.Container>
          </View>

          <View>
            <Dialog.Container visible={isAdmDialogVisible}>
              <Dialog.Title>Escolha uma Operação Administrativa</Dialog.Title>
              <Picker
                selectedValue={selectedAdmOperation}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedAdmOperation(itemValue)
                }>
                <Picker.Item label="Operação Administrativa" value="0" />
                <Picker.Item label="Operação de Instalação" value="1" />
                <Picker.Item label="Operação de Configuração" value="2" />
                <Picker.Item label="Operação de Manutenção" value="3" />
                <Picker.Item label="Teste de Comunicação" value="4" />
                <Picker.Item label="Reimpressão de Comprovante" value="5" />
              </Picker>

              <Dialog.Button
                label="CANCELAR"
                onPress={() => setIsAdmDialogVisible(false)}
              />
              <Dialog.Button label="OK" onPress={() => admOperation()} />
            </Dialog.Container>
          </View>

          <View>
            <Dialog.Container visible={isCuponDialogVisible}>
              <Dialog.Title>Escolha o Tipo de Cupom</Dialog.Title>
              <Picker
                selectedValue={selectedCoupon}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedCoupon(itemValue)
                }>
                <Picker.Item label="Imprimir Cupom NFCe" value="nfce" />
                <Picker.Item label="Imprimir Cupom Sat" value="sat" />
                <Picker.Item
                  label="Imprimir Cupom Sat Cancelamento"
                  value="cancelCoupon"
                />
              </Picker>

              <Dialog.Button
                label="CANCELAR"
                onPress={() => setIsCuponDialogVisible(false)}
              />
              <Dialog.Button
                label="OK"
                onPress={() => printCouponTest(selectedCoupon)}
              />
            </Dialog.Container>
          </View>

          <View style={styles.submitionButtonsView}>
            <TouchableOpacity
              style={styles.submitionButton}
              onPress={() => sendTransaction()}>
              <Text style={styles.textButton}>ENVIAR TRANSAÇÃO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitionButton}
              onPress={() => setIsCancelationDialogVisible(true)}>
              <Text style={styles.textButton}>CANCELAR TRANSAÇÃO</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.submitionButtonsView}>
            <TouchableOpacity
              style={styles.submitionButton}
              onPress={() => setIsAdmDialogVisible(true)}>
              <Text style={styles.textButton}>OPERAÇÃO ADM</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitionButton}
              onPress={() => setIsCuponDialogVisible(true)}>
              <Text style={styles.textButton}>IMPRIMIR CUPOM TESTE</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.configView}>
          <View style={styles.portView}>
            <Text style={styles.labelText}>PORTAS TRANSAÇÕES/STATUS:</Text>
            <View style={styles.inputPortView}>
              <TextInput
                placeholder={'3000'}
                style={styles.inputPort}
                keyboardType="numeric"
                onChangeText={setTrasactionPort}
                value={trasactionPort}
              />
              <TextInput
                placeholder={'3000'}
                style={styles.inputPort}
                keyboardType="numeric"
                onChangeText={setStatusPort}
                value={statusPort}
              />
            </View>
          </View>
          <View>
            {checkBoxType.map(({id, textButton, value, setValue}, index) => (
              <View key={index} style={styles.checkBoxStyleView}>
                <CheckBox
                  disabled={false}
                  value={value}
                  onValueChange={newValue => setValue(newValue)}
                />
                <Text style={styles.optionText}>{textButton}</Text>
              </View>
            ))}
          </View>
          <View style={styles.mensageView}>
            <Text style={styles.labelText}>SENHA:</Text>
            <TextInput
              editable={sendPassword === true ? true : false}
              placeholder={'insira a senha'}
              secureTextEntry={true}
              style={styles.inputMensage}
              onChangeText={setPassword}
              value={password}
            />
          </View>
          <View style={styles.e1BridgeFunctionsView}>
            <Text style={styles.labelText}>FUNÇÕES E1-BRIDGE: </Text>
            <View style={styles.consultButtonsView}>
              {consultButtons.map(({id, textButton, onPress}, index) => (
                <View key={index}>
                  <TouchableOpacity
                    style={styles.largeButton}
                    onPress={onPress}>
                    <Text style={styles.textButton}>{textButton}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.configButtonsView}>
              {configButtons.map(({id, textButton, onPress}, index) => (
                <View key={index}>
                  <TouchableOpacity
                    style={styles.largeButton}
                    onPress={onPress}>
                    <Text style={styles.textButton}>{textButton}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <Dialog.Container visible={isPasswordDialogVisible}>
              <Dialog.Title>Escolha como configurar a senha</Dialog.Title>
              <Picker
                selectedValue={selectedPasswordConfig}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedPasswordConfig(itemValue)
                }>
                <Picker.Item
                  label="Habilitar Senha no Terminal"
                  value="enablePassword"
                />
                <Picker.Item
                  label="Desabilitar Senha no Terminal"
                  value="unablePassword"
                />
              </Picker>

              <Dialog.Button
                label="CANCELAR"
                onPress={() => closeDialog('passwordConfigDialog')}
              />
              <Dialog.Button
                label="OK"
                onPress={() => configureTerminalPassword()}
              />
            </Dialog.Container>

            <View>
              <Dialog.Container visible={isInputPasswordDialogVisible}>
                <Dialog.Title>Digite a senha a ser habilitada</Dialog.Title>
                <Dialog.Input
                  label="Senha: "
                  onChangeText={setPasswordEntered}
                  secureTextEntry={true}
                  value={passwordEntered}
                  keyboardType={'default'}
                  password={true}
                />
                <Dialog.Button
                  label="CANCELAR"
                  onPress={() => closeDialog('passwordInputDialog')}
                />
                <Dialog.Button
                  label="OK"
                  onPress={() => enableTerminalPassword()}
                />
              </Dialog.Container>
            </View>

            <View>
              <Dialog.Container visible={isTimeOutInputVisible}>
                <Dialog.Title>
                  Defina um novo timeout para transação (em segundos)
                </Dialog.Title>
                <Dialog.Input
                  label="Novo TimeOut: "
                  onChangeText={setNewTimeOut}
                  value={newTimeOut}
                  keyboardType={'numeric'}
                />
                <Dialog.Button
                  label="CANCELAR"
                  onPress={() => closeDialog('timeOutInputDialog')}
                />
                <Dialog.Button
                  label="OK"
                  onPress={() => setTransactionTimeOut()}
                />
              </Dialog.Container>
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
  inputPortView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  inputPort: {
    flexDirection: 'row',
    width: '45%',
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
  portView: {
    flexDirection: 'row',
    width: '82%',
    alignItems: 'center',
  },
  checkBoxStyleView: {
    flexDirection: 'row',
    alignItems: 'center',

    width: '100%',
  },
  e1BridgeFunctionsView: {
    justifyContent: 'space-between',
    height: '60%',
  },
  consultButtonsView: {
    flexDirection: 'column',

    height: '45%',
    justifyContent: 'space-between',
  },
  configButtonsView: {
    flexDirection: 'column',

    height: '30%',
    justifyContent: 'space-between',
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
  },
  paymentButtonSelected: {
    borderColor: '#23F600',
  },
  typeTEFButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 15,
    width: 100,
    height: 35,
    marginHorizontal: 5,
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
  largeButton: {
    width: '100%',
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
  buttonText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Bridge;
