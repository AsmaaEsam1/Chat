import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView, TouchableWithoutFeedback,
    KeyboardAvoidingView, Image, StyleSheet, Platform, Keyboard
} from 'react-native'
import { Button } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'
import Fontisto from 'react-native-vector-icons/Fontisto'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { launchImageLibrary } from 'react-native-image-picker'
import SignUpRequest from '../network/signup';
import { AddUser } from '../network/user'
import { useTheme } from '@react-navigation/native'
import firebase from 'react-native-firebase';
import { strings } from '../languages/Localization'
const SignUp = ({ navigation }) => {
    const { colors } = useTheme()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [imageProfile, setImageProfile] = useState('')
    const [confirmpassword, setConfirmPassword] = useState('')
    const [showConfrimPassword, setshowConfrimPassword] = useState(true)
    const [showPassword, setShowPassword] = useState(true)
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('')
    const [conpasswordError, setConPasswordError] = useState('')
    const [usernameError, setUsernameError] = useState('')


    const [loading, setLoading] = useState(false)
    const onSignUpPress = () => {
        if (!username) {
            setUsernameError(strings.namereq)
        }
        else if (!email) {
            setEmailError(strings.reqEmail)
        }
        else if (!password) {
            setPasswordError(strings.reqPass)
        }
        else if (password !== confirmpassword) {
            setConPasswordError(strings.matchPass)
        }
        else {
            setLoading(true)
            SignUpRequest(email, password)
                .then((res) => {
                    if (!res.additionalUserInfo) {
                        setLoading(false)
                        alert(res);
                        return;
                    }
                    let uid = firebase.auth().currentUser.uid;

                    AddUser(username, email, uid, imageProfile).then(() => {
                        setLoading(false)
                        navigation.navigate('Dashboard');

                    })

                })
                .catch((err) => {
                    setLoading(false)
                    console.log(err)
                })
                .catch((err) => {
                    setLoading(false)
                    alert(err)
                });
        }
    }
    const selectImage = useCallback((type, options) => {
        try {
            launchImageLibrary(options, (responses) => {
                if (responses.didCancel) {
                    console.log("User cancel image picker");
                }
                else if (responses.errorCode) {
                    console.log(" image picker error", responses.errorCode)
                }
                else {
                    responses.assets.map(({ uri, fileName }) => {
                        setImageProfile(uri)
                        let reference = firebase.storage().ref('Profiles/' + username)

                        let task = reference.putFile(uri)
                        task.then(() => {
                            console.log('Image uploaded to the bucket!');
                            reference.getDownloadURL().then(result => {
                                setImageProfile(result)
                            })
                        })
                    })
                }

            })
        } catch (error) {
            console.log(error)
        }
    })

    return (
        <View style={styles.container}>

            <View style={styles.view}>
                <TouchableOpacity onPress={() => selectImage()}>
                    <View style={{ width: 130, height: 130, borderRadius: 65, alignItems: 'center', justifyContent: 'center', marginTop: 50, backgroundColor: colors.card }}>
                        {imageProfile == '' ? <MaterialCommunityIcons color='#70db70' name='camera-plus' size={50} /> :
                            <Image style={{ width: 130, height: 130, borderRadius: 65 }} source={{ uri: imageProfile }} />
                        }
                    </View>
                </TouchableOpacity>
            </View>
            <ScrollView >

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.viewInptut}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                            <View style={[styles.textInput, { backgroundColor: colors.border }]}>
                                <FontAwesome style={{ alignSelf: 'center', marginLeft: 10 }} size={22} name='user' color='#70db70' />
                                <TextInput
                                    style={{ width: '80%', marginLeft: 20, color: colors.text }}
                                    value={username}
                                    onChangeText={(text) => setUsername(text)}
                                    placeholder={strings.Name}
                                    placeholderTextColor='#9E9E9E' />

                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                            <View style={{ marginTop: 15 }}>
                                <View style={[styles.textInput, { backgroundColor: colors.border }]}>
                                    <MaterialCommunityIcons style={{ alignSelf: 'center', marginLeft: 10 }} size={22} name='email' color='#70db70' />
                                    <TextInput
                                        style={{ width: '80%', marginLeft: 20, color: colors.text }}
                                        value={email}
                                        onChangeText={(text) => setEmail(text.trim())}
                                        placeholder={strings.Email}
                                        placeholderTextColor='#9E9E9E' />

                                </View>
                                <Text style={{ color: "#FB0909", fontSize: 14 }}>{emailError}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                            <View style={[styles.textInput, { backgroundColor: colors.border }]}>
                                <View style={{ width: '90%', flexDirection: 'row' }}>

                                    <Fontisto style={{ alignSelf: 'center', marginLeft: 10 }} name='locked' size={22} color='#70db70' />
                                    <TextInput
                                        style={{ marginLeft: 20, color: colors.text }}
                                        value={password}
                                        onChangeText={(text) => setPassword(text)}
                                        maxLength={15}
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
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                            <View style={[styles.textInput, { backgroundColor: colors.border }]}>
                                <View style={{ width: '90%', flexDirection: 'row' }}>

                                    <Fontisto style={{ alignSelf: 'center', marginLeft: 10 }} name='locked' size={22} color='#70db70' />
                                    <TextInput
                                        style={{ marginLeft: 20, color: colors.text }}
                                        value={confirmpassword}
                                        onChangeText={(text) => setConfirmPassword(text)}
                                        secureTextEntry={showConfrimPassword}
                                        placeholder={strings.ConPass}
                                        placeholderTextColor='#9E9E9E'

                                    />
                                </View>
                                <Feather style={{ alignSelf: 'center' }} name={showConfrimPassword == true ? 'eye' : 'eye-off'} size={20} color='#9E9E9E'
                                    onPress={() => setshowConfrimPassword(!showConfrimPassword)}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                        <Text style={{ color: "#FB0909", fontSize: 14 }}>{ }</Text>
                        <Button style={styles.button} color={colors.card} loading={loading}
                            onPress={() => onSignUpPress()}>
                            {strings.signUp}
                        </Button>
                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <Text style={{ color: colors.text }}> {strings.haveAccount} </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                                <Text style={{ color: '#70db70' }} >{strings.signIn}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>

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
        flexDirection: 'row', marginTop: 25, backgroundColor: '#fff',
    },
    button: {
        width: '80%',
        backgroundColor: '#70db70',
        borderRadius: 20,
        marginTop: 40
    }
})
export default SignUp;