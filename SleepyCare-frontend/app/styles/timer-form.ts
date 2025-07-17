import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FB',
    flexGrow: 1,
    padding: 24,
    paddingTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3B3B3B',
    marginBottom: 24,
    textAlign: 'right',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
    marginTop: 12,
    textAlign: 'right',
  },
input: {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  borderColor: '#4EB6AC', // טורקיז
  borderWidth: 1,
  padding: 12,
  fontSize: 16,
  marginBottom: 10,
  textAlign: 'right',
},


  durationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginBottom: 24,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#4EB6AC',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2F1',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  backText: {
    fontSize: 16,
    color: '#5C8D89',
    marginLeft: 8,
    fontWeight: '600',
  },
  checkboxRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
  gap: 8, // או marginLeft אם אין תמיכה ב־gap
},
picker: {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  borderColor: '#4EB6AC',
  borderWidth: 1,
  padding: 12,
  marginBottom: 16,
  textAlign: 'right',
},

});
export default styles;