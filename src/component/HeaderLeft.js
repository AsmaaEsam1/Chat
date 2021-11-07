import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Thumbnail } from 'native-base'

const HeaderLeft = ({ onBack, img, name, language, colors }) => {
    return (
        <View style={{ marginLeft: 10 }} flexDirection="row" >
            <TouchableOpacity style={{ alignSelf: 'center' }}
                onPress={() => onBack()}>
                {language == 'ar' ?
                    <Ionicons size={22} name="arrow-forward" style={{ color: colors.text }} />
                    :
                    <Ionicons size={22} name="arrow-back" style={{ color: colors.text }} />
                }
            </TouchableOpacity>
            <View style={[{ borderColor: colors.text }, styles.logoContainer]} >
                {img ? (
                    <Thumbnail style={{ width: 40, height: 40 }} source={{ uri: img }} resizeMode="cover" />
                ) : (
                    <Text style={[{ color: colors.text }, styles.thumbnailName]}>{name.charAt(0)}</Text>
                )}
            </View>
            <Text style={{ fontSize: 20, color: colors.text, fontWeight: "500", marginLeft: 10 }} >{name}</Text>
        </View>
    )
}

styles = StyleSheet.create({
    thumbnailName: { fontSize: 20, fontWeight: "500" },
    logoContainer: {
        height: 40,
        width: 40,
        borderWidth: 1,
        borderRadius: 20,
        marginLeft: 10,
        alignItems: "center",
        justifyContent: "center",
    },
})
export default HeaderLeft;