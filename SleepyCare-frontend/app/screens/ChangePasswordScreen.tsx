import React, { useState } from 'react';
import {
    View, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity,
    ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { httpChangePassword } from '../contexts/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton'; // Ensure this path is correct

const ChangePasswordScreen = () => {
    const passImg = require('../../assets/images/passwordImg.jpg');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const [focusedField, setFocusedField] = useState<string | null>(null);

    // ... (All your functions like handleFieldChange, validate, etc. remain the same) ...
    const handleFieldChange = (name: string, value: string, setter: (val: string) => void) => {
        setter(value);
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!currentPassword) newErrors.current = 'Please enter your current password';
        if (!newPassword) newErrors.new = 'Please enter a new password';
        else if (newPassword.length < 6) newErrors.new = 'Password must be at least 6 characters';
        else if (newPassword === currentPassword) newErrors.new = 'New password must be different';
        if (!confirmPassword) newErrors.confirm = 'Please confirm your new password';
        else if (newPassword !== confirmPassword) newErrors.confirm = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getPasswordStrength = (password: string) => {
        if (password.length < 6) return 'Weak';
        if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) return 'Strong';
        return 'Medium';
    };
    
    const handleChangePassword = async () => {
        if (!validate()) return;
    
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token'); 
            if (!token) {
                Alert.alert('Error', 'Authentication token not found.');
                setLoading(false);
                return;
            }
    
            await httpChangePassword(currentPassword, newPassword, token);
    
            Alert.alert('Success', 'Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            console.error(err);
            Alert.alert('Error', err?.response?.data?.message || 'Failed to change password.');
        } finally {
            setLoading(false);
        }
    };

    const renderPasswordInput = (
        label: string, value: string, setter: (val: string) => void, error?: string, 
        show: boolean = false, toggleShow?: () => void, name: string = ''
    ) => {
        const isFocused = focusedField === name;
        return (
            <View style={{ marginBottom: 18 }}>
                <Text style={styles.label}>{label}</Text>
                <View style={[styles.inputWrapper, isFocused && styles.inputFocused, error && styles.inputErrorBorder]}>
                    <TextInput
                        style={styles.input} secureTextEntry={!show} value={value}
                        onFocus={() => setFocusedField(name)} onBlur={() => setFocusedField(null)}
                        onChangeText={(val) => handleFieldChange(name, val, setter)}
                        placeholder="Enter here..." placeholderTextColor="#aaa"
                    />
                    {toggleShow && (
                        <TouchableOpacity onPress={toggleShow} style={styles.icon}>
                            <Ionicons name={show ? 'eye-off' : 'eye'} size={20} color="#555" />
                        </TouchableOpacity>
                    )}
                </View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
        );
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
                {/* ===================== שינוי כאן ===================== */}
                <View style={styles.backButtonContainer}>
                    <BackButton />
                </View>
                {/* ======================================================= */}
                
                <Image source={passImg} style={styles.errorImage} />
                <Text style={styles.title}>Change your Password</Text>

                {/* ... (The rest of your JSX remains the same) ... */}
                {renderPasswordInput('Current Password', currentPassword, setCurrentPassword, errors.current, showCurrent, () => setShowCurrent(!showCurrent), 'current')}
                {renderPasswordInput('New Password', newPassword, setNewPassword, errors.new, showNew, () => setShowNew(!showNew), 'new')}
                {newPassword ? (<Text style={styles.strengthText}>Password strength: {getPasswordStrength(newPassword)}</Text>) : null}
                {renderPasswordInput('Confirm New Password', confirmPassword, setConfirmPassword, errors.confirm, showConfirm, () => setShowConfirm(!showConfirm), 'confirm')}
                <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={loading}>
                    {loading ? (<ActivityIndicator color="#fff" />) : (<Text style={styles.buttonText}>Change Password</Text>)}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ChangePasswordScreen;

// החלף/י את כל בלוק הסטיילים שלך בזה:
const styles = StyleSheet.create({
    // הוספת הסטייל החדש כאן
    backButtonContainer: {
        position: 'absolute',
        top: 20, // אפשר לשנות לפי הצורך
        left: 20,  // אפשר לשנות לפי הצורך
        zIndex: 1, // כדי לוודא שהכפתור תמיד מעל
    },
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#E0F7F7',
        alignItems: 'center', // זה עדיין חשוב לשאר התוכן
    },
    topImage: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#007C91',
    },
    label: {
        fontSize: 15,
        color: '#007C91',
        marginBottom: 6,
        fontWeight: '500',
        alignSelf: 'flex-start',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#8ED1C6',
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        width: '100%',
    },
    inputFocused: {
        borderColor: '#00B7C2',
    },
    inputErrorBorder: {
        borderColor: '#d9534f',
    },
    input: {
        flex: 1,
        height: 44,
        fontSize: 16,
        color: '#111',
    },
    icon: {
        marginLeft: 10,
    },
    errorText: {
        color: '#d9534f',
        fontSize: 13,
        marginTop: 4,
        alignSelf: 'flex-start',
    },
    strengthText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
        fontStyle: 'italic',
        alignSelf: 'flex-start',
    },
    button: {
        backgroundColor: '#00B7C2',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    errorImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
        borderRadius: 100,
    }
});