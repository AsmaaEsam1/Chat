import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase';
import Spinner from 'react-native-spinkit';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useTheme } from '@react-navigation/native'
import { strings } from '../languages/Localization'
const Splash = ({ navigation }) => {
    const [visible, setVisible] = useState(false)
    const { colors } = useTheme()
    useEffect(() => {
        setVisible(true)
        setTimeout(function () {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {

                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Dashboard' }]
                    })
                }
                else {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'SignIn' }]
                    })
                }
            })
            setVisible(false)
        }, 3000)

    }, [])
    return (
        <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{
                color: colors.text, fontFamily: 'sans-serif',
                fontSize: 35, fontWeight: 'bold', alignSelf: 'center'
            }} >
                {strings.chat}
            </Text>
            <FontAwesome style={{ alignSelf: 'center', marginTop: 20 }} name='wechat' color='#70db70' size={200} />
            <Spinner style={{ alignSelf: 'center', marginTop: 30 }} isVisible={visible} size={50} type='Circle' color='#70db70' />

        </View>
    )
}

export default Splash;