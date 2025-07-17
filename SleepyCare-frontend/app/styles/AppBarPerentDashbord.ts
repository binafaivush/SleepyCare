import { StyleSheet } from "react-native"
import { colors } from "../constants";

    const styles = StyleSheet.create({
        container:{
            justifyContent: 'space-around',
            padding: 10,
            // backgroundColor: colors.appBar,
        },
        profile: {
            backgroundColor: colors.pink,
            borderRadius: 50,
        },
    })

    export default styles;