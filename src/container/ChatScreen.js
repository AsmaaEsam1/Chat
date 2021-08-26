import React, { useState, Fragment, useLayoutEffect, useEffect, useCallback } from 'react'
import {
    View, Text, SafeAreaView, FlatList, KeyboardAvoidingView, TouchableWithoutFeedback, Dimensions,
    Platform, Keyboard, PermissionsAndroid, TextInput, StyleSheet
} from 'react-native'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import ChatBox from '../component/ChatBox'
import { senderMsg, recieverMsg } from '../network/messages'
import firebase from 'react-native-firebase';
import { Button, Icon, Thumbnail } from 'native-base'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AudioUtils } from 'react-native-audio';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment/min/moment-with-locales.min'
import { useTheme } from '@react-navigation/native'
import { strings } from '../languages/Localization'
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker'
const window = Dimensions.get('window')

let audioRecorderPlayer = new AudioRecorderPlayer();
const ChatScreen = ({ route, navigation }) => {
    const { colors } = useTheme()
    const { params } = route;
    const language = strings.getLanguage()
    const { name, img, imgText, guestUserId, currentUserId } = params;
    const [msgValue, setMsgValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [response, setResponse] = useState(null)
    const [recordTime, setRecordTime] = useState('')
    const [recordSecs, setRecordSecs] = useState(0)
    const [currentPositionSec, setCurrentPositionSec] = useState(0)
    const [currentDurationSec, setCurrentDurationSec] = useState(0)
    const [playTime, setPlayTime] = useState('00:00')
    const [duration, setDuration] = useState('00:00')
    const [progress, setProgress] = useState(false);
    const [active, setActive] = useState([])
    const [startrecord, setStartRecord] = useState(true)
    const [startplay, setStartPlay] = useState(true)
    const [newDate, setNewDate] = useState('')
    const [multiDate, setMultiDate] = useState('')
    //const [image, setImage] = useState('')
    const [images, setImages] = useState([]);

    let num = new Date().getTime();
    const path = AudioUtils.DocumentDirectoryPath + '/test' + num + '.m4a';
    audioRecorderPlayer.setSubscriptionDuration(0.09);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{ marginLeft: 10 }} flexDirection="row" >
                    <TouchableOpacity onPress={() => { navigation.navigate('Dashboard') }}>
                        <Button transparent>
                            {language == 'ar' ?
                                <Ionicons size={22} name="arrow-forward" style={{ color: colors.text }} />
                                :
                                <Ionicons size={22} name="arrow-back" style={{ color: colors.text }} />
                            }
                        </Button>
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
            ),
            headerRight: () => (
                <View flexDirection="row" >

                    <TouchableOpacity onPress={() => { voiceCallTap() }}>
                        <Button transparent>
                            <Icon type="MaterialIcons" name="call" size={50} style={{ color: '#70db70' }} />
                        </Button>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { vedioCallTap() }}>
                        <Button transparent >
                            <Icon type="MaterialIcons" name="videocam" style={{ right: 10, color: '#70db70' }} />
                        </Button>
                    </TouchableOpacity>
                </View>
            )
        });
    }, [navigation])


    useEffect(() => {
        try {
            //connected to real-time database and sent messages
            firebase.database('https://chat-9c21b-default-rtdb.firebaseio.com/')
                .ref('messages')
                .child(currentUserId)
                .child(guestUserId)
                .orderByChild('createdAt')
                .on('value', (dataSnapshot) => {
                    let msgs = [];
                    dataSnapshot.forEach((child) => {
                        msgs.push({
                            sendBy: child.val().message.sender,
                            recievedBy: child.val().message.reciever,
                            msg: child.val().message.msg,
                            newDate: child.val().message.newDate,
                            img: child.val().message.img,
                            audio: child.val().message.audio,
                            audioDuration: child.val().message.audioDuration,
                            createdAt: child.val().message.createdAt,
                            dates: child.val().message.date,
                        });
                        setMultiDate(child.val().message.date)
                    });
                    setMessages(msgs.reverse());

                    if (msgs.map(item => item.dates)[0] == moment(new Date()).format('ll').toUpperCase()) {
                        setNewDate('')
                    }
                    else {
                        setNewDate('newDate')
                    }

                });

        } catch (error) {
            alert(error)
        }
    }, [])

    //send and recevied messages bettween different users 
    const handleSend = () => {
        setMsgValue('')
        setNewDate('')

        if (msgValue) {
            senderMsg(msgValue, newDate, currentUserId, guestUserId, '', '', '')
                .then(() => { })
                .catch((err) => alert(err))

            // * guest user
            recieverMsg(msgValue, newDate, currentUserId, guestUserId, '', '', '')
                .then(() => { })
                .catch((err) => alert(err))
        }

    }
    // recording voice and send to real time database
    const startRecord = async () => {
        //check permission in android External Storage
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Permissions for write access',
                        message: 'Give permission to your storage to write a file',
                        buttonPositive: 'ok',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('You can use the storage');
                } else {
                    console.log('permission denied');
                    return;
                }
            } catch (err) {
                console.warn(err);
                return;
            }
        }
        //check permission in android Record Audio

        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    {
                        title: 'Permissions for write access',
                        message: 'Give permission to your storage to write a file',
                        buttonPositive: 'ok',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('You can use the camera');
                } else {
                    console.log('permission denied');
                    return;
                }
            } catch (err) {
                console.warn(err);
                return;
            }
        }
        const uri = await audioRecorderPlayer.startRecorder(path).catch(err => console.log(err.message));
        audioRecorderPlayer.addRecordBackListener((e) => {
            setRecordSecs(e.current_position)
            setRecordTime(audioRecorderPlayer.mmss(Math.floor(e.current_position / 1000)))
        });
        console.log(`uri: ${uri}`);
        setStartRecord(false)
    }
    const onStopRecord = async () => {
        setNewDate('')
        const result = await audioRecorderPlayer.stopRecorder().catch(err => console.log(err.message));
        audioRecorderPlayer.removeRecordBackListener();
        setRecordSecs(0)
        setRecordTime('')
        setStartRecord(true)
        const reference = firebase.storage().ref('Voicenote/' + path)
        const task = reference.putFile(result).then(() => {
            console.log('Image uploaded to the bucket!');
            reference.getDownloadURL().then(results => {
                senderMsg(msgValue, newDate, currentUserId, guestUserId, '', results, recordTime)
                    .then(() => { })
                    .catch((err) => alert(err));

                // * guest user
                recieverMsg(msgValue, newDate, currentUserId, guestUserId, '', results, recordTime)
                    .then(() => { })
                    .catch((err) => alert(err));
            })
        })

    }

    const onStartPlay = async (audioPath, item) => {
        console.log('onStartPlay');
        setActive(item)
        setStartPlay(false)
        setProgress(true)
        const msg = await audioRecorderPlayer.startPlayer(audioPath).catch(err => console.log(err));
        audioRecorderPlayer.setVolume(1.0);
        console.log(msg);
        audioRecorderPlayer.addPlayBackListener((e) => {
            if (e.current_position === e.duration) {
                console.log('finished');
                audioRecorderPlayer.stopPlayer().catch(err => console.log(err.message));
                setStartPlay(true)
                setProgress(false)
            }

            setCurrentPositionSec(e.current_position)
            setPlayTime(audioRecorderPlayer.mmss(Math.floor(e.current_position / 1000)))
            setCurrentDurationSec(e.duration)
            setDuration(audioRecorderPlayer.mmss(Math.floor(e.duration / 1000)))
        });
    };

    const onPausePlay = async (e) => {
        setStartPlay(true)
        setProgress(false)
        await audioRecorderPlayer.pausePlayer().catch(err => console.log(err));
    }
    //get uri of image and send or recevie img in real-time database
    const handleCamera = useCallback((type, options) => {
        try {
            launchCamera(options, (responses) => {
                responses.assets.map(({ uri, fileName }) => {
                    let reference = firebase.storage().ref('Photos/' + fileName)
                    let task = reference.putFile(uri)
                    task.then(() => {
                        console.log('Image uploaded to the bucket!');
                        reference.getDownloadURL().then(result => {

                            senderMsg(msgValue, newDate, currentUserId, guestUserId, result, '')
                                .then(() => { })
                                .catch((err) => alert(err));

                            // * guest user

                            recieverMsg(msgValue, newDate, currentUserId, guestUserId, result, '')
                                .then(() => { })
                                .catch((err) => alert(err));
                        })
                        num++;
                    }).catch((e) => console.log('uploading image error => ', e))

                })
            })
        } catch (error) {
            console.log(error)
        }
    })

    const handlePhoto = async () => {
        try {
            const response = await MultipleImagePicker.openPicker({
                selectedAssets: images,
                isExportThumbnail: true,
                maxVideo: 1,
                usedCameraButton: false,
            });
            //   setImages(response);
            let reference = await firebase.storage().ref('Photos/' + response)
            let task = reference.putFile(uri)
            task.then(async () => {
                console.log('Image uploaded to the bucket!');
                await reference.getDownloadURL().then(result => {
                    senderMsg(msgValue, newDate, currentUserId, guestUserId, result, '', '')
                        .then(() => { })
                        .catch((err) => alert(err));

                    // * guest user

                    recieverMsg(msgValue, newDate, currentUserId, guestUserId, result, '', '')
                        .then(() => { })
                        .catch((err) => alert(err));
                })
            })

        } catch (error) {
            console.log(error)
        }
    }

    const handleOnChange = (text) => {
        setMsgValue(text);
    }

    // * On img Tap
    const imgTap = (chatImg) => {
        navigation.navigate('FullImages', { name, img: chatImg })
    }
    // On start Calling Tap
    const voiceCallTap = () => {
        navigation.navigate('SenderVoiceCalling', { name, img })
    }
    const vedioCallTap = () => {
        navigation.navigate('SenderVoiceCalling', { name, img })
    }
    return (

        <View style={{ flex: 1 }}>

            <View style={{ flex: 1 }}>

                <FlatList
                    inverted
                    data={messages}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) => {

                        return (
                            <View>
                                {item.newDate != '' ?
                                    <Text style={{ color: '#BFC9CA', alignSelf: 'center' }}>
                                        {item.dates}
                                    </Text> : null
                                }
                                <ChatBox
                                    msg={item.msg}
                                    userId={item.sendBy}
                                    date={item.createdAt}
                                    img={item.img}
                                    onImgTap={() => imgTap(item.img)}
                                    onAudioTap={() => onStartPlay(item.audio, item)}
                                    onAudioPause={() => onPausePlay()}
                                    playTimes={active == item ?
                                        playTimes = playTime :
                                        playTimes = item.audioDuration}

                                    show={active == item ?
                                        show = startplay : show = true
                                    }
                                    playprogress={
                                        active == item ? playprogress = progress : playprogress = false
                                    }
                                />
                            </View>)
                    }
                    } />

                {/*Send Message*/}

                <View style={styles.sendMessageContainer}>
                    <TextInput
                        placeholder={strings.typeHere}
                        numberOfLines={10}
                        style={[{ color: colors.text }, styles.input]}
                        value={msgValue}
                        onChangeText={(text) => handleOnChange(text)} />

                    <View style={styles.sendBtnContainer}>
                        <Text style={{ color: colors.text, marginRight: 10 }}>{recordTime}</Text>
                        {startrecord ? (<TouchableOpacity onPress={() => startRecord()}>
                            <MaterialCommunityIcons
                                name='microphone'
                                color='#70db70'
                                size={35} />
                        </TouchableOpacity>
                        ) : (<TouchableOpacity onPress={() => onStopRecord()}>
                            <Icon
                                name="stop-circle-outline"
                                style={{ color: '#70db70' }} fontSize={35} />
                        </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity onPress={() => handleCamera()}>
                        <MaterialCommunityIcons
                            name="camera"
                            color='#70db70'
                            size={30} />

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePhoto()}>
                        <FontAwesome
                            name="photo"
                            color='#70db70'
                            size={25}
                            style={{ marginLeft: 5, marginRight: 5 }}
                        />

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleSend()}>
                        <MaterialCommunityIcons
                            name="send-circle"
                            color='#70db70'
                            style={{ transform: (strings.getLanguage() === 'ar' ? [{ rotate: '180deg' }] : [{ rotate: '0deg' }]) }}
                            size={35} />
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )

};
const styles = StyleSheet.create({
    sendMessageContainer: {
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        width: window.width,
        height: 50,
        borderRadius: 20,
        marginLeft: 5,
        marginRight: 5
    },
    input: {
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        width: "55%",
    },
    recorder_container: {
        flex: 1,
        backgroundColor: "#2b608a",
    },
    sendBtnContainer: {
        alignItems: "center",
        justifyContent: "flex-end",
        flexDirection: "row",
    },

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
export default ChatScreen;