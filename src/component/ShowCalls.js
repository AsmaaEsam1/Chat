import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Thumbnail, Icon, Button } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from '@react-navigation/native'
const ShowCalls = ({ name, img, onImgTap, voiceCall, vedioCall }) => {
    const { colors } = useTheme()

    return (
        <View style={[styles.cardStyle, { backgroundColor: colors.background }]}>
            <TouchableOpacity>
                <View style={{
                    flex: 1,
                    padding: 10,
                    backgroundColor: colors.background, flexDirection: 'row',
                }}>
                    <TouchableOpacity style={[{ borderColor: colors.text }, styles.logoContainer]} onPress={onImgTap}>
                        {img ? (
                            <Thumbnail source={{ uri: img }} resizeMode="cover" />
                        ) : (
                            <Text style={[{ color: colors.text }, styles.thumbnailName]}>{name.charAt(0)}</Text>
                        )}
                    </TouchableOpacity>
                    <Text style={[{ color: colors.text }, styles.profileName]}>
                        {name}
                    </Text>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <TouchableOpacity onPress={voiceCall} style={{ color: '#70db70', right: 10 }}>
                            <Button transparent>
                                <Icon
                                    name="call"
                                    style={{ color: '#70db70' }}
                                    type="MaterialIcons"
                                />
                            </Button>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={vedioCall}>
                            <Button transparent >
                                <Icon
                                    name="videocam"
                                    size={30}
                                    style={{ color: '#70db70' }}
                                    type="MaterialIcons"
                                />
                            </Button>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    cardStyle: {
        borderBottomWidth: 1,
        borderColor: '#BFC9CA',
        marginLeft: 10,
        marginRight: 10,
    },

    logoContainer: {
        height: 60,
        width: 60,
        borderWidth: 2,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",

    },
    thumbnailName: {
        fontSize: 30,
        fontWeight: "bold"
    },
    profileName: {
        fontSize: 18,
        fontWeight: "bold",
        width: "50%",
        marginLeft: 10,
        alignSelf: 'center'
    },
})
export default ShowCalls;
