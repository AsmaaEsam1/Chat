import React, { useLayoutEffect, Fragment } from 'react'
import { View, Text, ImageBackground, StyleSheet } from 'react-native'
import { FAB } from 'react-native-paper'
const RecevierVedioCalling = ({ route, navigation }) => {
    const { params } = route
    const { name, img } = params;

    useLayoutEffect(() => {
        navigation.setOptions({
        })
    }, [navigation])
    return (
        <Fragment>
            {img ? (
                <ImageBackground source={{ uri: img }} style={style.BackgroundImg} resizeMode="cover" imageStyle={{ opacity: 0.5 }}>
                    <View style={[globalStyle.containerCentered]} >
                        <Text style={style.TextName}>{name}</Text>
                        <Text style={style.TextRinning}>Rinning....</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
                        <FAB style={styles.FabVideo} icon='video' />

                        <FAB style={styles.FabMic}
                            icon='microphone'
                        />

                        <FAB style={styles.FabVolumHigh}
                            icon='volume-high'
                        />
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <FAB style={styles.FabEndCalling} icon='phone' />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            ) : (
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    backgroundColor: '#000'
                }}>
                    <Text style={styles.TextName}>{name}</Text>
                    <Text style={styles.TextCalling}>Calling...</Text>
                    <Text style={styles.text}>{name.charAt(0)}</Text>
                    <Text style={styles.TextNameImage}>{name}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
                        <FAB style={styles.FabVideo} icon='video' />

                        <FAB style={styles.FabMic}
                            icon='microphone'
                        />

                        <FAB style={styles.FabVolumHigh}
                            icon='volume-high'
                        />
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <FAB style={styles.FabEndCalling} icon='phone' />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </Fragment>
    )
}

const styles = StyleSheet.create({

    BackgroundImg: {
        flex: 1, width: null, alignSelf: 'stretch', backgroundColor: '#000'
    },
    TextName: {
        color: '#fff', fontWeight: "bold", fontSize: 30, marginBottom: 10
    },
    TextNameImage: {
        backgroundColor: '#000', color: '#fff', justifyContent: 'center'
    },
    TextRinning: {
        color: '#fff', fontSize: 18, marginBottom: 500
    },
    TextCalling: {
        color: '#fff', fontSize: 18, marginBottom: 150
    },
    text: {
        color: '#fff', fontSize: 200, fontWeight: "bold", marginBottom: 100
    },
    thumbnailName: {
        fontSize: 200, color: '#fff', fontWeight: "bold"
    },
    FabEndCalling: {
        backgroundColor: 'rgba(255, 0, 0, 1)', justifyContent: 'center'
    },
    FabStartCalling: {
        backgroundColor: 'rgb(50,160,40)', justifyContent: 'center'
    },
})

export default RecevierVedioCalling;