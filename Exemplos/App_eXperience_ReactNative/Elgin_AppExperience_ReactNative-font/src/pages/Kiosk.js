import React, {useEffect, useState} from 'react';

import {StyleSheet, Text, View, Switch} from 'react-native';

import Header from '../components/Header';
import KioskService from '../services/service_kiosk';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

var kioskService = new KioskService();

const Kiosk = () => {
  const navigator = useNavigation();

  const [switchNavigationBar, setSwitchNavigationBar] = useState(true);
  const [switchStatusBar, setSwitchStatusBar] = useState(true);
  const [switchPowerButton, setSwitchPowerButton] = useState(true);

  useEffect(() => {
    return () => {
      kioskService.sendResetKioskMode();
    };
  }, []);

  const handleChangeSwitchNavigationBar = value => {
    setSwitchNavigationBar(value);
    kioskService.sendSwitchBarraNavegacao(value);
  };

  const handleChangeSwitchStatusBar = value => {
    setSwitchStatusBar(value);
    kioskService.sendSwitchBarraStatus(value);
  };

  const handleChangeSwitchPowerButton = value => {
    setSwitchPowerButton(value);
    kioskService.sendSwitchBotaoPower(value);
  };

  const back = () => {
    setSwitchNavigationBar(true);
    setSwitchStatusBar(true);
    setSwitchPowerButton(true);

    kioskService.sendResetKioskMode();

    navigator.goBack();
  };

  const setFullKioskMode = () => {
    setSwitchNavigationBar(false);
    setSwitchStatusBar(false);
    setSwitchPowerButton(false);

    kioskService.sendSetFullKioskMode();
  };

  return (
    <View style={styles.mainView}>
      <Header textTitle="KIOSK" />
      <View style={styles.kioskView}>
        <View style={styles.switchContainer}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Barra de Navegação</Text>
            <Switch
              value={switchNavigationBar}
              onValueChange={handleChangeSwitchNavigationBar}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Barra de Status</Text>
            <Switch
              value={switchStatusBar}
              onValueChange={handleChangeSwitchStatusBar}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Botão de Power</Text>
            <Switch
              value={switchPowerButton}
              onValueChange={handleChangeSwitchPowerButton}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={back} title="Voltar">
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={setFullKioskMode}
            title="Full Kiosk">
            <Text style={styles.buttonText}>Full Kiosk</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kioskView: {
    flex: 1,
    alignSelf: 'stretch',
  },
  switchContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    width: 300,
    justifyContent: 'space-between',
    marginTop: 10,
    backgroundColor: '#FFFFF0',
    elevation: 5,
    paddingVertical: 5,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    textTransform: 'uppercase',
    textAlign: 'center',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'black',
    textTransform: 'uppercase',
  },
});

export default Kiosk;
