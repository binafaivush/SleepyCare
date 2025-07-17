import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { verifyResetToken, resetPassword } from '../contexts/resetPasswordService';
import { COLORS } from '../constants';

export default function ResetPasswordScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ newPassword: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const url = await Linking.getInitialURL();
        if (!url) return setTokenValid(false);
        const parsed = new URL(url);
        const tokenParam = parsed.searchParams.get('token');
        if (!tokenParam) return setTokenValid(false);
        setToken(tokenParam);
        const isValid = await verifyResetToken(tokenParam);
        setTokenValid(isValid);
      } catch (err) {
        console.error('Token check failed:', err);
        setTokenValid(false);
      }
    };
    checkToken();
  }, []);

  // ניווט כאשר הטוקן לא תקין
  useEffect(() => {
    if (tokenValid === false) {
      const timeout = setTimeout(() => {
        router.replace('/screens/LoginSignup');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [tokenValid]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  const validateAndSubmit = async () => {
    const newErrors = { newPassword: '', confirmPassword: '' };
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{7,15}$/;

    if (!newPassword) newErrors.newPassword = 'Password is required.';
    else if (!passwordRegex.test(newPassword))
      newErrors.newPassword = 'Must include letters, numbers, special char (7–15 chars).';

    if (!confirmPassword) newErrors.confirmPassword = 'Confirm your password.';
    else if (newPassword !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.';

    setErrors(newErrors);
    if (newErrors.newPassword || newErrors.confirmPassword) return;

    setIsLoading(true);
    try {
      if (token) {
        await resetPassword(token, newPassword);
        showToast('success', 'Password reset successfully!');
        setTimeout(() => router.replace('/screens/LoginSignup'), 3000);
      }
    } catch (err) {
      showToast('error', 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10 }}>Checking token...</Text>
      </View>
    );
  }

  if (tokenValid === false) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: COLORS.error, fontSize: 16, textAlign: 'center' }}>
          Invalid or expired token.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Create your new password</Text>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock-outline" size={20} color={COLORS.icon} />
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            if (errors.newPassword) setErrors(e => ({ ...e, newPassword: '' }));
          }}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialCommunityIcons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.icon} />
        </TouchableOpacity>
      </View>
      {errors.newPassword ? <Text style={styles.error}>{errors.newPassword}</Text> : null}

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock-outline" size={20} color={COLORS.icon} />
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword) setErrors(e => ({ ...e, confirmPassword: '' }));
          }}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <MaterialCommunityIcons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.icon} />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword ? <Text style={styles.error}>{errors.confirmPassword}</Text> : null}

      <TouchableOpacity onPress={validateAndSubmit} disabled={isLoading} style={[styles.button, isLoading && { backgroundColor: '#aaa' }]}>
        <Text style={styles.buttonText}>{isLoading ? 'Resetting...' : 'Reset Password'}</Text>
      </TouchableOpacity>

      {toast.message !== '' && (
        <View style={[styles.toast, toast.type === 'error' ? styles.toastError : styles.toastSuccess]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: COLORS.textPrimary,
    paddingHorizontal: 10,
  },
  error: {
    color: COLORS.error,
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  toast: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 10,
  },
  toastSuccess: {
    backgroundColor: COLORS.primary,
  },
  toastError: {
    backgroundColor: COLORS.error,
  },
  toastText: {
    color: COLORS.white,
    textAlign: 'center',
  },
});
