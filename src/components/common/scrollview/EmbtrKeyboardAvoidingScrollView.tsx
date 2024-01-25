import { View } from 'react-native';
import React from 'react';

interface Props {
    children: any;
    header?: any;
    adjustForMenu?: boolean;
}

export const EmbtrKeyboardAvoidingScrollView = ({ children, header, adjustForMenu }: Props) => {
    return (
        <View style={{ flex: 1 }}>
            {header}
            {children}
        </View>
    );
};
