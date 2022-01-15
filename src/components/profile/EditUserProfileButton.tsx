import * as React from 'react';
import { View } from 'react-native';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';

interface Props {
    showEdit: boolean,
    onPress: Function
}

export const EditUserProfileButton = ({ showEdit, onPress }: Props) => {
    return (
        <View>
            {showEdit
                ? <EmbtrButton buttonText='save' size='small' callback={onPress} />
                : <EmbtrButton buttonText='edit profile' size='small' callback={onPress} />
            }
        </View>
    );
}