export type DataChild = {
    battery: number
}

export type Data = {
    data: DataChild,
    setData: (d: DataChild) => void,
}