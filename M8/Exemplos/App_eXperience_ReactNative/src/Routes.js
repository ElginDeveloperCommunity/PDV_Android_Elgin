import React from 'react';

import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

const AppStack = createStackNavigator()

import Menu from './pages/Menu'
import Printer from './pages/Printer'
import TEF from './pages/TEF'
import BarCodes from './pages/BarCodes'
import SAT from './pages/SAT'

export default function Routes(){
    return(
        <NavigationContainer>
              <AppStack.Navigator screenOptions={{headerShown: false}}>
                <AppStack.Screen component={Menu} name='Menu' /> 
                <AppStack.Screen component={Printer} name='Printer' />
                <AppStack.Screen component={TEF} name='TEF' />
                <AppStack.Screen component={BarCodes} name='BarCodes' />
                <AppStack.Screen component={SAT} name='SAT' />
        
                
            </AppStack.Navigator>
          
        </NavigationContainer>
    );
};
