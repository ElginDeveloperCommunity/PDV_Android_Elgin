/**
 * Sample React Native Menu
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  Image,
  PermissionsAndroid,
  BackHandler,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';

import Footer from '../components/Footer';
import Logo from '../icons/ElginDeveloperCommunity.png';

const Menu = () => {
  const navigator = useNavigation();

  //Ao entrar na aplicação, para prosseguir, é necessário a permissão de acesso ao armazenamento externo
  useEffect(() => {
    //Pede a permissão de armazenamento
    askWritePermission();
    return () => {};
  }, []);

  async function askWritePermission() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );

    //Caso a permissão não seja concedida, mostre o toast com a informação e feche a aplicação
    if (
      granted === PermissionsAndroid.RESULTS.DENIED ||
      granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
    ) {
      ToastAndroid.show(
        'É necessário conceder a permissão para as funcionalidades NFC-e e PIX 4!',
        ToastAndroid.LONG,
      );
      BackHandler.exitApp();
    }
  }

  return (
    <View style={styles.mainView}>
      <View style={styles.contentView}>
        <View style={styles.bannerView}>
          <Image style={styles.banner} source={Logo} />
        </View>
        <View style={styles.menuView}>
          <ScrollView horizontal style={styles.scrollContainer}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigator.navigate('Bridge')}>
              <Image
                style={styles.lgIcon}
                source={require('../icons/elginpay.png')}
              />
              <Text style={styles.textButton}>E1 - BRIDGE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigator.navigate('Nfce')}>
              <Image
                style={styles.icon}
                source={require('../icons/nfce.png')}
              />
              <Text style={styles.textButton}>NFC-e</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigator.navigate('Printer')}>
              <Image
                style={styles.icon}
                source={require('../icons/printer.png')}
              />
              <Text style={styles.textButton}>IMPRESSORA</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigator.navigate('Balanca')}>
              <Image
                style={styles.icon}
                source={require('../icons/balanca.png')}
              />
              <Text style={styles.textButton}>BALANÇA</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigator.navigate('TEF')}>
              <Image
                style={styles.icon}
                source={require('../icons/msitef.png')}
              />
              <Text style={styles.textButton}>TEF</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigator.navigate('CarteiraDigital')}>
              <Image
                style={styles.icon}
                source={require('../icons/msitef.png')}
              />
              <Text style={styles.textButton}>CARTEIRA DIGITAL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigator.navigate('SAT')}>
              <Image style={styles.icon} source={require('../icons/sat.png')} />
              <Text style={styles.textButton}>SAT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigator.navigate('BarCodes')}>
              <Image
                style={styles.icon}
                source={require('../icons/barCode.png')}
              />
              <Text style={styles.textButton}>CÓDIGO DE BARRAS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigator.navigate('Pix4')}>
              <Image
                style={styles.icon}
                source={require('../icons/pix4.png')}
              />
              <Text style={styles.textButton}>PIX 4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigator.navigate('Kiosk')}>
              <Image
                style={styles.icon}
                source={require('../icons/kiosk.png')}
              />
              <Text style={styles.textButton}>KIOSK</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <Footer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentView: {
    height: '100%',
    width: '90%',
    alignSelf: 'center',

    justifyContent: 'space-between',
  },
  bannerView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    resizeMode: 'contain',
    width: 490,
    height: 139,
  },
  menuView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    height: 295,
    marginTop: 30,
  },
  icon: {
    width: 50,
    height: 50,
  },
  lgIcon: {
    width: '100%',
    height: 50,
    resizeMode: 'contain',
  },
  scrollContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 15,
  },
  menuButton: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 2,
    borderRadius: 15,
    width: 100,
    height: 130,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  textButton: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Menu;
