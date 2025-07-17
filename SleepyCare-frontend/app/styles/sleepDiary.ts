
import { StyleSheet } from 'react-native';

const PRIMARY_COLOR = '#4DB6AC'; // צבע טורקיז דומה לתמונה
const LIGHT_GRAY_BACKGROUND = '#F7F8FC';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LIGHT_GRAY_BACKGROUND,
        padding: 20,
    },
    generateButton: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 10,
        paddingVertical: 15,
        paddingLeft:20,
        paddingRight:20,
        alignItems: 'center',
        marginTop: 20,
    },
    generateButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
