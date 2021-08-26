import React, { useState } from "react";
import { View, Text, Image, ProgressBarAndroid, ProgressBarAndroidBase, Dimensions, StyleSheet } from "react-native";
import firebase from 'react-native-firebase'
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "native-base";
import { useTheme } from '@react-navigation/native'
import { LinearProgress } from 'react-native-elements'
let showIcon = true
const window = Dimensions.get('window')
const ChatBox = ({ userId, msg, img, date, onImgTap, onAudioTap, playTimes, onAudioPause, show, playprogress }) => {
    showIcon = show
    const { colors } = useTheme()
    const uuid = firebase.auth().currentUser.uid;
    let isCurrentUser = userId === uuid ? true : false;
    return (
        <View
            transparent
            style={{
                maxWidth: window.width / 2 + 50,
                alignSelf: isCurrentUser ? "flex-end" : "flex-start",
            }}>
            <View
                style={[
                    styles.chatContainer,
                    isCurrentUser && {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        backgroundColor: '#70db70',
                        marginTop: 10
                    },
                ]}>

                {img ? (
                    <View style={{ flexDirection: 'column' }}>
                        <View>
                            <TouchableOpacity onPress={onImgTap}>
                                <Image
                                    source={{ uri: img }}
                                    resizeMode="cover"
                                    style={{ height: 200, width: window.width / 2 }}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.chatdate, isCurrentUser && { color: '#757474' }]}>
                            {date}
                        </Text>
                    </View>
                ) : (
                    <View flexDirection='row'>
                        {msg ? (
                            <Text
                                style={[styles.chatTxt, isCurrentUser && { color: colors.text }]}>
                                {msg}
                                <Text
                                    style={[styles.chatdate, isCurrentUser && { color: '#757474' }]}>
                                    {date}
                                </Text>
                            </Text>

                        ) : (
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                    <LinearProgress variant={playprogress == false ? 'determinate' : 'indeterminate'} style={{ width: '70%', marginTop: 5 }} value={playTimes} color={colors.text} trackColor='#757474' />
                                    {showIcon ? (<TouchableOpacity onPress={onAudioTap}>
                                        <Icon
                                            name='play-sharp'
                                            resizeMode="cover"
                                            style={{ color: colors.text, alignSelf: 'center', marginTop: 8, marginLeft: 5 }}
                                        />
                                    </TouchableOpacity>) :
                                        (<TouchableOpacity onPress={onAudioPause}>
                                            <Icon
                                                name='pause-sharp'
                                                resizeMode="cover"
                                                style={{ color: colors.text, marginTop: 8, marginLeft: 5 }}
                                            />
                                        </TouchableOpacity>)
                                    }
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: '#000', fontSize: 12, marginLeft: 10 }}>{playTimes}</Text>
                                    <Text style={[styles.chatdate, isCurrentUser && { color: '#757474' }]}>
                                        {date}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>

                )}
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    chatContainer: {
        backgroundColor: '#F8B708',
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20
    },

    chatTxt: {
        color: '#fff',
        fontSize: 16,
        marginVertical: 5,
        fontWeight: "500",
        padding: 5,

    },
    chatdate: {
        color: '#757474',
        fontSize: 11,
        marginVertical: 5,
        fontWeight: "500",
        margin: 10,
        paddingLeft: 30,
        paddingRight: 10,
    },
})

export default ChatBox;