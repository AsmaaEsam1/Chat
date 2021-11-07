import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import moment from 'moment/min/moment-with-locales.min'
import firebase from 'react-native-firebase';
import ShowAllUsers from '../component/showAllUsers';
import { useTheme } from '@react-navigation/native'
import { strings } from '../languages/Localization'
const window = Dimensions.get('window')

const NewChat = ({ navigation }) => {
    const { colors } = useTheme()
    const uuid = firebase.auth().currentUser.uid

    const [allUsers, setAllUsers] = useState([]);
    let currentDate = moment(new Date()).format('ll').toUpperCase()
    useEffect(() => {
        //show all users in Real-time database
        try {
            let users = [];
            firebase.database('https://chat-9c21b-default-rtdb.firebaseio.com/')
                .ref('users')
                .on('value', (dataSnapshot) => {
                    dataSnapshot.forEach((child, i) => {
                        console.log(uuid)
                        console.log(child.val().uuid)
                        if (uuid !== child.val().uuid) {
                            users.push({
                                id: child.val().uuid,
                                name: child.val().name,
                                profileImg: child.val().profileImage,
                            })
                            setAllUsers(users)

                        }
                    })

                })
        } catch (err) {
            console.log(err)
        }

    }, [navigation])

    const nameTap = (profileImg, name, guestUserId) => {
        if (!profileImg) {
            navigation.navigate('ChatScreen', {
                name,
                imgText: name.charAt(0),
                guestUserId,
                currentUserId: uuid
            })
        }
        else {
            navigation.navigate('ChatScreen', {
                name,
                img: profileImg,
                guestUserId,
                currentUserId: uuid
            })
        }
    }

    const imgTap = (profileImg, name) => {
        if (!profileImg) {
            navigation.navigate('FullImageUsers', {
                name,
                imgText: name.charAt(0),
            })
        }
        else {
            navigation.navigate('FullImageUsers', {
                name,
                img: profileImg,
            })
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>

                {strings.getLanguage() === 'ar' ?
                    <Ionicons style={{ marginLeft: 20, color: colors.card }} name='arrow-forward' size={25} color='#fff'
                        onPress={() => navigation.navigate('Dashboard')}
                    /> :
                    <Ionicons style={{ marginLeft: 20, color: colors.card }} name='arrow-back' size={25} color='#fff'
                        onPress={() => navigation.navigate('Dashboard')}
                    />}
                <Text style={[{ color: colors.card }, styles.textheader]}>{strings.NewChat}</Text>
                <AntDesign style={{ marginRight: 20, color: colors.card }} name='search1' size={25} color='#fff'
                    onPress={() => navigation.navigate('SearchScreen')}
                />
            </View>
            <FlatList
                data={allUsers}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (

                    <ShowAllUsers name={item.name} img={item.profileImg}
                        onImgTap={() => imgTap(item.profileImg, item.name)}
                        onNameTap={() => nameTap(item.profileImg, item.name, item.id)}
                    />
                )}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        width: window.width,
        height: 60,
        justifyContent: 'space-between',
        backgroundColor: '#70db70',
        flexDirection: 'row',
        alignItems: 'center'
    },
    textheader: {
        fontSize: 18,
        alignSelf: 'center'
    }
})

export default NewChat;