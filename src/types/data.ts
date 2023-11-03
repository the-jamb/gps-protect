import { GeoPosition } from "react-native-geolocation-service"

export type DataChild = {
    battery: number,
    location: GeoPosition
}

export type Data = {
    data: DataChild,
    setData: (d: DataChild) => void,
}