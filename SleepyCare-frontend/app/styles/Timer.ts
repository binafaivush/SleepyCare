

import { Platform, StyleSheet } from 'react-native';
import { commonColor } from "../constants";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:commonColor.WHITE,
    paddingTop: Platform.OS === 'android' ? 50 : 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 64,
    fontWeight: '700',
    color: commonColor.BLACK,
    marginBottom: 60,
  },
  buttonsWrapper: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: commonColor.PRIMARY_GREEN,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
    minWidth: 110,
    justifyContent: 'center',
    shadowColor: commonColor.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stopButton: {
    backgroundColor: '#D9534F',
  },
  resetButton: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: commonColor.WHITE,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  backButton: {
  position: 'absolute',
  top: 40,
  right: 20,
  backgroundColor: commonColor.PRIMARY_GREEN,
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 999,
  zIndex: 10,
  flexDirection: 'row',
  alignItems: 'center',
  shadowColor: commonColor.BLACK,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 3,
},
backButtonText: {
  color: commonColor.WHITE,
  fontSize: 14,
  fontWeight: '600',
  marginLeft: 6,
},

});

export default styles;
