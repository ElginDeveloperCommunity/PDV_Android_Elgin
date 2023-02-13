import React, {useEffect} from 'react';

import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Pix4Service from '../services/service_pix4';

const frameworks = [
  {
    name: 'JAVA',
    githubLink:
      'https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_Java',
    icon: require('../icons/pix4_java.png'),
  },
  {
    name: 'DELPHI',
    githubLink:
      'https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_FireMonkey',
    icon: require('../icons/pix4_delphi.png'),
  },
  {
    name: 'FLUTTER',
    githubLink:
      'https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_Flutter',
    icon: require('../icons/pix4_flutter.png'),
  },
  {
    name: 'X. ANDROID',
    githubLink:
      'https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_XamarinAndroid',
    icon: require('../icons/pix4_xamarin_android.png'),
  },
  {
    name: 'X. FORMS',
    githubLink:
      'https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_XamarinForms',
    icon: require('../icons/pix4_xamarin_forms.png'),
  },
  {
    name: 'R. NATIVE',
    githubLink:
      'https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_ReactNative',
    icon: require('../icons/pix4_react_native.png'),
  },
  {
    name: 'KOTLIN',
    githubLink:
      'https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_Kotlin',
    icon: require('../icons/pix4_kotlin.png'),
  },
  {
    name: 'IONIC',
    githubLink:
      'https://github.com/ElginDeveloperCommunity/PDV_Android_M8_M10/tree/master/Exemplos/App_eXperience_Ionic',
    icon: require('../icons/pix4_ionic.png'),
  },
];

const products = [
  {
    name: 'ABACAXI',
    price: '7.00',
    icon: require('../icons/pix4_abacaxi.png'),
    assetFileName: 'pix4_image_abacaxi',
    outputFileName: 'P1.jpg',
  },
  {
    name: 'BANANA',
    price: '7.00',
    icon: require('../icons/pix4_banana.png'),
    assetFileName: 'pix4_image_banana',
    outputFileName: 'P2.jpg',
  },
  {
    name: 'CHOCOLATE',
    price: '7.00',
    icon: require('../icons/pix4_chocolate.png'),
    assetFileName: 'pix4_image_chocolate',
    outputFileName: 'P3.jpg',
  },
  {
    name: 'DETERGENTE',
    price: '7.00',
    icon: require('../icons/pix4_detergente.png'),
    assetFileName: 'pix4_image_detergente',
    outputFileName: 'P4.jpg',
  },
  {
    name: 'ERVILHA',
    price: '7.00',
    icon: require('../icons/pix4_ervilha.png'),
    assetFileName: 'pix4_image_ervilha',
    outputFileName: 'P5.jpg',
  },
  {
    name: 'FEIJAO',
    price: '7.00',
    icon: require('../icons/pix4_feijao.png'),
    assetFileName: 'pix4_image_feijao',
    outputFileName: 'P6.jpg',
  },
  {
    name: 'GOIABADA',
    price: '7.00',
    icon: require('../icons/pix4_goiabada.png'),
    assetFileName: 'pix4_image_goiabada',
    outputFileName: 'P7.jpg',
  },
  {
    name: 'HAMBURGUER',
    price: '7.00',
    icon: require('../icons/pix4_hamburguer.png'),
    assetFileName: 'pix4_image_hamburguer',
    outputFileName: 'P8.jpg',
  },
  {
    name: 'IOGURTE',
    price: '7.00',
    icon: require('../icons/pix4_iogurte.png'),
    assetFileName: 'pix4_image_iogurte',
    outputFileName: 'P9.jpg',
  },
  {
    name: 'JACA',
    price: '7.00',
    icon: require('../icons/pix4_jaca.png'),
    assetFileName: 'pix4_image_jaca',
    outputFileName: 'P10.jpg',
  },
];

const pix4Service = new Pix4Service();

const Pix4 = () => {
  useEffect(() => {
    pix4Service.sendExecuteStoreImages();

    pix4Service.sendAbreConexaoDisplay();
  }, []);

  function sendApresentaQrCodeLinkGihtub(item) {
    pix4Service.sendApresentaQrCodeLinkGihtub(item.name, item.githubLink);
  }

  function sendAdicionaProdutoApresenta(item) {
    pix4Service.sendAdicionaProdutoApresenta(
      item.name,
      item.price,
      item.assetFileName,
      item.outputFileName,
    );
  }

  function sendCarregarImagens() {
    pix4Service.sendCarregarImagens();
  }

  function sendApresentaListaCompras() {
    pix4Service.sendApresentaListaCompras();
  }

  return (
    <View style={styles.mainView}>
      <Header textTitle="PIX 4" />
      <View style={styles.pix4View}>
        <View style={styles.itemGroup}>
          <Text style={styles.textTitle}>
            QR CODE/LINK PARA OUTROS EXEMPLOS EM NOSSO GITHUB:
          </Text>
          <View style={styles.lineButtonView}>
            {frameworks.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.itemContainer}
                onPress={() => sendApresentaQrCodeLinkGihtub(item)}>
                <Image source={item.icon} style={styles.itemImage} />
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.itemGroup}>
          <Text style={styles.textTitle}>PRODUCTS:</Text>
          <View style={styles.lineButtonView}>
            {products.slice(0, 5).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.itemContainer}
                onPress={() => sendAdicionaProdutoApresenta(item)}>
                <Text style={styles.itemText}>{item.name}</Text>
                <Image source={item.icon} style={styles.itemImage} />
                <Text style={styles.itemText}>R$ {item.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.lineButtonView}>
            {products.slice(5, 10).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.itemContainer}
                onPress={() => sendAdicionaProdutoApresenta(item)}>
                <Text style={styles.itemText}>{item.name}</Text>
                <Image source={item.icon} style={styles.itemImage} />
                <Text style={styles.itemText}>R$ {item.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.buttonsView}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={sendApresentaListaCompras}>
            <Text style={styles.textButton}>APRESENTAR LISTA DE COMPRAS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={sendCarregarImagens}>
            <Text style={styles.textButton}>CARREGAR IMAGENS NO PIX4</Text>
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
    justifyContent: 'space-between',
  },
  pix4View: {
    alignItems: 'center',
    flexDirection: 'column',
    width: '80%',
    height: 450,
    justifyContent: 'center',
  },
  textTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  itemGroup: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  itemContainer: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
    width: 80,
  },
  itemImage: {
    width: 50,
    height: 50,
  },
  itemText: {
    fontSize: 10,
    color: 'black',
  },
  buttonsView: {
    flexDirection: 'column',
    alignItems: 'center',
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
    marginTop: 10,
  },
  textButton: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Pix4;
