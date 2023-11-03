import { GeoPosition } from "react-native-geolocation-service"

export type Axis = {
    x: number;
    y: number;
    z: number;
}

export type DataChild = {
    battery: number,
    location: GeoPosition
    accelerometerState: Axis
    gyroscopeState: Axis
}

export type Data = {
    data: DataChild,
    setData: (d: DataChild) => void,
    gyroscopeState: Axis,
    accelerometerState: Axis
}