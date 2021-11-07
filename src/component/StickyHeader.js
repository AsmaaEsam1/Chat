import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Card, CardItem, Left, Body, Thumbnail } from "native-base";

const StickyHeader = ({ name, img, onImgTap }) => {
    return (
        <Card style={styles.cardStyle} transparent>
            <CardItem style={styles.cardItemStyle}>
                <Left>
                    <TouchableOpacity style={[styles.logoContainer]} onPress={onImgTap}>
                        {img ? (
                            <Thumbnail source={{ uri: img }} resizeMode="cover" />
                        ) : (
                            <Text style={styles.thumbnailName}>{name.charAt(0)}</Text>
                        )}
                    </TouchableOpacity>
                    <Body>
                        <Text style={styles.profileName}>{name}</Text>
                    </Body>
                </Left>
            </CardItem>
        </Card>
    );
};
const styles = StyleSheet.create({
    cardStyle: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#95A5A6',
    },
    cardItemStyle: {
        backgroundColor: '#95A5A6',
    },

    logoContainer: {
        height: 60,
        width: 60,
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#fff',
    },
    thumbnailName: { fontSize: 30, color: '#000', fontWeight: "bold" },
    profileName: { fontSize: 20, color: '#000', fontWeight: "bold" },
})
export default StickyHeader;