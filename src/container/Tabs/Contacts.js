import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, FlatList } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import moment from 'moment/min/moment-with-locales.min'
import firebase from 'react-native-firebase';
import ShowAllUsers from '../../component/showAllUsers';
import { Menu, Provider } from 'react-native-paper'
import { useTheme } from '@react-navigation/native'
import { strings } from '../../languages/Localization'
const window = Dimensions.get('window')

const Contacts = ({ navigation }) => {
    const { colors } = useTheme()
    const [allUsers, setAllUsers] = useState([]);
    const [visibleMenu, setVisibleMenu] = useState(false)
    const uuid = firebase.auth().currentUser.uid

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
    const openMenu = () => setVisibleMenu(!visibleMenu);
    const closeMenu = () => setVisibleMenu(false);
    const setting = () => {
        navigation.navigate('Settings')
        closeMenu()
    }
    const imgTap = (profileImg, name) => {
        if (!profileImg) {
            navigation.navigate('ShowFullImg', {
                name,
                imgText: name.charAt(0),
            })
        }
        else {
            navigation.navigate('ShowFullImg', {
                name,
                img: profileImg,
            })
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Feather style={{ marginLeft: 20, color: colors.card }} name='more-vertical' size={25} color='#fff'
                    onPress={() => openMenu()}
                />
                <Text style={[{ color: colors.card }, styles.textheader]}>{strings.people}</Text>
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
            <Provider>
                <Menu
                    visible={visibleMenu}
                    onDismiss={closeMenu}
                    contentStyle={{ backgroundColor: colors.background }}
                    style={{}}
                    anchor={{ x: (strings.getLanguage() === 'ar' ? window.width - 30 : 30), y: 30 }}>
                    <Menu.Item onPress={() => { setting() }} title={<Text style={{ color: colors.text }}>{strings.Setting}</Text>} />
                </Menu>
            </Provider>
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

export default Contacts;