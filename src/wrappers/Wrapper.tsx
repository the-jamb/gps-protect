import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, Dimensions, View, ScrollView } from 'react-native';
import Loading from "../common/Loading";
import RNFS from 'react-native-fs';
import Slider from '@react-native-community/slider';
import { Data } from "../types/data";
import Chip from "../common/Chip";

type Props = {
    apiURL: string,
    intervalId: NodeJS.Timeout,
    sliderValue: number,
    intervalLogic: (data: Data, url: string, first?: boolean) => void
    setApiURL: (url: string) => void,
    setSliderValue: (value: number) => void,
    setGotApiURL: (saved: boolean) => void
    setIntervalID: (id: NodeJS.Timeout) => void
    saveApiURL: (url: string, setGotApiURL: (loading: boolean) => void) => void,
    data: Data
}

const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    container: {
        height: Dimensions.get('window').height - 20
    },
    containerLoading: {
        textAlign: 'center',
        height: Dimensions.get('window').height - 20
      },
      horizontal: {
        justifyContent: 'center',
        padding: 20,
        height: Dimensions.get('window').height - 20
      },
      dataContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "space-between",
        alignItems: 'stretch' // if you want to fill rows left to right
      },
      item: {
        width: '40%', // is 50% of container width
        backgroundColor: "#DBD3D8",
        height: 120,
        margin: 10,
        alignContent: "center",
        justifyContent: "center",
        textAlign: "center"
      },
      text: {
        color: '#000',
        alignSelf: "center",
        verticalAlign: "middle"
      }
});

const getSlider = async (setSliderValue: (ms: number) => void, setLoadingSliderValue: (loading: boolean) => void, intervalId: NodeJS.Timeout, setIntervalID: (id: NodeJS.Timeout) => void, intervalLogic: (d: Data, url: string) => void, data: Data, apiURL: string) => {
    try {
      const exists = await RNFS.exists(RNFS.DocumentDirectoryPath + "/slider.txt");
      if (exists) {
        const file = await RNFS.readFile(RNFS.DocumentDirectoryPath + "/slider.txt");
        if(!Number(file.toString()) || Number(file.toString()) < 1000 || Number(file.toString()) > 60000) {
            RNFS.writeFile(RNFS.DocumentDirectoryPath + "/slider.txt", '1000', 'utf8').then(() => { }).catch(() => { }).finally(() => { });
            setSliderValue(1000);
            setLoadingSliderValue(false);

            if(intervalId){
                clearInterval(intervalId);
            }

            setIntervalID(setInterval(() => {
                intervalLogic(data, apiURL)
            }, 1000))
            return;
        }

        setSliderValue(Number(file.toString()));
        setLoadingSliderValue(false);

        if(intervalId){
            clearInterval(intervalId);
        }

        setIntervalID(setInterval(() => {
            intervalLogic(data, apiURL)
        }, Number(file.toString())))
      } else {
        RNFS.writeFile(RNFS.DocumentDirectoryPath + "/slider.txt", '1000', 'utf8').then(() => { }).catch(() => { }).finally(() => { });
        setSliderValue(1000);
        setLoadingSliderValue(false);

        if(intervalId){
            clearInterval(intervalId);
        }

        setIntervalID(setInterval(() => {
            intervalLogic(data, apiURL)
        }, 1000))
      }
    } catch (e) {
        setLoadingSliderValue(false);
        setSliderValue(1000);

        if(intervalId){
            clearInterval(intervalId);
        }

        setIntervalID(setInterval(() => {
            intervalLogic(data, apiURL)
        }, 1000))
    }
}

const saveSlider = (value: number) => {
    if(!value || value < 1000 || value > 60000) {
        return;
    }
  
    try {
      RNFS.writeFile(RNFS.DocumentDirectoryPath + "/slider.txt", value.toString(), 'utf8').then(() => { }).catch(() => { });
    } catch(e){ }
}

const Wrapper = ({apiURL, setApiURL, setGotApiURL, saveApiURL, intervalId, setIntervalID, sliderValue, setSliderValue, intervalLogic, data}: Props) => {
    const [loadingSliderValue, setLoadingSliderValue] = useState(true);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        getSlider(setSliderValue, setLoadingSliderValue, intervalId, setIntervalID, intervalLogic, data, apiURL);
        intervalLogic(data, apiURL, true);
    }, [])

    useEffect(() => {
        if(completed) {
            setCompleted(false);
            saveSlider(sliderValue);
            if(intervalId){
                clearInterval(intervalId);
            }

            setIntervalID(setInterval(() => {
                intervalLogic(data, apiURL);
            }, sliderValue));
        }
    }, [completed, sliderValue])

    if(loadingSliderValue) {
        return (
            <View style={[styles.containerLoading, styles.horizontal]}>
                <Loading text={"Loading slider value"} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={(data) => {
                    setApiURL(data);
                    saveApiURL(data, setGotApiURL);
                }}
                value={apiURL}
                placeholder="Api URL"
            />
            <View style={{ padding: 20}}>
                <Slider
                    value={sliderValue}
                    minimumValue={1000}
                    maximumValue={60000}
                    onSlidingComplete={(value) => {
                        setSliderValue(value);
                        setCompleted(true);
                    }}
                />  

                <TextInput
                    style={styles.input}
                    onChangeText={(data) => {
                        setSliderValue(Number(data));
                        if(Number(data) && Number(data) >= 1000 && Number(data) <= 60000){
                            setCompleted(true);
                        }
                    }}
                    keyboardType='numeric'
                    value={Math.floor(sliderValue).toString()}
                />
            </View>
            <View style={styles.dataContainer}>
                <Chip item={styles.item} text={styles.text} data={data.data.battery + "%"} dataText={"Battery level:"} />
                <Chip item={styles.item} text={styles.text} dataArr={["Lat: " + data.data.location.coords.latitude, "Long: " + data.data.location.coords.longitude]} dataText={"Coordinates:"} />
                <Chip item={styles.item} text={styles.text} data={data.data.location.coords.altitude} dataText={"Altitude:"} />
                <Chip item={styles.item} text={styles.text} data={data.data.location.coords.speed} dataText={"Speed:"} />
                <Chip item={styles.item} text={styles.text} dataArr={["X: " + data.data.accelerometerState.x, "Y: " + data.data.accelerometerState.y, "Z: " + data.data.accelerometerState.z]} dataText={"Accelerometer:"} />
            </View>
        </ScrollView>
    )
}

export default Wrapper;