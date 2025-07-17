import { StyleSheet } from "react-native";
import { colors } from "../constants";

const styles = StyleSheet.create({
    container: { 
      flex: 1,
      // alignItems: "center",
      // justifyContent: "center",
    },
    error: { 
      color: 'red', 
      fontSize: 16, 
      textAlign: 'center',
    },
    buttons: {
      padding: 10,
      margin: 10,
      backgroundColor: colors.appBar,
      borderBlockColor: "black",
      borderRadius: 5,
    },
    viewPressable : {
      flexDirection: "row"
    },
    addButtons:{
      borderRadius: 100,
      padding: 10,
      backgroundColor: colors.torkis,
      margin: 10,
      width: 50,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      borderColor: "black",
      borderWidth: 1,
    },
    plus:{
      fontWeight: "bold",
      color: "white",
    }
  });

  export default styles;