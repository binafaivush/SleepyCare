import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    margin: 10,
  },
  banner: {
    backgroundColor: '#E0F4F2', // טורקיז בהיר
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#4EB6AC',
  },
  text: {
    color: '#246C68', // טורקיז כהה
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  ackButton: {
    backgroundColor: '#4EB6AC', // כפתור בצבע המותג
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  ackButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
export default styles;