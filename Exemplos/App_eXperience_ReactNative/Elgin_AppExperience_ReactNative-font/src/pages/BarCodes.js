import React, {useState, useEffect, useRef} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import Header from '../components/Header';
import Footer from '../components/Footer';

import BarCode from '../icons/scannedBarCode.png';

const BarCodes = () => {
  const inputOne = useRef();
  const inputTwo = useRef();
  const inputThree = useRef();
  const inputFour = useRef();
  const inputFive = useRef();
  const inputSix = useRef();
  const inputSeven = useRef();
  const inputEight = useRef();
  const inputNine = useRef();
  const inputTen = useRef();

  const [firstInput, setFirstInput] = useState('');
  const [secondInput, setSecondInput] = useState('');
  const [thirdInput, setTirthInput] = useState('');
  const [fourthInput, setFourthInput] = useState('');
  const [fifthInput, setFifthInput] = useState('');
  const [sixthInput, setSixthInput] = useState('');
  const [seventhInput, setSeventhInput] = useState('');
  const [eigthInput, setEightInput] = useState('');
  const [ninthInput, setNinthInput] = useState('');
  const [tenthInput, setTenthInput] = useState('');

  function clearAllOfInputs() {
    setFirstInput('');
    setSecondInput('');
    setTirthInput('');
    setFourthInput('');
    setFifthInput('');
    setSixthInput('');
    setSeventhInput('');
    setEightInput('');
    setNinthInput('');
    setTenthInput('');
  }

  return (
    <View style={styles.mainView}>
      <Header textTitle={'CÓDIGO DE BARRA'} />
      <View style={styles.mainBarCodesView}>
        <View style={styles.barCodesView}>
          <View style={styles.showBarCodesView}>
            {/* <TextInput
                            placeholder="FirstTextInput"
                            returnKeyType="next"
                            onSubmitEditing={() => { secondInput.focus(); }}
                            blurOnSubmit={false}
                        />

                        <TextInput
                            ref={(input) => { setSecondInput(input) }}
                            placeholder="secondTextInput"

                            returnKeyType="next"
                            onSubmitEditing={() => { thirdInput.focus(); }}
                            blurOnSubmit={false}
                        />

                        <TextInput
                            ref={(input) => { setTirthInput(input) }}
                            placeholder="secondTextInput"
                        /> */}

            <View style={styles.containerInputMessages}>
              {firstInput !== '' ? (
                <Image source={BarCode} style={{width: 30, height: 30}} />
              ) : (
                <View style={{width: 30, backgroundColor: 'red'}} />
              )}
              <TextInput
                returnKeyType="next"
                ref={inputOne}
                onSubmitEditing={() => inputTwo.current.focus()}
                blurOnSubmit={false}
                style={styles.inputMensage}
                onChangeText={setFirstInput}
                value={firstInput}
              />
              {firstInput !== '' && (
                <Text style={styles.textSucessResult}>
                  Leitura Realizada com sucesso
                </Text>
              )}
            </View>

            <View style={styles.containerInputMessages}>
              {secondInput !== '' ? (
                <Image source={BarCode} style={{width: 30, height: 30}} />
              ) : (
                <View style={{width: 30, backgroundColor: 'red'}} />
              )}
              <TextInput
                returnKeyType="next"
                ref={inputTwo}
                onSubmitEditing={() => inputThree.current.focus()}
                blurOnSubmit={false}
                editable={firstInput !== '' ? true : false}
                style={styles.inputMensage}
                onChangeText={setSecondInput}
                value={secondInput}
              />
              {secondInput !== '' && (
                <Text style={styles.textSucessResult}>
                  Leitura Realizada com sucesso
                </Text>
              )}
            </View>

            <View style={styles.containerInputMessages}>
              {thirdInput !== '' ? (
                <Image source={BarCode} style={{width: 30, height: 30}} />
              ) : (
                <View style={{width: 30, backgroundColor: 'red'}} />
              )}
              <TextInput
                returnKeyType="next"
                ref={inputThree}
                onSubmitEditing={() => inputFour.current.focus()}
                blurOnSubmit={false}
                editable={secondInput !== '' ? true : false}
                style={styles.inputMensage}
                onChangeText={setTirthInput}
                value={thirdInput}
              />
              {thirdInput !== '' && (
                <Text style={styles.textSucessResult}>
                  Leitura Realizada com sucesso
                </Text>
              )}
            </View>

            <View style={styles.containerInputMessages}>
              {fourthInput !== '' ? (
                <Image source={BarCode} style={{width: 30, height: 30}} />
              ) : (
                <View style={{width: 30, backgroundColor: 'red'}} />
              )}
              <TextInput
                returnKeyType="next"
                ref={inputFour}
                onSubmitEditing={() => inputFive.current.focus()}
                blurOnSubmit={false}
                editable={thirdInput !== '' ? true : false}
                style={styles.inputMensage}
                onChangeText={setFourthInput}
                value={fourthInput}
              />
              {fourthInput !== '' && (
                <Text style={styles.textSucessResult}>
                  Leitura Realizada com sucesso
                </Text>
              )}
            </View>

            <View style={styles.containerInputMessages}>
              {fifthInput !== '' ? (
                <Image source={BarCode} style={{width: 30, height: 30}} />
              ) : (
                <View style={{width: 30, backgroundColor: 'red'}} />
              )}
              <TextInput
                returnKeyType="next"
                onSubmitEditing={() => inputSix.current.focus()}
                ref={inputFive}
                blurOnSubmit={false}
                editable={fourthInput !== '' ? true : false}
                style={styles.inputMensage}
                onChangeText={setFifthInput}
                value={fifthInput}
              />
              {fifthInput !== '' && (
                <Text style={styles.textSucessResult}>
                  Leitura Realizada com sucesso
                </Text>
              )}
            </View>

            <View style={styles.containerInputMessages}>
              {sixthInput !== '' ? (
                <Image source={BarCode} style={{width: 30, height: 30}} />
              ) : (
                <View style={{width: 30, backgroundColor: 'red'}} />
              )}
              <TextInput
                returnKeyType="next"
                onSubmitEditing={() => inputSeven.current.focus()}
                ref={inputSix}
                blurOnSubmit={false}
                editable={fifthInput !== '' ? true : false}
                style={styles.inputMensage}
                onChangeText={setSixthInput}
                value={sixthInput}
              />
              {sixthInput !== '' && (
                <Text style={styles.textSucessResult}>
                  Leitura Realizada com sucesso
                </Text>
              )}
            </View>

            <View style={styles.containerInputMessages}>
              {seventhInput !== '' ? (
                <Image source={BarCode} style={{width: 30, height: 30}} />
              ) : (
                <View style={{width: 30, backgroundColor: 'red'}} />
              )}
              <TextInput
                returnKeyType="next"
                onSubmitEditing={() => inputEight.current.focus()}
                ref={inputSeven}
                blurOnSubmit={false}
                editable={sixthInput !== '' ? true : false}
                style={styles.inputMensage}
                onChangeText={setSeventhInput}
                value={seventhInput}
              />
              {seventhInput !== '' && (
                <Text style={styles.textSucessResult}>
                  Leitura Realizada com sucesso
                </Text>
              )}
            </View>

            <View style={styles.containerInputMessages}>
              {eigthInput !== '' ? (
                <Image source={BarCode} style={{width: 30, height: 30}} />
              ) : (
                <View style={{width: 30, backgroundColor: 'red'}} />
              )}
              <TextInput
                returnKeyType="next"
                onSubmitEditing={() => inputNine.current.focus()}
                ref={inputEight}
                blurOnSubmit={false}
                editable={seventhInput !== '' ? true : false}
                style={styles.inputMensage}
                onChangeText={setEightInput}
                value={eigthInput}
              />
              {eigthInput !== '' && (
                <Text style={styles.textSucessResult}>
                  Leitura Realizada com sucesso
                </Text>
              )}
            </View>

            <View style={styles.containerInputMessages}>
              {ninthInput !== '' ? (
                <Image source={BarCode} style={{width: 30, height: 30}} />
              ) : (
                <View style={{width: 30, backgroundColor: 'red'}} />
              )}
              <TextInput
                returnKeyType="next"
                onSubmitEditing={() => inputTen.current.focus()}
                ref={inputNine}
                blurOnSubmit={false}
                editable={eigthInput !== '' ? true : false}
                style={styles.inputMensage}
                onChangeText={setNinthInput}
                value={ninthInput}
              />
              {ninthInput !== '' && (
                <Text style={styles.textSucessResult}>
                  Leitura Realizada com sucesso
                </Text>
              )}
            </View>

            <View style={styles.containerInputMessages}>
              {tenthInput !== '' ? (
                <Image source={BarCode} style={{width: 30, height: 30}} />
              ) : (
                <View style={{width: 30, backgroundColor: 'red'}} />
              )}
              <TextInput
                returnKeyType="next"
                ref={inputTen}
                blurOnSubmit={false}
                editable={ninthInput !== '' ? true : false}
                style={styles.inputMensage}
                onChangeText={setTenthInput}
                value={tenthInput}
              />
              {tenthInput !== '' && (
                <Text style={styles.textSucessResult}>
                  Leitura Realizada com sucesso
                </Text>
              )}
            </View>
          </View>
          <View style={styles.barCodeTypeView}>
            <View style={styles.codeView}>
              <Text style={styles.labelText}>QR CODE</Text>
              <Image
                style={styles.qrCodeImage}
                source={require('../icons/elginQRCode.png')}
              />
            </View>
            <View style={styles.codeView}>
              <Text style={styles.labelText}>EAN 13</Text>
              <Image
                style={styles.eanCodeImage}
                resizeMode="contain"
                source={require('../icons/eanBarCode.png')}
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonsView}>
          <TouchableOpacity
            style={styles.submitionButton}
            onPress={() => inputOne.current.focus()}>
            <Text style={styles.textButton}>INICIAR LEITURA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitionButton}
            onPress={clearAllOfInputs}>
            <Text style={styles.textButton}>LIMPAR CAMPOS</Text>
          </TouchableOpacity>
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
    backgroundColor: 'white',
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 20,
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
  textButton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  buttonsView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitionButton: {
    width: '48%',
    height: 54,
    backgroundColor: '#0069A5',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
  },
  mainBarCodesView: {
    alignItems: 'center',
    width: '90%',
    height: 450,
    justifyContent: 'space-between',
  },
  barCodesView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 390,
    width: '100%',
  },
  showBarCodesView: {
    borderWidth: 2,
    borderRadius: 30,
    width: '70%',
    alignItems: 'center',
  },
  barCodeTypeView: {
    flexDirection: 'column',
    width: '30%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  scannedBarCode: {
    flexDirection: 'row',
    height: 30,
    width: '90%',
    justifyContent: 'space-between',
    margin: 4,
  },
  barCodeData: {
    flexDirection: 'row',
    width: '47%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barCodeText: {
    width: '84%',
    height: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
  },
  barCodeIcon: {
    width: '15%',
    height: 25,
  },
  statusText: {
    width: '50%',
  },
  codeView: {
    alignItems: 'center',
  },
  qrCodeImage: {
    width: 130,
    height: 130,
  },
  eanCodeImage: {
    height: 140,
    width: 170,
  },
  containerInputMessages: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    marginVertical: 1,
  },
  textSucessResult: {
    marginLeft: 10,
    fontSize: 14,
    color: '#807C7C',
  },
  inputMensage: {
    width: '45%',
    borderWidth: 1,
    borderRadius: 10,
    borderBottomColor: 'black',
    textAlignVertical: 'bottom',
    padding: 3,
    fontSize: 17,
    marginLeft: 10,
  },
});

export default BarCodes;
