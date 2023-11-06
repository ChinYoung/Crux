/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { FC } from 'react';
import 'reflect-metadata';
import { Text, View } from 'react-native';

import { Home } from './src/pages/Home';
import { GlobalContextProvider } from './src/context/globalContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Header: FC = () => (
  <View>
    <Text>xxxxxxx</Text>
  </View>
);

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
          <Stack.Screen name="Home" component={Home} options={{ headerLeft: () => <Header /> }} />
        </Stack.Navigator>
      </GlobalContextProvider>
    </NavigationContainer>
  );
}

export default App;
