import { isIosApp } from 'src/util/DeviceUtil';
import { KeyboardAvoidingView, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import React from 'react';

interface Props {
    header: any;
    children: any;
}

export const EmbtrKeyboardAvoidingScrollView = ({ header, children }: Props) => {
    if (isIosApp()) {
        return (
            <KeyboardAvoidingView behavior="position">
                {header}
                <ScrollView
                    bounces={false}
                    contentInsetAdjustmentBehavior="always"
                    overScrollMode="always"
                >
                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }

    return (
        <View>
            {header}
            <ScrollView
                bounces={false}
                contentInsetAdjustmentBehavior="always"
                overScrollMode="always"
            >
                {children}
            </ScrollView>
        </View>
    );
};
