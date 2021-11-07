import React from "react";
import { ImageBackground, View, Text, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from '@react-navigation/native'
import Spinner from "react-native-spinkit";

export default ({ img, name, visible, onImgTap, onEditImgTap }) => {
    const { colors } = useTheme()
    return (
        <View style={styles.container}>
            <View style={[{ borderColor: colors.card }, styles.imgContainer]}>
                <Spinner style={{ alignSelf: 'center', marginTop: 30 }} isVisible={visible} size={50} type='Circle' color='#70db70' />

                <TouchableOpacity onPress={onImgTap} activeOpacity={0.8}>
                    {img ? (
                        <ImageBackground source={{ uri: img }} style={styles.img} imageStyle={styles.img} resizeMode="cover" />
                    ) : (
                        <View
                            style={styles.img}>
                            <Text style={[{ color: colors.card }, styles.name]}>{name.charAt(0)}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <View style={[{ backgroundColor: colors.card }, styles.editImgContainer]}>
                    <FontAwesome5
                        name="user-edit"
                        size={20}
                        onPress={onEditImgTap}
                        color='#70db70'
                    />
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 2,
        paddingVertical: 10,
        marginTop: 20
    },
    imgContainer: {
        height: 154,
        width: 154,
        borderRadius: 77,
        borderWidth: 2,
    },
    img: {
        height: 150,
        width: 150,
        borderRadius: 75,
        backgroundColor: '#70db70',
        alignItems: 'center',
        justifyContent: 'center'

    },
    editImgContainer: {
        height: 40,
        width: 40,
        borderRadius: 20,
        position: "absolute",
        right: 10,
        bottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    name: {
        fontSize: 80,
        fontWeight: "bold",
    },
    welcome: {
        color: '#000',
        fontSize: 24,
        fontWeight: "bold",
        padding: 10,
    },
})