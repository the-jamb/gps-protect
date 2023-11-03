import React from 'react';
import { View, Text } from 'react-native';

type Props = {
    item?: any;
    text?: any;
    data?: string | number | boolean;
    dataText: string;
    dataArr?: string[]
}

const returnTextsFromArr = (arr: string[], text?: any) => {
    return arr.map((el: string) => {
        return <Text style={text}> {el} </Text>
    })
}

const Chip = ({ item, text, data, dataText, dataArr }: Props) => {
    return (
        <View style={item}>
            {
                dataArr ? <View>
                    <Text style={text}> {dataText} </Text>
                    {
                        returnTextsFromArr(dataArr, text)
                    }
                </View> : <Text style={text}> {dataText} {data} </Text>
            }
            
        </View>
    )
}

export default Chip;