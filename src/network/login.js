import firebase from "react-native-firebase";

const LoginRequest = async (email, password) => {
    try {
        return await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
        return error
    }

}
export default LoginRequest;