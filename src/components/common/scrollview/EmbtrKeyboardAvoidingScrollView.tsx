import { View } from 'react-native';
import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Props {
    children: any;
    header?: any;
    adjustForMenu?: boolean;
}

export const EmbtrKeyboardAvoidingScrollView = ({ children, header, adjustForMenu }: Props) => {
    return (
        <View style={{ flex: 1 }}>
            {header}
            <KeyboardAwareScrollView
                overScrollMode={'always'}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraHeight={adjustForMenu ? -64 : 0}
                extraScrollHeight={adjustForMenu ? -64 : 0}
                keyboardOpeningTime={0}
            >
                {children}
            </KeyboardAwareScrollView>
        </View>
    );
};
