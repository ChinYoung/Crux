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
import { CreateTag } from './src/pages/CreateTag';
import { RootStackParamList } from './src/types/Router';
import { TagDetail } from './src/pages/TagDetail';
import { CreateItem } from './src/pages/CreateItem';

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
          <Stack.Screen name="AddTag" component={CreateTag} />
          <Stack.Screen name="AddItem" component={CreateItem} />
          <Stack.Screen name="TagDetail" component={TagDetail} />
        </Stack.Navigator>
      </GlobalContextProvider>
    </NavigationContainer>
  );
}

export default App;
