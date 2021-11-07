import React, { useEffect, useState } from 'react';
import {
    View, Text, Dimensions, StyleSheet, TouchableWithoutFeedback,
    KeyboardAvoidingView, TouchableOpacity, TextInput, Platform, Keyboard
} from 'react-native'
import { Button } from 'react-native-paper'
import { Input } from 'react-native-elements'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { useTheme } from '@react-navigation/native'
import LoginRequest from '../network/login';
import { strings } from '../languages/Localization'
const window = Dimensions.get('window')

const SignIn = ({ navigation }) => {
    const { colors } = useTheme()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(true)
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState()
    const [loading, setLoading] = useState(false)
    const onLoginPress = () => {
        if (!email && !password) {
            setEmailError(strings.reqEmail)
            setPasswordError(strings.reqPass)
        }
        else if (email && !password) {
            setPasswordError(strings.reqPass)
            if (!email.includes('@') || !email.includes('.com')) {
                setEmailError(strings.invalidEmail)
            }
            else {
                setEmailError('')
            }
        }
        else if (!email && password !== '') {
            if (password.length < 6) {
                setPasswordError(strings.invalidPass)
            }
            else {
                setPasswordError('')
            }
            setEmailError(strings.reqEmail)
        }
        else {
            setLoading(true)
            setEmailError('')
            setPasswordError('')
            console.log(email + '\n' + password)
            LoginRequest(email, password)
                .then((res) => {

                    if (!res.additionalUserInfo) {
                        setLoading(false)
                        setEmailError(res)
                        return;
                    }

                    setLoading(false)
                    navigation.navigate('Dashboard')
                })
                .catch((err) => {
                    setLoading(false)
                    alert(err);
                });
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.view}>
                    <Text style={{ color: colors.card, fontSize: 20, marginTop: 40 }}>{strings.LOGINSCREEN}</Text>
                </View>
                <View style={styles.viewInptut}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                        <View style={[styles.textInput, { backgroundColor: colors.border }]}>
                            <MaterialCommunityIcons style={{ alignSelf: 'center', marginLeft: 10 }} size={22} name='email' color='#70db70' />
                            <TextInput
                                style={{ width: '100%', marginLeft: 20, color: colors.text }}
                                value={email.trim()}
                                onChangeText={(text) => setEmail(text.trim())}
                                placeholder={strings.YourEmail}
                                placeholderTextColor='#9E9E9E' />

                        </View>
                    </TouchableWithoutFeedback>
                    <Text style={{ color: "#FB0909", fontSize: 14 }}>{emailError}</Text>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                        <View style={[styles.textInput, { backgroundColor: colors.border }]}>
                            <View style={{ width: '90%', flexDirection: 'row' }}>

                                <Fontisto style={{ alignSelf: 'center', marginLeft: 10 }} name='locked' size={22} color='#70db70' />
                                <TextInput
                                    style={{ color: colors.text, marginLeft: 20 }}
                                    value={password}
                                    onChangeText={(text) => setPassword(text)}
                                    secureTextEntry={showPassword}
                                    placeholder={strings.Password}
                                    placeholderTextColor='#9E9E9E'

                                />
                            </View>
                            <Feather style={{ alignSelf: 'center' }} name={showPassword == true ? 'eye' : 'eye-off'} size={20} color='#9E9E9E'
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    <Text style={{ color: "#FB0909", fontSize: 14 }}>{passwordError}</Text>
                    <Button style={styles.button} color={colors.card} loading={loading}
                        onPress={() => onLoginPress()}>{strings.signIn}</Button>
                    <View style={{ flexDirection: 'row', marginTop: 50 }}>
                        <Text style={{ color: colors.text }}>{strings.createAccount} </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={{ color: '#70db70' }} >{strings.signUp}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    view: {
        width: '100%',
        height: 120,
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 20,
        backgroundColor: '#70db70',
        alignItems: 'center',
    },
    viewInptut: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50

    },
    textInput: {
        width: '80%',
        height: 50,
        borderRadius: 20,
        flexDirection: 'row', marginTop: 50,
    },
    button: {
        width: '80%',
        backgroundColor: '#70db70',
        borderRadius: 20,
        marginTop: 50
    }
})
export default SignIn;