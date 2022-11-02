import { TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    visible: boolean;
    onPress: Function;
    children: any;
}

export const DeletableView = ({ visible, onPress, children }: Props) => {
    const { colors } = useTheme();

    return (
        <View>
            {visible && (
                <TouchableWithoutFeedback
                    onPress={() => {
                        if (!visible) {
                            return;
                        }

                        onPress();
                    }}
                >
                    <View
                        style={{
                            zIndex: 1,
                            position: 'absolute',
                            alignSelf: 'flex-end',
                            height: 25,
                            width: 25,
                            alignItems: 'flex-end',
                        }}
                    >
                        <View
                            style={{
                                height: 20,
                                width: 20,
                                borderRadius: 25,
                                alignContent: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: colors.text,
                            }}
                        >
                            <View style={{ width: 10, height: 2, borderWidth: 1, borderColor: colors.text_opposite, backgroundColor: colors.text_opposite }} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )}
            {children}
        </View>
    );
};
