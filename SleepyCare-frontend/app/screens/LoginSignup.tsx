import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import appliedStyles from '../styles/LoginSignup';
import { login, signUp } from '../store/userSlice';
import { useDispatch } from 'react-redux';
import { FormData, AuthResponse } from '../types/auth.types';
import { authenticationService } from '../contexts/authenticationService';
import Toast from 'react-native-toast-message';
import { Button as PaperButton } from 'react-native-paper';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { isAxiosError } from 'axios';
import { COLORS } from '../constants';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isCounselor, setIsCounselor] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [fullNameFocused, setFullNameFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [specializationFocused, setSpecializationFocused] = useState(false);
  const [experienceYearsFocused, setExperienceYearsFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false); // חדש

  const { control, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    mode: 'onBlur',
  });
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      let response: AuthResponse;

      if (isLogin) {
        response = await authenticationService.login(data);
        dispatch(login({ id: response.user._id, name: response.user.full_name, token: response.token, role: response.user.role }));
        Toast.show({ type: 'success', text1: 'Login Successful', text2: `Welcome back, ${response.user.full_name}! 👋` });
        setTimeout(() => {
          if (response.user.role === 'parent') router.push('/screens/dashbord/ParentDashboard');
          else if (response.user.role === 'counselor') router.push('/screens/dashbord/sleepConsultant');
          else if (response.user.role === 'admin') router.push('./AdminDashboard');
        }, 500);

      } else {
        // data.role = isCounselor ? 'counselor' : 'parent';
        // response = await authenticationService.register(data);
        data.role = isCounselor ? 'counselor' : 'parent';
      

        response = await authenticationService.register(data);

        dispatch(signUp({ id: response.user._id, name: response.user.full_name, token: response.token, role: response.user.role }));
        Toast.show({ type: 'success', text1: 'Signup Successful!', text2: `Welcome, ${response.user.full_name}! Redirecting...` });
        setTimeout(() => {
          if (response.user.role === 'parent') router.push('/screens/dashbord/ParentDashboard');
          else if (response.user.role === 'counselor') router.push('/screens/dashbord/sleepConsultant');
          else if (response.user.role === 'admin') router.push('./AdminDashboard');
        }, 500);
      }
    } catch (error) {
      console.error('Error during request:', error);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (isAxiosError(error)) {
        if (error.response?.data?.message) errorMessage = error.response.data.message;
        else if (error.message) errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      Toast.show({ type: 'error', text1: 'Error', text2: errorMessage, visibilityTime: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{7,15}$/;
  const passwordValue = watch('password');

  return (
    <SafeAreaView style={appliedStyles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={appliedStyles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={appliedStyles.scrollViewContainer}>
          <View style={appliedStyles.container}>
            <Text style={appliedStyles.header}>{isLogin ? 'Welcome Back!' : 'Create Account'}</Text>
            <Text style={appliedStyles.subtitle}>
              {isLogin ? 'Sign in to continue' : "Let's get you started!"}
            </Text>

            {!isLogin && (
              <>
                <View style={[
                  appliedStyles.inputContainer,
                  fullNameFocused && appliedStyles.inputFocused,
                  errors.full_name && appliedStyles.inputWithError
                ]}>
                  <MaterialCommunityIcon name="account-outline" size={22} color={COLORS.icon} style={appliedStyles.inputIcon} />
                  <Controller
                    control={control}
                    name="full_name"
                    rules={{ required: 'Full Name is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={appliedStyles.input}
                        placeholder="Full Name"
                        placeholderTextColor={COLORS.textSecondary}
                        value={value}
                        onChangeText={onChange}
                        onBlur={() => { onBlur(); setFullNameFocused(false); }}
                        onFocus={() => setFullNameFocused(true)}
                      />
                    )}
                  />
                </View>
                {errors.full_name && <Text style={appliedStyles.error}>{errors.full_name.message}</Text>}

                {/* 👇 שדה טלפון חדש */}
                <View style={[
                  appliedStyles.inputContainer,
                  phoneFocused && appliedStyles.inputFocused,
                  errors.phone && appliedStyles.inputWithError
                ]}>
                  <MaterialCommunityIcon name="phone-outline" size={22} color={COLORS.icon} style={appliedStyles.inputIcon} />
                  <Controller
                    control={control}
                    name="phone"
                    rules={{
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{9,15}$/,
                        message: 'Phone number must be 9-15 digits',
                      }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={appliedStyles.input}
                        placeholder="Phone Number"
                        placeholderTextColor={COLORS.textSecondary}
                        value={value}
                        onChangeText={onChange}
                        onBlur={() => { onBlur(); setPhoneFocused(false); }}
                        onFocus={() => setPhoneFocused(true)}
                        keyboardType="phone-pad"
                      />
                    )}
                  />
                </View>
                {errors.phone && <Text style={appliedStyles.error}>{errors.phone.message}</Text>}
                {/* ☝️ שדה טלפון */}
              </>
            )}

            {/**/}
            <View style={[
              appliedStyles.inputContainer,
              emailFocused && appliedStyles.inputFocused,
              errors.email && appliedStyles.inputWithError
            ]}>
              <MaterialCommunityIcon name="email-outline" size={22} color={COLORS.icon} style={appliedStyles.inputIcon} />
              <Controller
                control={control}
                name="email"
                rules={{ required: 'Email is required', pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email address' } }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={appliedStyles.input}
                    placeholder="Email Address"
                    placeholderTextColor={COLORS.textSecondary}
                    value={value}
                    onChangeText={onChange}
                    onBlur={() => { onBlur(); setEmailFocused(false); }}
                    onFocus={() => setEmailFocused(true)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
            </View>
            {errors.email && <Text style={appliedStyles.error}>{errors.email.message}</Text>}

            <View style={[
              appliedStyles.inputContainer,
              passwordFocused && appliedStyles.inputFocused,
              errors.password && appliedStyles.inputWithError
            ]}>
              <MaterialCommunityIcon name="lock-outline" size={22} color={COLORS.icon} style={appliedStyles.inputIcon} />
              <Controller
                control={control}
                name="password"
                rules={{
                  required: 'Password is required',
                  pattern: { value: passwordRegex, message: 'Password must include letters, numbers, and a special character (7-15 characters).' }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={appliedStyles.input}
                    placeholder="Password"
                    placeholderTextColor={COLORS.textSecondary}
                    value={value}
                    onChangeText={onChange}
                    onBlur={() => { onBlur(); setPasswordFocused(false); }}
                    onFocus={() => setPasswordFocused(true)}
                    secureTextEntry={!showPassword}
                  />
                )}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={appliedStyles.showPasswordButton}>
                <MaterialCommunityIcon
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color={COLORS.icon}
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={appliedStyles.error}>{errors.password.message}</Text>}

            {!isLogin && (
              <>
                <View style={[
                  appliedStyles.inputContainer,
                  confirmPasswordFocused && appliedStyles.inputFocused,
                  errors.confirmPassword && appliedStyles.inputWithError
                ]}>
                  <MaterialCommunityIcon name="lock-check-outline" size={22} color={COLORS.icon} style={appliedStyles.inputIcon} />
                  <Controller
                    control={control}
                    name="confirmPassword"
                    rules={{
                      required: 'Confirm Password is required',
                      validate: (value) => value === passwordValue || 'The passwords do not match',
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={appliedStyles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor={COLORS.textSecondary}
                        value={value}
                        onChangeText={onChange}
                        onBlur={() => { onBlur(); setConfirmPasswordFocused(false); }}
                        onFocus={() => setConfirmPasswordFocused(true)}
                        secureTextEntry={!showPassword}
                      />
                    )}
                  />
                </View>
                {errors.confirmPassword && <Text style={appliedStyles.error}>{errors.confirmPassword.message}</Text>}
              </>
            )}

            {!isLogin && (
              <View style={appliedStyles.checkboxContainer}>
                <Switch
                  value={isCounselor}
                  onValueChange={setIsCounselor}
                  trackColor={{ false: "#CFD8DC", true: COLORS.primary }}
                  thumbColor={isCounselor ? COLORS.primary : "#f4f3f4"}
                  ios_backgroundColor="#CFD8DC"
                />
                <Text style={appliedStyles.checkboxLabel}>Are you a Counselor?</Text>
              </View>
            )}

            {!isLogin && isCounselor && (
              <>
                <View style={[
                  appliedStyles.inputContainer,
                  specializationFocused && appliedStyles.inputFocused,
                  errors.specialization && appliedStyles.inputWithError
                ]}>
                  <MaterialCommunityIcon name="star-outline" size={22} color={COLORS.icon} style={appliedStyles.inputIcon} />
                  <Controller
                    control={control}
                    name="specialization"
                    rules={{ required: 'Specialization is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput style={appliedStyles.input} placeholder="Specialization" placeholderTextColor={COLORS.textSecondary} value={value} onChangeText={onChange} onBlur={() => { onBlur(); setSpecializationFocused(false); }} onFocus={() => setSpecializationFocused(true)} />
                    )}
                  />
                </View>
                {errors.specialization && <Text style={appliedStyles.error}>{errors.specialization.message}</Text>}

                <View style={[
                  appliedStyles.inputContainer,
                  experienceYearsFocused && appliedStyles.inputFocused,
                  errors.experienceYears && appliedStyles.inputWithError
                ]}>
                  <MaterialCommunityIcon name="briefcase-clock-outline" size={22} color={COLORS.icon} style={appliedStyles.inputIcon} />
                  <Controller
                    control={control}
                    name="experienceYears"
                    rules={{ required: 'Years of experience is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput style={appliedStyles.input} placeholder="Years of Experience" placeholderTextColor={COLORS.textSecondary} value={value ? String(value) : ''} onChangeText={onChange} keyboardType="numeric" onBlur={() => { onBlur(); setExperienceYearsFocused(false); }} onFocus={() => setExperienceYearsFocused(true)} />
                    )}
                  />
                </View>
                {errors.experienceYears && <Text style={appliedStyles.error}>{errors.experienceYears.message}</Text>}
              </>
            )}

            <PaperButton
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              style={appliedStyles.submitButton}
              labelStyle={{ color: COLORS.white, fontSize: 17, fontWeight: 'bold' }}
              contentStyle={appliedStyles.submitButtonContent}
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? '' : (isLogin ? 'Login' : 'Sign Up')}
            </PaperButton>

            {isLogin && (
              <TouchableOpacity onPress={() => router.push('/screens/ForgotPassword')}>
                <Text style={appliedStyles.forgotPasswordText}>Forgot your password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={appliedStyles.toggleText}>
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
};

export default LoginSignup;
