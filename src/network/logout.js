import firebase from 'react-native-firebase'


const LogOutUser = async () => {
    try {
        return await firebase.auth().signOut()
    } catch (error) {
        return error;
    }
}

export default LogOutUser;