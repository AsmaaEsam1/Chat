import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useTheme } from '@react-navigation/native'

const BottomSheet = ({ ref, handlePhoto, handleCamera, handleFiles }) => {
    const { colors } = useTheme()

    return (

        <View style={{ flex: 1, backgroundColor: colors.card }}>
            <TouchableOpacity onPress={() => handlePhoto()}>
                <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-around' }}>
                    <FontAwesome
                        name='photo' color={colors.text} size={30} />
                    < View style={{ width: '75%', borderBottomColor: '#6A6C6C', borderBottomWidth: 1, height: 40 }}>
                        <Text style={{ color: colors.text, fontSize: 18 }}>Photos</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCamera()}>
                <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-around' }}>
                    <FontAwesome
                        name='camera' color={colors.text} size={30} />

                    < View style={{ width: '75%', borderBottomColor: '#6A6C6C', borderBottomWidth: 1, height: 40 }}>
                        <Text style={{ color: colors.text, fontSize: 18 }}>Camera</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFiles()}>
                <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-around' }}>
                    <FontAwesome
                        name='file' color={colors.text} size={30} />
                    < View style={{ width: '75%', borderBottomColor: '#6A6C6C', borderBottomWidth: 1, height: 40 }}>
                        <Text style={{ color: colors.text, fontSize: 18 }}>Files</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>

    )
}

export default BottomSheet