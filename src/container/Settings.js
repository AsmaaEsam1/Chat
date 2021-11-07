import React, { useLayoutEffect, useContext, useState, useEffect } from 'react'
import { Text, TextInput, StyleSheet, Dimensions, View, Alert, SafeAreaView } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import { UpdateUser, UpdateUserName } from '../network/user'
import LogOutUser from '../network/logout'
import Profile from '../component/Profile'
import firebase from 'react-native-firebase'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { EventRegister } from 'react-native-event-listeners'
import AsyncStorage from '@react-native-community/async-storage'
import { Dialog, Button, RadioButton } from 'react-native-paper'
import { useTheme } from '@react-navigation/native'
import { strings } from '../languages/Localization'
const window = Dimensions.get('window')
const Settings = ({ navigation }) => {
    const { colors } = useTheme()
    const STORAGE_THEME_KEY = '@save_theme'
    const uuid = firebase.auth().currentUser.uid;
    const [loading, setLoading] = useState(false)
    const [theme, setTheme] = useState('')
    const [visibleTheme, setVisibleTheme] = useState(false);
    const [visibleDialog, setVisibleDialog] = useState(false)
    const [visibleDialogName, setVisibleDialogName] = useState(false)
    const [checkedTheme, setCheckedTheme] = useState('');
    const [changeName, setChangeName] = useState('')
    const [userDetail, setUserDetail] = useState({
        id: '',
        name: '',
        profileImage: '',
    });
    const { name, profileImage } = userDetail;
    const language = strings.getLanguage()



    useEffect(() => {
        readTheme()
        try {
            //Get current user from Real-time database in firebase
            setLoading(true)
            firebase.database('https://chat-9c21b-default-rtdb.firebaseio.com/')
                .ref('users')
                .on('value', (dataSnapshot) => {
                    let currentUser = {
                        id: '',
                        name: '',
                        profileImage: '',
                    };
                    dataSnapshot.forEach((child) => {
                        if (uuid == child.val().uuid) {
                            currentUser.id = uuid;
                            currentUser.name = child.val().name;
                            currentUser.profileImage = child.val().profileImage;
                        }
                    })
                    setUserDetail(currentUser);
                    setLoading(false)
                })

        } catch (error) {

            alert(error)
            setLoading(false)
        }

    }, []);
    const changeTheme = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_THEME_KEY, checkedTheme)

            console.log('Data successfully saved')
        } catch (e) {
            console.log('Failed to save the data to the storage')
        }
    }
    const readTheme = async () => {
        try {
            const getTheme = await AsyncStorage.getItem(STORAGE_THEME_KEY)
            if (getTheme == null) {
                setTheme(strings.Systemdefault)
                setCheckedTheme(strings.Systemdefault)
            }
            else if (getTheme !== null) {
                if (getTheme == 'Systemdefault') {
                    setTheme(strings.Systemdefault)
                    setCheckedTheme('Systemdefault')
                }
                else if (getTheme == 'Dark') {
                    setTheme(strings.Dark)
                    setCheckedTheme('Dark')
                }
                else if (getTheme == 'Light') {
                    setTheme(strings.Light)
                    setCheckedTheme('Light')
                }
                EventRegister.emit('changeThemeApp', getTheme)

            }
        } catch (e) {
            alert('Failed to fetch the data from storage')
        }
        setVisibleTheme(false)

    }

    //update profile image
    const selectImage = () => {
        const options = {
            storageOptions: {
                skipBackup: true
            }
        };
        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                response.assets.map(({ uri, fileName }) => {
                    var storage = firebase.storage();
                    var storageRef = storage.ref('Profiles/' + name);
                    var uploadTask = storageRef.putFile(uri);

                    uploadTask.then(() => {
                        console.log('Image uploaded to the bucket!');
                        storageRef.getDownloadURL().then(result => {
                            console.log(result)
                            UpdateUser(uuid, result)
                        })

                    })
                })
            }
        })
    }
    const upateName = (name) => {
        UpdateUserName(uuid, name)
        setVisibleDialogName(false)
    }
    const logout = () => {
        LogOutUser()

            .then(() => {
                navigation.navigate('SignIn')
            })
            .catch((err) => alert(err))
    }
    //* img Tap To show image in full screen

    const imgTap = (profileImg, name) => {
        if (!profileImg) {
            navigation.navigate('FullProfileImage', {
                name,
                imgText: name.charAt(0),
            })
        }
        else {
            navigation.navigate('FullProfileImage', {
                name,
                img: profileImg,
            })
        }
    }


    return (

        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.profileView}>
                <View style={{ width: window.width, flexDirection: 'row', marginTop: 20 }}>

                    {
                        strings.getLanguage() === 'ar' ? <Ionicons style={{ color: colors.card, marginLeft: 10 }}
                            name='arrow-forward' size={25} color={colors.card}
                            onPress={() => navigation.navigate('Dashboard')} />
                            :
                            <Ionicons style={{ color: colors.card, marginLeft: 10 }}
                                name='arrow-back' size={25} color={colors.card}
                                onPress={() => navigation.navigate('Dashboard')} />


                    }
                    <AntDesign style={{
                        transform: (strings.getLanguage() === 'ar' ? [{ rotate: '180deg' }] : [{ rotate: '0deg' }]),
                        marginLeft: window.width - 80
                    }} name='logout' size={20}
                        color={colors.card}
                        onPress={() => setVisibleDialog(true)}
                    />
                </View>
                <Profile
                    img={profileImage}
                    onImgTap={() => imgTap(profileImage, name)}
                    onEditImgTap={() => selectImage()}
                    name={name}
                    visible={loading}
                />
            </View>
            <View style={styles.nameView}>
                <AntDesign style={{ fontWeight: 'bold' }} name='user' color='#70db70' size={25} />
                <Text style={styles.name}>{strings.Name}</Text>
            </View>
            <View style={styles.nameInput}>
                <Text style={{ color: '#C1C0C0', marginLeft: 20 }} >{name}</Text>
                <TouchableOpacity onPress={() => setVisibleDialogName(true)}>
                    <Feather name='edit-3' size={20} color='#817F7F' />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setVisibleTheme(true)}>
                <View>
                    <View style={styles.theme} >
                        <Ionicons name='color-palette-outline' color='#70db70' size={25} />
                        <Text style={{ fontSize: 18, color: '#70db70', marginLeft: 20, fontWeight: 'bold' }}>
                            {strings.Theme}
                        </Text>

                    </View>
                    <Text style={{ color: '#C1C0C0', marginLeft: 100, marginTop: 5 }}>{theme}</Text>
                </View>
            </TouchableOpacity>

            <Dialog style={{ backgroundColor: colors.card }} visible={visibleTheme} onDismiss={() => setVisibleTheme(false)}>
                <Dialog.Title style={{ color: colors.text }}>{strings.ChooseTheme}</Dialog.Title>
                <Dialog.Content>
                    <TouchableOpacity onPress={() => changeTheme()}>
                        <View style={{ flexDirection: 'row' }}>
                            <RadioButton

                                value={strings.Systemdefault}
                                status={checkedTheme === 'Systemdefault' ? 'checked' : 'unchecked'}
                                onPress={() => { setCheckedTheme('Systemdefault') }}
                                color={colors.text}
                            />
                            <Text style={{ marginTop: 5, color: colors.text }}>
                                {strings.Systemdefault}
                            </Text>
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => changeTheme()}>
                        <View style={{ flexDirection: 'row' }}>
                            <RadioButton value={strings.Dark}
                                status={checkedTheme === 'Dark' ? 'checked' : 'unchecked'}
                                onPress={() => { setCheckedTheme('Dark') }}
                                color={colors.text} />
                            <Text style={{ marginTop: 5, color: colors.text }}>
                                {strings.Dark}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => changeTheme()}>
                        <View style={{ flexDirection: 'row' }}>
                            <RadioButton value={strings.Light}
                                status={checkedTheme === 'Light' ? 'checked' : 'unchecked'}
                                onPress={() => { setCheckedTheme('Light') }}
                                color={colors.text} />
                            <Text style={{ marginTop: 5, color: colors.text }}>
                                {strings.Light}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Dialog.Content>
                <Dialog.Actions style={{ justifyContent: 'space-around' }}>
                    <Button color='#FF4500' onPress={() => setVisibleTheme(false)}>{strings.Cancel}</Button>
                    <Button color='#70db70' onPress={() => readTheme()}>{strings.Ok}</Button>
                </Dialog.Actions>
            </Dialog>

            <Dialog style={{ backgroundColor: colors.border }} visible={visibleDialog}
                onDismiss={() => setVisibleDialog(false)}>
                <Dialog.Title style={{ color: colors.text }}>{strings.Sure}</Dialog.Title>
                <Dialog.Actions style={{ justifyContent: 'space-around' }}>
                    <Button color='#FF4500' onPress={() => logout()}>{strings.Logout}</Button>
                    <Button color='#1E90FF' onPress={() => setVisibleDialog(false)}>{strings.Cancel}</Button>
                </Dialog.Actions>
            </Dialog>
            <Dialog style={{ backgroundColor: colors.card }} visible={visibleDialogName}
                onDismiss={() => setVisibleDialogName(false)}>
                <Dialog.Title style={{ color: colors.text }}>{strings.enterName}</Dialog.Title>
                <TextInput style={{ borderBottomWidth: 2, color: colors.text, borderBottomColor: '#C1C0C0', margin: 20 }}
                    value={changeName}
                    onChangeText={(text) => setChangeName(text)}
                    placeholder={name} placeholderTextColor='#9E9E9E' />
                <Dialog.Actions style={{ justifyContent: 'space-around' }}>
                    <Button color='#FF4500' onPress={() => setVisibleDialogName(false)}>{strings.Cancel}</Button>
                    <Button color='#70db70' onPress={() => upateName(changeName)}>{strings.saveName}</Button>
                </Dialog.Actions>
            </Dialog>

        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    profileView: {
        width: window.width,
        height: window.height / 2.6,
        borderBottomLeftRadius: 120,
        borderBottomRightRadius: 120,
        backgroundColor: '#70db70',
        alignItems: 'center',
        justifyContent: 'center'
    },
    nameView: {
        flexDirection: 'row',
        width: window.width / 2,
        marginLeft: 50,
        marginTop: 20
    },
    name: {
        fontSize: 18, color: '#70db70', fontWeight: 'bold', marginLeft: 20
    },
    nameInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: window.width / 1.4,
        alignSelf: 'center',
        marginTop: 20,
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderBottomColor: '#C1C0C0',
    },
    theme: {
        flexDirection: 'row',
        marginLeft: 50,
        marginTop: 20
    }
})
export default Settings;