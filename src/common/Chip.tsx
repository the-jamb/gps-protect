import React from 'react';
import { View, Text } from 'react-native';

type Props = {
    item?: any;
    text?: any;
    data?: string | number | boolean | null;
    dataText: string;
    dataArr?: Array<string | undefined>;
}

const returnTextsFromArr = (arr: Array<string | undefined>, text?: any) => {
    return arr.map((el: string | undefined) => {
        return <Text key={el} style={text}> {el} </Text>
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