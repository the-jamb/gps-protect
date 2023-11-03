import React, { useEffect, useState } from 'react';
import { useColorScheme, View, StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import RNFS from 'react-native-fs';
import Loading from './common/Loading';
import EmptyRestApiForm from './wrappers/EmptyRestApiForm';
import Wrapper from './wrappers/Wrapper';
import Utils from './utils/utils';
import DeviceInfo from 'react-native-device-info';
import { Data, DataChild } from './types/data';
import ApiRequest from './utils/apiRequest'
import config from '../config';
import Geolocation from 'react-native-geolocation-service';
import { accelerometer, gyroscope, orientation, setUpdateIntervalForType, SensorTypes  } from "react-native-sensors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center'
  },
  horizontal: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20
  }
});

let lastFailed = false;
const utils = new Utils();
const apiRequest = new ApiRequest();

const getApiURL = async (setApiURL: (url: string) => void, setLoadingURL: (loading: boolean) => void, setGotApiURL: (loading: boolean) => void) => {
  try {
    const exists = await RNFS.exists(RNFS.DocumentDirectoryPath + "/api.txt");
    if (exists) {
      const file = await RNFS.readFile(RNFS.DocumentDirectoryPath + "/api.txt");
      setApiURL(file.toString());
      setLoadingURL(false);
      if(utils.isValidUrl(file.toString())){
        setGotApiURL(true);
      }
    } else {
      RNFS.writeFile(RNFS.DocumentDirectoryPath + "/api.txt", '', 'utf8').then(() => { }).catch(() => { }).finally(() => { setLoadingURL(false); });
    }
  } catch (e) {
    setLoadingURL(false);
  }
}

const saveApiURL = (url: string, setGotApiURL: (loading: boolean) => void) => {
  if(!utils.isValidUrl(url)){
    return;
  }

  try {
    RNFS.writeFile(RNFS.DocumentDirectoryPath + "/api.txt", url, 'utf8').then(() => {
      setGotApiURL(true);
    }).catch(() => { 
      return;
     });
  } catch(e){
    return;
  }
}

const intervalLogic = (data: Data, url: string, first?: boolean) => {
  Geolocation.getCurrentPosition(
    position => {
      if(position) {
        let newData: DataChild = {
          battery: Math.floor(DeviceInfo.getBatteryLevelSync() * 100),
          location: position,
          accelerometerState: data.accelerometerState,
          gyroscopeState: data.gyroscopeState
        }

        data.setData({...newData});
        if(JSON.stringify(newData) === JSON.stringify(data.data) && !first && !lastFailed) {
          return;
        }
      
        lastFailed = false;
        apiRequest.sendRequest(url, "POST", newData, config.AUTH, (data) => {
          console.log("Success sending") // TODO: succes communicate logic
        }, (error) => {
          console.log("Failure sending") // TODO: failure communicate logic
          lastFailed = true;
        })
      }
    },
    () => {
      console.log("Failure sending") // TODO: failure communicate logic
      lastFailed = true;
      return
    },
    {
      enableHighAccuracy: true, 
      timeout: 1000, 
      maximumAge: 10000
    }
  )
}

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(useColorScheme() === 'dark');
  const [apiURL, setApiURL] = useState("");
  const [loadingURL, setLoadingURL] = useState(true);
  const [gotApiURL, setGotApiURL] = useState(false);
  const [sliderValue, setSliderValue] = useState(1000); // in miliseconds
  const [intervalId, setIntervalID] = useState<any>();
  const [data, setData] = useState<DataChild>({
    battery: Math.floor(DeviceInfo.getBatteryLevelSync() * 100),
    location: {
      coords: {
        latitude: 0,
        longitude: 0,
        accuracy: 0,
        altitude: 0,
        heading: 0,
        speed: 0,
        altitudeAccuracy: 0
      },
      timestamp: new Date().getTime(),
      mocked: true,
      provider: "passive"
    },
    accelerometerState: {
      x: 0,
      y: 0,
      z: 0
    },
    gyroscopeState: {
      x: 0,
      y: 0,
      z: 0
    }
  })

  const [accelerometerState, setAccelerometerState] = useState({
    x: 0,
    y: 0,
    z: 0
  })

  const [gyroscopeState, setGyroscopeState] = useState({
    x: 0,
    y: 0,
    z: 0
  })

  useEffect(() => {
    getApiURL(setApiURL, setLoadingURL, setGotApiURL);
    setUpdateIntervalForType(SensorTypes.accelerometer, 500)
    setUpdateIntervalForType(SensorTypes.gyroscope, 500)
    accelerometer.subscribe(({ x, y, z }) => {
      setAccelerometerState({
        x, y, z
      })
    });

    gyroscope.subscribe(({ x, y, z }) => {
      setGyroscopeState({
        x, y, z
      })
    });
  }, [])

  if (loadingURL) return (
    <View style={[styles.container, styles.horizontal, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter }]}>
      <Loading text={"Loading API URL"} />
    </View>
  )

  return (
    <View style={{
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
    }}>
      {apiURL === "" || !gotApiURL ? 
      <EmptyRestApiForm apiURL={apiURL} setApiURL={setApiURL} setGotApiURL={setGotApiURL} saveApiURL={saveApiURL} /> : 
      <Wrapper apiURL={apiURL} setApiURL={setApiURL} setGotApiURL={setGotApiURL} saveApiURL={saveApiURL} intervalId={intervalId} setIntervalID={setIntervalID} sliderValue={sliderValue} setSliderValue={setSliderValue} intervalLogic={intervalLogic} data={{
        data,
        setData,
        accelerometerState,
        gyroscopeState
      }} /> }
    </View>
  );
}

export default App;