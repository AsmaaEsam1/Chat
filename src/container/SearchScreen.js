import React, { useContext, useState, useEffect } from 'react'
import { View, SafeAreaView, FlatList, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Header, Icon, Input, Item } from 'native-base'
import Ionicons from 'react-native-vector-icons/Ionicons'
import firebase from 'react-native-firebase'
import ShowAllUsers from '../component/showAllUsers'
import Spinner from 'react-native-spinkit'
import { strings } from '../languages/Localization'
import { useTheme } from '@react-navigation/native'
const SearchScreen = ({ navigation }) => {
    const { colors } = useTheme()
    const language = strings.getLanguage()
    const uuid = firebase.auth().currentUser.uid;
    const [loading, setLoading] = useState(false)
    const [getScrollPosition, setScrollPosition] = useState(0);
    const [state, setState] = useState({ data: [] })
    const [data, setData] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        setLoading(true)
        try {

            // Get all users from Real-time database in firebase

            firebase.database('https://chat-9c21b-default-rtdb.firebaseio.com/')
                .ref('users')
                .on('value', (dataSnapshot) => {
                    let users = [];
                    dataSnapshot.forEach((child) => {
                        if (uuid !== child.val().uuid) {

                            users.push({
                                id: child.val().uuid,
                                name: child.val().name,
                                profileImg: child.val().profileImage,
                            })
                        }
                    })
                    setData(users)
                    setState(users)
                    setLoading(false)
                })

        } catch (error) {
            setLoading(false)
            alert(error)
        }

    }, []);

    //Make search in Flatlist

    const searchData = text ? data.filter(item => {
        const itemData = item.name.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
    })
        : data;

    const itemSeparator = () => {
        return (
            <View
                style={{
                    height: 0.5,
                    width: "100%",
                    backgroundColor: "#000",
                }} />
        );

    };
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
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={styles.MainContainer}>
                    <View searchBar rounded style={{
                        backgroundColor: '#70db70', height: 60,
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => { navigation.navigate('Dashboard') }}>
                                {strings.getLanguage() == 'ar' ? <Ionicons style={{ color: colors.card, marginLeft: 10 }}
                                    name='arrow-forward' size={25} color={colors.card}
                                    onPress={() => navigation.navigate('Dashboard')} /> : <Ionicons style={{ color: colors.card, marginLeft: 10 }}
                                        name='arrow-back' size={25} color={colors.card}
                                        onPress={() => navigation.navigate('Dashboard')} />
                                }
                            </TouchableOpacity>
                            <Icon name="search" size={18} style={{ marginLeft: 10, fontSize: 22, color: colors.card }} />
                            <Input style={[{ borderColor: colors.card }, styles.textInput]}
                                onChangeText={text => setText(text)}
                                value={text}
                                underlineColorAndroid="transparent"
                                placeholder={strings.search}
                                placeholderTextColor={colors.card}
                            />
                            <Icon name="people" style={{ fontSize: 22, marginRight: 10, color: colors.card }} />
                        </View>
                    </View>
                    <Spinner style={{ alignSelf: 'center' }} isVisible={loading} size={50} type='Circle' color='#70db70' />
                    <FlatList
                        data={searchData}
                        keyExtractor={(_, index) => index.toString()}
                        ItemSeparatorComponent={itemSeparator}
                        onScroll={(event) => setScrollPosition(event.nativeEvent.contentOffset.y)}

                        renderItem={({ item }) => (
                            <ShowAllUsers name={item.name} img={item.profileImg}
                                onImgTap={() => imgTap(item.profileImg, item.name)}
                                onNameTap={() => nameTap(item.profileImg, item.name, item.id)}
                            />
                        )}
                    />
                </View>
            </View>
        </SafeAreaView>
    )

}


const styles = StyleSheet.create({
    MainContainer: {
        justifyContent: "center",
        flex: 1,
    },

    row: {
        fontSize: 18,
    },

    textInput: {
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        direction: 'inherit',
        textAlign: "center",
        height: 42,
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 1,
        borderRadius: 8,
    },
});
export default SearchScreen