import React from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { Icon } from 'native-base'
import { strings } from '../languages/Localization'
const window = Dimensions.get('window')
const FullImageUsers = ({ navigation, route }) => {
    const { params } = route
    const { name, img, imgText } = params
    const { colors } = useTheme()
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', height: 60, alignItems: 'center', backgroundColor: '#70db70' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    {strings.getLanguage() === 'ar' ?
                        <Icon name="arrow-forward" style={{ color: colors.card, marginLeft: 10 }} /> :
                        <Icon name="arrow-back" style={{ color: colors.card, marginLeft: 10 }} />
                    }
                </TouchableOpacity>
                <Text style={{ color: colors.card, marginLeft: 20, fontSize: 20 }}>{name}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                <Image style={{ width: window.width, height: '60%', alignSelf: 'center' }} resizeMode='contain' source={{ uri: img }} />
            </View>
        </View>
    )
}
export default FullImageUsers;