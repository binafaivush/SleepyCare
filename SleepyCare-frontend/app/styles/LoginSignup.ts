// ../styles/LoginSignup.ts
import { StyleSheet } from 'react-native';
import { COLORS } from '../constants'; 

export default StyleSheet.create({
  safeArea: { // הוספנו Safe Area
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: { 
    flex: 1,
  },
  scrollViewContainer: { 
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  container: { 
    alignItems: 'center',
    width: '100%',
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 10, 
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 35,
    textAlign: 'center',
  },
  error: { 
    color: COLORS.error,
    fontSize: 13,
    marginBottom: 10, 
    width: '100%', 
    textAlign: 'left', 
  },
  toggleText: { 
    marginTop: 8,
    color: COLORS.primary,
    fontWeight: '500',
    fontSize: 15,
    textAlign: 'center',
  },
  forgotPasswordText: { 
    marginTop: 30,
    color: COLORS.primary,
    fontWeight: '500',
    fontSize: 14,
    alignSelf: 'flex-end', 
    marginBottom: 8,
  },
  inputContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 5,
    width: '100%',
    height: 55,
    borderWidth: 1.5,
    borderColor: COLORS.inputBackground, 
  },
  inputIcon: {
    marginRight: 10,
  },
  input: { 
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  inputFocused: {
    borderColor: COLORS.inputBorderFocused,
  },
  inputWithError: { 
    borderColor: COLORS.error,
  },
  showPasswordButton: { 
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
  },

  checkboxContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    justifyContent: 'flex-start', 
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 15,
    color: COLORS.textPrimary,
  },

  submitButton: { 
    backgroundColor: COLORS.primary,
    borderRadius: 28, 
    width: '100%',
    height: 55,
    justifyContent: 'center',
    marginTop: 15,
  },
  submitButtonContent: {
    height: 55,
  }, 
});