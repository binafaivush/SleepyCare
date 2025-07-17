import { StyleSheet } from "react-native";
import { colors } from "../constants";

const styles = StyleSheet.create({
    container: { 
        flex : 1,
        alignItems : "center",
        justifyContent: "center",
    },
    title: {
       fontSize: 20,
       fontWeight: 'bold',
       marginBottom: 10 
      },
    info: { 
      fontSize: 16, 
      marginBottom: 5 
  },
    error: { 
      color: 'red', 
      fontSize: 16, 
      textAlign: 'center' },
      add: {
        padding: 10,
        margin: 10,
        backgroundColor: colors.appBar,
        borderBlockColor : "black"
      }
  });

  export default styles;