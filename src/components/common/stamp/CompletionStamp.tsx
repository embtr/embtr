import { View, Text, StyleSheet } from 'react-native';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';

const CompletionStamp = () => {
    return (
        <View style={styles.container}>
            <View style={styles.stamp}>
                <Text style={styles.text}>Complete</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    stamp: {
        borderWidth: 2,
        borderColor: 'red', // Customize the color of the stamp
        paddingHorizontal: 5,
        paddingVertical: 5,
        transform: [{ rotate: '-35deg' }], // Rotate the stamp by -45 degrees
        borderRadius: 5,
    },
    text: {
        color: 'red', // Customize the color of the text
        fontFamily: POPPINS_SEMI_BOLD,
        fontSize: 12,
    },
});

export default CompletionStamp;
