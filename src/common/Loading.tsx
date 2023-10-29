import React from 'react';
import { ActivityIndicator, Text } from 'react-native';

type Props = {
    text?: string
}

const Loading = ({ text = "Loading" }: Props) => {
    return (
        <>
            <ActivityIndicator size={"large"} color={"#00ff00"} />
            <Text style={ { textAlign: "center", color: "#000", lineHeight: 60 } }> { text } </ Text>
        </>
    )
}

export default Loading;