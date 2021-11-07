import firebase from 'react-native-firebase'

export const AddUser = async (name, email, uid, profileImage) => {
    try {
        return await firebase.database('https://chat-9c21b-default-rtdb.firebaseio.com/').ref('users/' + uid)
            .set({
                name: name,
                email: email,
                uuid: uid,
                profileImage: profileImage,
                lastMessage: ''
            })
    } catch (error) {
        return error
    }
};

export const UpdateUser = async (uuid, imgSource) => {
    try {
        return await firebase.database('https://chat-9c21b-default-rtdb.firebaseio.com/').ref('users/' + uuid)
            .update({
                profileImage: imgSource
            })
    } catch (error) {
        return error
    }
}
export const UpdateUserName = async (uuid, userName) => {
    try {
        return await firebase.database('https://chat-9c21b-default-rtdb.firebaseio.com/').ref('users/' + uuid)
            .update({
                name: userName
            })
    } catch (error) {
        return error
    }
}
