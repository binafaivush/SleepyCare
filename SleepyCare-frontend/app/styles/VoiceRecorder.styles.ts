import { StyleSheet, Platform } from 'react-native';

export const COLORS = {
  breastmilk: '#4EB6AC',
  formula: '#FFD700',
  solid: '#FF7F50',
  white: '#FFFFFF',
  black: '#000000',
  red: '#FF4C4C',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'android' ? 50 : 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.breastmilk,
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 20,
    paddingHorizontal: 36,
    borderRadius: 40,
    marginVertical: 12,
    elevation: 3,
  },
  breastmilk: {
    backgroundColor: COLORS.breastmilk,
  },
  formula: {
    backgroundColor: COLORS.formula,
  },
  solid: {
    backgroundColor: COLORS.solid,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  recordIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.red,
    marginBottom: 16,
  },
});

export default styles;
