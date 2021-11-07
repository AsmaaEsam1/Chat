import React, { useEffect } from "react";
import { Text, View, Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import { Thumbnail, Card, CardItem } from "native-base";
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useTheme } from '@react-navigation/native'
const window = Dimensions.get('window')
const ShowUsers = ({ name, img, imgMsg, playTime, date, lastMessages, guseterUserIds, onImgTap, onNameTap }) => {
    const { colors } = useTheme()
    useEffect(() => {
        guseterUserIds
    })
    return (
        < View style={[styles.cardStyle, { backgroundColor: colors.background }]} >

            <TouchableOpacity style={[{ borderColor: colors.text }, styles.logoContainer]} onPress={onImgTap}>
                {img ? (
                    <Thumbnail source={{ uri: img }} resizeMode="cover" />
                ) : (
                    <Text style={[{ color: colors.text }, styles.thumbnailName]}>{name.charAt(0)}</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cardItemStyle} onPress={onNameTap}>
                <CardItem style={[styles.cardItemStyle, { backgroundColor: colors.background }]} bordered={false} >

                    <View style={{ flex: 1 }}>
                        <Text style={[{ color: colors.text }, styles.profileName]} onPress={onNameTap} >
                            {name}
                        </Text>
                        {imgMsg ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome name='photo' size={17} style={{ color: '#95A5A6' }} />
                                <Text style={{ color: '#95A5A6', fontSize: 16, marginLeft: 5 }} >
                                    Photo
                                </Text>
                            </View>
                        ) : (
                            <View style={{ flexDirection: 'row' }}>
                                {lastMessages ? (
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: '#95A5A6', fontSize: 15 }} >
                                            {lastMessages}
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={{ flexDirection: 'row' }}>
                                        <Feather name='mic' size={17} style={{ color: '#95A5A6' }} />
                                        <Text style={{ color: '#95A5A6', fontSize: 16, marginLeft: 5 }} >{playTime}</Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                </CardItem>
            </TouchableOpacity>
            <Text style={{
                color: '#95A5A6', fontSize: 12, alignSelf: 'flex-end', marginRight: 20
            }}>{date}</Text>
        </View>
    );
};
const styles = StyleSheet.create({
    cardStyle: {
        width: window.widthcd,
        height: 80,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        marginHorizontal: 10
    },
    cardItemStyle: {
        flex: 1,
        flexDirection: 'row',
    },

    logoContainer: {
        height: 60,
        width: 60,
        borderWidth: 1,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10
    },
    thumbnailName: {
        fontSize: 25,
        fontWeight: "500"
    },
    profileName: {
        fontSize: 18,
        fontWeight: "bold",
    },

})
export default ShowUsers;
