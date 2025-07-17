import { StyleSheet } from "react-native";
import { colors } from "../constants";

const styles = StyleSheet.create({
    container: { 
        padding: 20,
        alignItems: "center",
        backgroundColor:colors.background, 
    },
    title: { 
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10 
    },
    input: { 
        width: 220, 
        padding: 10, 
        borderWidth: 1, 
        borderColor: "gray", 
        borderRadius: 5, 
        marginBottom: 10 
    },
    button: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: { 
        color: "white",
        fontSize: 16 
    },
    errorText:{
        color: "red"
    }
});

export default styles;