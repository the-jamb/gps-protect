import { GeoPosition } from "react-native-geolocation-service"

export type Accelometer = {
    x: number;
    y: number;
    z: number;
}

export type DataChild = {
    battery: number,
    location: GeoPosition
    accelerometerState: Accelometer
}

export type Data = {
    data: DataChild,
    setData: (d: DataChild) => void,
}