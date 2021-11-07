import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, FlatList, StyleSheet } from 'react-native';
import { Fab, Icon } from 'native-base'
import Feather from 'react-native-vector-icons/Feather'
import { Menu, Provider } from 'react-native-paper'
import AntDesign from 'react-native-vector-icons/AntDesign'
import firebase from 'react-native-firebase';
import moment from 'moment/min/moment-with-locales.min'
import Spinner from 'react-native-spinkit'
import ShowUsers from '../../component/ShowUsers';
import { useTheme } from '@react-navigation/native';
import { strings } from '../../languages/Localization'
const window = Dimensions.get('window')

const Chats = ({ navigation }) => {
    const language = strings.getLanguage();
    const { colors } = useTheme()
    const uuid = firebase.auth().currentUser.uid;
    const [lastMessage, setLastMessage] = useState([]);
    const [visible, setVisible] = useState(false)
    const [visibleMenu, setVisibleMenu] = useState(false)
    let currentDate = moment(new Date()).format('ll').toUpperCase()
    useEffect(() => {

        //show all users in Real-time database
        try {
            let users = [];
            let lastMsg = [];
            setVisible(true)
            firebase.database('https://chat-9c21b-default-rtdb.firebaseio.com/')
                .ref('users')
                .on('value', (dataSnapshot) => {

                    dataSnapshot.forEach((child, i) => {
                        if (uuid !== child.val().uuid) {
                            users.push({
                                id: child.val().uuid,
                                name: child.val().name,
                                profileImg: child.val().profileImage,
                            })
                        }
                        firebase.database('https://chat-9c21b-default-rtdb.firebaseio.com/')
                            .ref('messages')
                            .child(uuid)
                            .child(child.val().uuid)
                            .orderByChild('createdAt')
                            .on('value', (dataSnapshot) => {
                                dataSnapshot.forEach((childs) => {

                                    let newmessage = {
                                        id: child.val().uuid,
                                        name: child.val().name,
                                        profileImg: child.val().profileImage,
                                        reciever: childs.val().message.reciever,
                                        lastMssg: childs.val().message.msg,
                                        img: childs.val().message.img,
                                        audio: childs.val().message.audio,
                                        audioDuration: childs.val().message.audioDuration,
                                        createdAt: childs.val().message.createdAt,
                                        dates: childs.val().message.date,
                                    }
                                    lastMsg = lastMsg.filter(function (obj) {
                                        return obj.name != newmessage.name
                                    })
                                    lastMsg.push(newmessage)
                                    setLastMessage(lastMsg)
                                    setVisible(false)
                                })
                            })
                    })
                    setVisible(false)
                })

        } catch (error) {
            setVisible(false)
            alert(error)
        }

    }, [navigation])
    const openMenu = () => setVisibleMenu(!visibleMenu);
    const closeMenu = () => setVisibleMenu(false);
    // * ON IMAGE TAP

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
    const setting = () => {
        navigation.navigate('Settings')
        closeMenu()
    }
    // * ON NAME TAP 

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
    return (
        <View style={styles.container}>
            <View >
                <View style={styles.header}>
                    <Feather style={{ marginLeft: 20, color: colors.card }} name='more-vertical' size={25} color='#fff'
                        onPress={() => openMenu()}
                    />
                    <Text style={[{ color: colors.card }, styles.textheader]}>{strings.chats}</Text>
                    <AntDesign style={{ marginRight: 20, color: colors.card }} name='search1' size={25} color='#fff'
                        onPress={() => navigation.navigate('SearchScreen')}
                    />
                </View>

            </View>

            <Spinner style={{ justifyContent: 'center', alignSelf: 'center' }} isVisible={visible} size={100} type='Circle' color='#70db70' />
            <FlatList
                data={lastMessage}
                keyExtractor={(_, index) => index.toString()}

                renderItem={({ item }) => (
                    <ShowUsers
                        name={item.name} img={item.profileImg}
                        onImgTap={() => imgTap(item.profileImg, item.name)}
                        onNameTap={() => nameTap(item.profileImg, item.name, item.id)}
                        imgMsg={item.img}
                        playTime={item.audioDuration}
                        lastMessages={item.lastMssg}
                        date={item.dates == currentDate ? date = item.createdAt : date = item.dates}
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
            <Fab style={[{ backgroundColor: colors.background }, styles.FabChat]} position="bottomRight" onPress={() => navigation.navigate('NewChat')}>
                <Icon style={{ color: '#70db70' }} name="chat" type="MaterialIcons" />
            </Fab>
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
    },
    FabChat: {
        margin: 10
    },
})

export default Chats;