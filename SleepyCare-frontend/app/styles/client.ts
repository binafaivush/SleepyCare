import { StyleSheet } from "react-native";
import { colors } from "../constants";

const styles = StyleSheet.create({
    container: { 
      padding: 20,
      margin: 10,
      backgroundColor: '#fff',
      borderRadius: 10,
      elevation: 5 ,
  },
    title: {
       fontSize: 20,
       fontWeight: 'bold',
       marginBottom: 10 ,
       color: colors.pink
      },
    info: { 
      fontSize: 16, 
      marginBottom: 5 ,
  },
    error: { 
      color: 'red', 
      fontSize: 16, 
      textAlign: 'center' 
    },
    viewPressable : {
        flexDirection: "row",
        gap: 15
      }
  });

  export default styles;