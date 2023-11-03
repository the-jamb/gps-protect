import React from "react";
import { SafeAreaView, StyleSheet, TextInput, Button, View, Dimensions } from 'react-native';
import { openSettings } from 'react-native-permissions';
import Utils from "../utils/utils";

type Props = {
    apiURL: string,
    setApiURL: (url: string) => void,
    setGotApiURL: (saved: boolean) => void
    saveApiURL: (url: string, setGotApiURL: (loading: boolean) => void) => void
}

const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    container: {
        justifyContent: "space-between",
        height: Dimensions.get('window').height - 20
    }
});

const utils = new Utils();

const EmptyRestApiForm = ({apiURL, setApiURL, setGotApiURL, saveApiURL}: Props) => {

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setApiURL}
                value={apiURL}
                placeholder="Api URL"
            />
            <View style={{margin:10}}>
                <Button title={"Allow geolocation in background"} onPress={() => {
                    openSettings();
                }} />
                <Button title={"Save API URL"} disabled={!utils.isValidUrl(apiURL)} onPress={() => saveApiURL(apiURL, setGotApiURL)} />
            </View>
        </SafeAreaView>
      );
}

export default EmptyRestApiForm;