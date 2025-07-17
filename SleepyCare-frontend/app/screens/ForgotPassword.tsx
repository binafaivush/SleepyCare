import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

import { COLORS, url } from '../constants';
import BackButton from '../components/BackButton';

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const validateEmail = () => {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      setEmailError('Email address cannot be empty.');
      return false;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleForgotPassword = async () => {
    if (!validateEmail()) return;

    try {
      await axios.post(`${url}auth/forgot-password`, { email: email.trim() });
      setModalVisible(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      setModalVisible(true); 
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <BackButton />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.title}>Forgot Your Password?</Text>
        <Text style={styles.subtitle}>
          No problem! Just enter your email address and we'll send you a reset link.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, !!emailError && styles.inputError]}
            placeholder="Email Address"
            placeholderTextColor={COLORS.textSecondary}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleForgotPassword}
        >
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* מודל אישור */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              If this email exists, a reset link was sent to your inbox.
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                router.push('/screens/LoginSignup');
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  headerContainer: { paddingHorizontal: 15, paddingTop: 10 },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 12
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24
  },
  inputContainer: { marginBottom: 24 },
  input: {
    height: 50,
    backgroundColor: COLORS.inputBackground,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.textPrimary
  },
  inputError: { borderColor: COLORS.error },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginTop: 6,
    paddingLeft: 4
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50
  },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16
  },
  modalButton: {
    backgroundColor:  COLORS.primary,
    borderRadius: 10,
    padding: 10,
    elevation: 2
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default ForgotPassword;
