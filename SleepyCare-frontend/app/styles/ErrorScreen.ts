import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
    },
    blankContainer: {
      flex: 1,
      backgroundColor: '#ffffff',
    },  
    iconWrapper: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      // color: '#333333',
      marginBottom: 8,
      textAlign: 'center',
    },
    message: {
      fontSize: 20,
      color: '#777777',
      textAlign: 'center',
      marginBottom: 24,
    },
    button: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
      elevation: 2,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    errorImage: { 
      width: 200,   
      // height: 80,
      resizeMode: 'contain', 
      marginBottom:50,
    }
  });
  
  export default styles;
