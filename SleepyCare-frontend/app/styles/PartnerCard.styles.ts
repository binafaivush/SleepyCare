import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 10, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  deleteText: {
    color: '#f44336',
    fontWeight: '600',
    fontSize: 14,
  },
  roleBox: {
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  pickerWrapper: {
    backgroundColor: '#F1F5F4',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 60,
    width: '100%',
    color: '#333',
  },
});
