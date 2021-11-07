import React, { useState, useEffect } from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { Icon } from 'native-base'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { UpdateUser } from '../network/user'
import Feather from 'react-native-vector-icons/Feather'
import { strings } from '../languages/Localization'
import Spinner from 'react-native-spinkit'
import firebase from 'react-native-firebase'
const window = Dimensions.get('window')
const FullProfileImage = ({ navigation, route }) => {
    const uuid = firebase.auth().currentUser.uid;
    const { params } = route
    const { name, img, imgText } = params
    const { colors } = useTheme()
    const [profileImage, setImageProfile] = useState('')
    const [loading, setLoading] = useState(false)
    useEffect(async () => {
        try {
            //Get current user from Real-time database in firebase
            setLoading(true)
            await firebase.database('https://chat-9c21b-default-rtdb.firebaseio.com/')
                .ref('users')
                .on('value', (dataSnapshot) => {
                    dataSnapshot.forEach((child) => {
                        if (uuid == child.val().uuid) {
                            setImageProfile(child.val().profileImage);
                        }
                    })
                    setLoading(false)
                })
        }
        catch (error) {

            alert(error)
            setLoading(false)
        }
    }, [])
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
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', height: 60, alignItems: 'center', backgroundColor: '#70db70' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    {strings.getLanguage() === 'ar' ?
                        <Icon name="arrow-forward" style={{ color: colors.card, marginLeft: 10 }} /> :
                        <Icon name="arrow-back" style={{ color: colors.card, marginLeft: 10 }} />
                    }
                </TouchableOpacity>
                <Text style={{ color: colors.card, marginLeft: 20, fontSize: 20 }}>{name}</Text>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <TouchableOpacity style={{ alignSelf: 'flex-end', marginRight: 20 }} onPress={() => selectImage()}>
                        <Feather style={{ alignSelf: 'center' }} name='edit-3' size={25} color={colors.card} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Spinner style={{ alignSelf: 'center', marginTop: 30 }} isVisible={loading} size={50} type='Circle' color='#70db70' />

                <Image style={{ width: window.width, height: '60%', alignSelf: 'center' }} resizeMode='contain' source={{ uri: profileImage }} />
            </View>
        </View>
    )
}
export default FullProfileImage;