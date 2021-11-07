import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Thumbnail, View } from "native-base";
import { useTheme } from '@react-navigation/native'
const ShowAllUsers = ({ name, img, onImgTap, onNameTap }) => {
    const { colors } = useTheme()
    return (
        <View style={styles.cardStyle}>
            <TouchableOpacity onPress={onNameTap}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={[{ borderColor: colors.text }, styles.logoContainer]} onPress={onImgTap}>
                        {img ? (
                            <Thumbnail source={{ uri: img }} resizeMode="cover" />
                        ) : (
                            <Text style={[{ color: colors.text }, styles.thumbnailName]}>{name.charAt(0)}</Text>
                        )}
                    </TouchableOpacity>
                    <Text style={[{ color: colors.text }, styles.profileName]} >
                        {name}
                    </Text>
                </View>

            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    cardStyle: {
        borderBottomWidth: 1,
        borderColor: '#BFC9CA',
        margin: 5,
        padding: 5
    },
    logoContainer: {
        height: 60,
        width: 60,
        borderWidth: 1,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    thumbnailName: { fontSize: 30, fontWeight: "bold" },
    profileName: {
        fontSize: 20, fontWeight: "bold", marginLeft: 30, alignSelf: 'center'
    },
})
export default ShowAllUsers;
