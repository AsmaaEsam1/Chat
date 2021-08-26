import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import SignIn from './src/container/SignIn'
import SignUp from './src/container/SignUp';
import Splash from './src/container/Splash';
import Dashboard from './src/container/Dashboard';
import ChatScreen from './src/container/ChatScreen';
import SearchScreen from './src/container/SearchScreen';
import NewChat from './src/container/NewChat';
import Settings from './src/container/Settings';
import FullImages from './src/container/FullImages';
import FullImageUsers from './src/container/FullImageUsers';
import FullProfileImage from './src/container/FullProfileImage';
import SenderVoiceCalling from './src/container/SenderVoiceCalling';
import RecevierVoiceCalling from './src/container/RecevierVoiceCalling';
import SenderVedioCalling from './src/container/SenderVedioCalling';
import RecevierVedioCalling from './src/container/RecevierVedioCalling';
import AsyncStorage from '@react-native-community/async-storage';
import { EventRegister } from 'react-native-event-listeners'
import { strings } from './src/languages/Localization'
const App = () => {
  const STORAGE_THEME_KEY = '@save_theme'
  const [theme, settheme] = useState('')

  const Stack = createStackNavigator();
  useEffect(() => {
    strings.getLanguage()
    readData();
    const listener = EventRegister.addEventListener('changeThemeApp', (data) => {
      settheme(data)
    })
    return () => {
      EventRegister.removeEventListener(listener)

    }
  }, [theme])
  const DarkThem = {
    dark: false,
    colors: {
      primary: 'rgb(0, 45, 85)',
      background: 'rgb(45,45,45)',
      card: 'rgb(35, 35, 35)',
      text: '#fff',
      border: 'rgb(30, 30, 30)',
      editText: 'rgb(150, 150, 150)',
      notification: 'rgb(50, 50, 50)',
    },
  };
  const readData = async () => {
    try {
      const themeApp = await AsyncStorage.getItem(STORAGE_THEME_KEY)
      if (themeApp !== null) {
        settheme(themeApp)
      }
    } catch (e) {
      alert('Failed to fetch the data from storagee')
    }
  }
  return (
    <NavigationContainer theme={theme == 'Dark' ? DarkThem : DefaultTheme}>
      <Stack.Navigator initialRouteName='Splash'>
        <Stack.Screen name='Splash' component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name='SignIn' component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name='SignUp' component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name='Dashboard' component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name='ChatScreen' component={ChatScreen} options={{ headerTitle: null }} />
        <Stack.Screen name='SearchScreen' component={SearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name='NewChat' component={NewChat} options={{ headerShown: false }} />
        <Stack.Screen name='Settings' component={Settings} options={{ headerShown: false }} />
        <Stack.Screen name='FullImages' component={FullImages} options={{ headerShown: false }} />
        <Stack.Screen name='FullImageUsers' component={FullImageUsers} options={{ headerShown: false }} />
        <Stack.Screen name='FullProfileImage' component={FullProfileImage} options={{ headerShown: false }} />
        <Stack.Screen name='SenderVoiceCalling' component={SenderVoiceCalling} options={{ headerShown: false }} />
        <Stack.Screen name='RecevierVoiceCalling' component={RecevierVoiceCalling} options={{ headerShown: false }} />
        <Stack.Screen name='SenderVedioCalling' component={SenderVedioCalling} options={{ headerShown: false }} />
        <Stack.Screen name='RecevierVedioCalling' component={RecevierVedioCalling} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default App;
