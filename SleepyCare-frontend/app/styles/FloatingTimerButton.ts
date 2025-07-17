import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    // backgroundColor: '#5C8D89',
    // paddingVertical: 10,
    // paddingHorizontal: 16,
    // borderRadius: 30,
    // elevation: 4,
    zIndex: 100,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
  },
touchable: {
    padding: 10,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
 borderWidth: 1, 
  borderColor: '#4EB6AC', 
    },
  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 8,
    color: 'black', 
   },
});
  export default styles;

