import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Chats from './Tabs/Chats';
import Calls from './Tabs/Calls';
import Contacts from './Tabs/Contacts';
import { strings } from '../languages/Localization'
const Tab = createBottomTabNavigator();
function MyTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Chats"
            tabBarOptions={{
                activeTintColor: '#70db70'
            }}>
            <Tab.Screen
                name="Chats"
                component={Chats}

                options={{
                    tabBarLabel: strings.chats,
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='chat-processing'
                            color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Contacts"
                component={Contacts}
                options={{
                    headerShown: false,
                    tabBarLabel: strings.people,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='people'
                            color={color} size={size} />
                    ),
                }}
            />

        </Tab.Navigator>
    )
}
const Dashboard = () => {


    return (
        <MyTabs />
    )

}

export default Dashboard;