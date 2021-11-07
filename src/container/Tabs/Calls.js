import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, FlatList, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import moment from 'moment/min/moment-with-locales.min'
import firebase from 'react-native-firebase';
import ShowCalls from '../../component/ShowCalls';
import { Menu, Provider } from 'react-native-paper'
import { useTheme } from '@react-navigation/native';
import { strings } from '../../languages/Localization'
const window = Dimensions.get('window')

const Calls = ({ navigation }) => {
    const { colors } = useTheme()
    const [allUsers, setAllUsers] = useState([]);
    const [visibleMenu, setVisibleMenu] = useState(false)
    let currentDate = moment(new Date()).format('ll').toUpperCase()
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
    const openMenu = () => setVisibleMenu(!visibleMenu);
    const closeMenu = () => setVisibleMenu(false);
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
    const voiceCallTap = (profileImg, name) => {
        navigation.navigate('SenderVoiceCalling', { name, img: profileImg })
    }
    const vedioCallTap = (profileImg, name) => {
        navigation.navigate('SenderVoiceCalling', { name, img: profileImg })
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Feather style={{ marginLeft: 20 }} name='more-vertical' size={25} color={colors.card}
                    onPress={() => openMenu()}
                />
                <Text style={[styles.textheader, { color: colors.card }]}>{strings.calls}</Text>
                <AntDesign style={{ marginRight: 20 }} name='search1' size={25} color={colors.card}
                    onPress={() => navigation.navigate('SearchScreen')}
                />
            </View>
            <FlatList
                alwaysBounceVertical={false}
                data={allUsers}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <ShowCalls name={item.name} img={item.profileImg}
                        onImgTap={() => imgTap(item.profileImg, item.name)}
                        voiceCall={() => voiceCallTap(item.profileImg, item.name)}
                        vedioCall={() => vedioCallTap(item.profileImg, item.name)}
                    />
                )}
            />
            <Provider>
                <Menu
                    visible={visibleMenu}
                    onDismiss={closeMenu}
                    contentStyle={{ backgroundColor: colors.background }}
                    style={{}}
                    anchor={{ x: 30, y: 30 }}>
                    <Menu.Item onPress={() => { navigation.navigate('Settings') }} title={<Text style={{ color: colors.text }}>{strings.Setting}</Text>} />
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

export default Calls;