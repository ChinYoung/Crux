/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import 'reflect-metadata';

import { Home } from './src/pages/Home';
import { GlobalContextProvider } from './src/context/globalContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreateGroup } from './src/pages/CreateGroup';
import { RootStackParamList } from './src/route/Router';
import { GroupDetail } from './src/pages/GroupDetail';
import { AddAccount } from './src/pages/AddAccount';
import { AccountDetail } from './src/pages/AccountDetail';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <GlobalContextProvider>
        {/* <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} /> */}
        {/* <ActivityIndicator /> */}
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ title: '', headerShadowVisible: false }}
        >
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen
            name="AddGroup"
            component={CreateGroup}
            options={{ title: 'Create A Group' }}
          />
          <Stack.Screen name="AddItem" component={AddAccount} options={{ presentation: 'modal' }} />
          <Stack.Screen name="GroupDetail" component={GroupDetail} />
          <Stack.Screen
            name="AccountDetail"
            component={AccountDetail}
            options={{ presentation: 'modal' }}
          />
        </Stack.Navigator>
      </GlobalContextProvider>
    </NavigationContainer>
  );
}

export default App;
