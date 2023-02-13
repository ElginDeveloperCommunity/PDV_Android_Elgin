import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const AppStack = createStackNavigator();

import Menu from './pages/Menu';
import Printer from './pages/Printer';
import TEF from './pages/TEF';
import BarCodes from './pages/BarCodes';
import SAT from './pages/SAT';
import Balanca from './pages/Balanca';
import CarteiraDigital from './pages/CarteiraDigital';
import Bridge from './pages/Bridge';
import Nfce from './pages/Nfce';
import Pix4 from './pages/Pix4';
import Kiosk from './pages/Kiosk';

export default function Routes() {
  return (
    <NavigationContainer>
      <AppStack.Navigator screenOptions={{headerShown: false}}>
        <AppStack.Screen component={Menu} name="Menu" />
        <AppStack.Screen component={Bridge} name="Bridge" />
        <AppStack.Screen component={Nfce} name="Nfce" />
        <AppStack.Screen component={Printer} name="Printer" />
        <AppStack.Screen component={BarCodes} name="BarCodes" />
        <AppStack.Screen component={Balanca} name="Balanca" />
        <AppStack.Screen component={TEF} name="TEF" />
        <AppStack.Screen component={CarteiraDigital} name="CarteiraDigital" />
        <AppStack.Screen component={SAT} name="SAT" />
        <AppStack.Screen component={Pix4} name="Pix4" />
        <AppStack.Screen component={Kiosk} name="Kiosk" />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
