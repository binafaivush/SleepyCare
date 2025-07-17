import { StyleSheet } from "react-native";
import { colors } from "../constants";

const styles = StyleSheet.create({
    container: { 
        flex : 1,
        // alignItems : "center",
        // justifyContent: "center",
  },
    error: { 
      color: 'red', 
      fontSize: 16, 
      textAlign: 'center' },
    add: {
      padding: 10,
      margin: 10,
      width: 50,
      alignItems: "center",
      backgroundColor: colors.torkis,
      borderBlockColor : "black",
      borderRadius: 100
    },
    addNote: {
      padding: 10,
      margin: 10,
      width: 150,
      alignItems: "center",
      backgroundColor: colors.torkis,
      borderColor : "black",
      borderRadius: 100
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.torkis,
      marginBottom: 8,
      marginRight: 8,
    },
    addIcon: {
      color: 'white',
      fontSize: 28,
      fontWeight: 'bold',
    },
    addNoteText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    empty: {
      color: '#888',
      fontSize: 18,
      textAlign: 'center',
      marginTop: 32,
    },
    card: {
      backgroundColor: '#fafdff',
      borderRadius: 22,
      padding: 12,
      marginVertical: 9,
      marginHorizontal: 16,
      shadowColor: colors.torkis,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
      elevation: 7,
      borderLeftWidth: 6,
      borderLeftColor: colors.torkis,
      borderBottomWidth: 0,
      flexDirection: 'column',
      gap: 8,
    },
    clientName: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.torkis,
      marginBottom: 2,
      letterSpacing: 0.5,
    },
    clientLabel: {
      fontSize: 14,
      color: colors.torkis,
      fontWeight: 'bold',
      marginBottom: 0,
      marginTop: 6,
    },
    clientValue: {
      fontSize: 16,
      color: '#333',
      marginBottom: 2,
      marginLeft: 2,
    },
    noteValue: {
      fontSize: 16,
      color: '#555',
      fontStyle: 'italic',
      marginTop: 2,
    },
  });

  export default styles;