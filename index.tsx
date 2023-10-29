import { AppRegistry, PermissionsAndroid } from "react-native";
import App from "./src/App";
import config from "./config";

let requestLocationPermission;
(requestLocationPermission = async function(){
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Geolocation Permission',
                message: 'Can we access your location?',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );

        if (granted === 'granted') {
        return true;
        } else {
        return false;
        }
    } catch (err) {
        return false;
    }
})();

AppRegistry.registerComponent(config.REGISTER_ROOT, () => App);