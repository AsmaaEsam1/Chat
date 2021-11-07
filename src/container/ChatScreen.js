import React, { useState, useLayoutEffect, useEffect, useCallback, useRef } from 'react'
import {
    View, Text, FlatList, Dimensions, Platform, PermissionsAndroid,
    TouchableOpacity, StyleSheet
} from 'react-native'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import ChatBox from '../component/ChatBox'
import { senderMsg, recieverMsg } from '../network/messages'
import firebase from 'react-native-firebase';
import { Thumbnail } from 'native-base'
import { AudioUtils } from 'react-native-audio';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment/min/moment-with-locales.min'
import { useTheme } from '@react-navigation/native'
import { strings } from '../languages/Localization'
import RBSheet from "react-native-raw-bottom-sheet";
import BottomSheet from '../component/BottomSheet';
import SendMessage from '../component/SendMessage'
import HeaderLeft from '../component/HeaderLeft';
const window = Dimensions.get('window')

const audioRecorderPlayer = new AudioRecorderPlayer();
const ChatScreen = ({ route, navigation }) => {
    const { colors } = useTheme()
    const { params } = route;
    const language = strings.getLanguage()
    const { name, img, imgText, guestUserId, currentUserId } = params;
    const [msgValue, setMsgValue] = useState('');
    const [messages, setMessages] = useState([]);
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
    const [showsendicon, setShowsendicon] = useState(false)

    const refRBSheet = useRef();
    let num = new Date().getTime();
    const path = AudioUtils.DocumentDirectoryPath + '/test' + num + '.m4a';
    // audioRecorderPlayer.setSubscriptionDuration(0.09);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (

                <View style={{ marginLeft: 10 }} flexDirection="row" >
                    <TouchableOpacity style={{ alignSelf: 'center', marginRight: 10 }}
                        onPress={() => navigation.navigate('Dashboard')}>
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
            ),
            headerRight: () => (
                <View style={{ flexDirection: 'row', marginRight: 20, justifyContent: 'space-between' }} >

                    <TouchableOpacity onPress={() => { voiceCallTap() }}>
                        <Ionicons name="call" size={25} style={{ color: '#70db70' }} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { vedioCallTap() }}>
                        <Ionicons name="videocam" size={25} style={{ marginLeft: 20, color: '#70db70' }} />
                    </TouchableOpacity>
                </View>
            )
        });
    }, [navigation])


    useEffect(() => {
        if (msgValue === '') {
            setShowsendicon(false)
        }
        else {
            setShowsendicon(true)
        }
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
        setShowsendicon(false)
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
        await audioRecorderPlayer.startRecorder(path).catch(err => console.log(err.message));
        audioRecorderPlayer.addRecordBackListener((e) => {
            setRecordSecs(e.currentPosition)
            setRecordTime(audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000)))
        });
        setStartRecord(false)
        //
    }
    const onStopRecord = async () => {
        const result = await audioRecorderPlayer.stopRecorder().catch(err => console.log(err))
        audioRecorderPlayer.removeRecordBackListener()
        setRecordSecs(0)
        setRecordTime('')
        setStartRecord(true)

        const reference = firebase.storage().ref('Voicenote/' + path)
        const task = reference.putFile(result)
        task.then(async () => {
            await reference.getDownloadURL().then(results => {
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
            if (e.currentPosition === e.duration) {
                console.log('finished');
                audioRecorderPlayer.stopPlayer().catch(err => console.log(err.message));
                setStartPlay(true)
                setProgress(false)
            }

            setCurrentPositionSec(e.currentPosition)
            setPlayTime(audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000)))
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
    const handleCamera = useCallback(() => {

        try {
            const options = {
                maxWidth: 400,
                maxHeight: 400,
                quality: 0.4
            }
            refRBSheet.current.close()
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

    const handlePhoto = useCallback(async () => {
        try {
            const options = {
                maxWidth: 300,
                maxHeight: 300,
                quality: 0.3
            }
            refRBSheet.current.close()
            launchImageLibrary(options, (responses) => {
                responses.assets.map(({ uri, fileName }) => {
                    //   setImages(response);
                    let reference = firebase.storage().ref('Photos/' + fileName)
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
                })
            })

        } catch (error) {
            console.log(error)
        }
    })
    const handleFiles = () => {
        refRBSheet.current.close()

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
            <FlatList
                inverted
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return (
                        <View>
                            {item.newDate == 'newDate' ?
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
                        </View>
                    )
                }} />

            {/*Send Message*/}

            <SendMessage
                strings={strings}
                recordTime={recordTime}
                msgValue={msgValue}
                startrecord={startrecord}
                openBottomSheet={() => refRBSheet.current.open()}
                showsendicon={showsendicon}
                onKeyPress={() => setShowsendicon(true)}
                onBlur={() => setShowsendicon(false)}
                handleOnChange={handleOnChange}
                startRecord={startRecord}
                onStopRecord={onStopRecord}
                handleSend={handleSend}
                onSubmitEditing={() => setShowsendicon(false)}
            />

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    container: { backgroundColor: colors.card },
                    draggableIcon: { backgroundColor: colors.text }
                }}>
                <BottomSheet
                    handleCamera={handleCamera}
                    handlePhoto={handlePhoto}
                    handleFiles={handleFiles}
                />
            </RBSheet>
        </View >
    )

};
const styles = StyleSheet.create({
    recorder_container: {
        flex: 1,
        backgroundColor: "#2b608a",
    },
    sendBtnContainer: {
        alignItems: "center",
        justifyContent: "flex-end",
        flexDirection: "row",
        width: "20%"
    },
})
export default ChatScreen;