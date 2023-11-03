import { GeoPosition } from "react-native-geolocation-service"

export type Axis = {
    x: number;
    y: number;
    z: number;
}

export type OrientationProps = {
    qx: number; 
    qy: number; 
    qz: number;
    qw: number; 
    pitch: number;
    roll: number;
    yaw: number;
}

export type Battery = {
    level: number;
    isCharging: boolean
}

export type DataChild = {
    battery: Battery;
    location: GeoPosition;
    accelerometerState: Axis;
    gyroscopeState: Axis;
    orientation: OrientationProps;
}

export type Data = {
    data: DataChild;
    setData: (d: DataChild) => void;
    gyroscopeState: Axis;
    accelerometerState: Axis;
    orientationState: OrientationProps
}