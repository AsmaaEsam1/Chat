import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTheme } from '@react-navigation/native'

const SendMessage = ({ strings, showsendicon, onSubmitEditing, onKeyPress, onBlur, recordTime, msgValue, startrecord, openBottomSheet, handleOnChange, startRecord, onStopRecord, handleSend }) => {
    const { colors } = useTheme()

    return (
        <View style={styles.sendMessageContainer}>

            <View style={[{ backgroundColor: colors.card }, styles.inputview]}>
                <TouchableOpacity onPress={() => openBottomSheet()}>

                    <Entypo
                        name="attachment"
                        color='#70db70'
                        size={25}
                        style={{ marginLeft: 10 }}
                    />
                </TouchableOpacity>

                <TextInput
                    placeholder={strings.typeHere}
                    multiline={true}
                    style={[{ color: colors.text }, styles.input]}
                    value={msgValue}
                    placeholderTextColor='#6A6C6C'
                    onChangeText={(text) => handleOnChange(text)}
                    on={() => onSubmitEditing()}
                    onKeyPress={() => onKeyPress()}
                    onBlur={() => onBlur()}
                />
                <View style={{ flex: 1, alignItems: 'center' }}>
                    {showsendicon === false || msgValue === '' ? (
                        <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
                            {startrecord === true ? (

                                <TouchableOpacity onPress={() => startRecord()}>
                                    <MaterialCommunityIcons
                                        name='microphone'
                                        color='#70db70'
                                        size={35} />
                                </TouchableOpacity>

                            ) : (
                                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: colors.text, fontSize: 16, marginLeft: 10 }}>{recordTime}</Text>
                                    <TouchableOpacity onPress={() => onStopRecord()}>
                                        <Ionicons
                                            name="stop-circle-outline"
                                            size={30}
                                            style={{ color: '#70db70' }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}

                        </View>
                    ) : (
                        <TouchableOpacity style={{ width: '100%' }} onPress={() => handleSend()}>
                            <MaterialCommunityIcons
                                name="send-circle"
                                color='#70db70'
                                style={{
                                    alignSelf: 'flex-end', justifyContent: 'flex-end',
                                    transform: (strings.getLanguage() === 'ar' ? [{ rotate: '180deg' }] : [{ rotate: '0deg' }])
                                }}
                                size={40}
                            />
                        </TouchableOpacity>
                    )}
                </View>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    sendMessageContainer: {
        flexDirection: "row",
        marginHorizontal: 10,
        alignItems: 'center',
    },
    inputview: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 20,
        alignItems: 'center',
        margin: 5,
    },
    input: {
        width: '50%',
        borderRadius: 20,
        marginLeft: 10,
        minHeight: 30,
        maxHeight: 250,
    },
})

export default SendMessage;