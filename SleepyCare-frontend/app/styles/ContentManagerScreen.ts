import { StyleSheet } from "react-native";
// import { colors } from "../constants";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
  },
  optionButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginHorizontal: 8,
    width: 100,
  },
  optionLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  fileName: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  label: {
    marginTop: 20,
    fontWeight: '600',
  },
  pickerWrapper: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 8,
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: '#2c3e50',
    padding: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '100%',
    padding: 10,
    marginBottom: 10,
  },
});

export default styles;