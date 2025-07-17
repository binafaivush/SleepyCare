import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInputProps,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { httpUpdatePersonalDetails } from '../contexts/clientService';
import { RootState } from '../store/store';
import BackButton from '../components/BackButton';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../contexts/userService';
import { login } from '../store/userSlice';

// FocusableInput component without the BackButton
const FocusableInput = (
  props: TextInputProps & { label: string; error?: string }
) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        {...props}
        style={[
          styles.input,
          { borderColor: isFocused ? '#0097a7' : props.error ? 'red' : '#b2dfdb' },
          props.style,
        ]}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus && props.onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur && props.onBlur(e);
        }}
        placeholderTextColor="#a0a0a0"
      />
      {props.error && <Text style={styles.errorText}>{props.error}</Text>}
    </View>
  );
};


export default function EditPersonalScreen() {
  const currentUser = useSelector((state: RootState) => state.user);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('name');
        const storedPhone = await AsyncStorage.getItem('phone');
        const storedEmail = await AsyncStorage.getItem('email');
        if (storedName) setName(storedName);
        if (storedPhone) setPhone(storedPhone);
        if (storedEmail) setEmail(storedEmail);
      } catch (e) {
        console.log('Failed to load user data from AsyncStorage', e);
      }
    };
    loadUserData();
  }, []);

  const handleSave = async () => {
    const newErrors: typeof errors = {};

    if (!name) newErrors.name = 'Name is required';
    if (!phone) newErrors.phone = 'Phone number is required';
    else if (!/^\d{9,10}$/.test(phone)) newErrors.phone = 'Invalid phone number';

    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email address';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      console.log(currentUser.id);
      let response=await updateUser(currentUser.id, {
        full_name: name,
        phone_number: phone,
        email: email
      });
      // console.log(response.data.role);
      // dispatch(login({
      //           id: response.data._id,
      //           name: response.data.full_name,
      //           token: response.token,
      //           role: response.data.role,
      //         }));
      Alert.alert('Success', 'Details saved successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An unexpected error occurred');
    }

  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.backButtonContainer}>
          <BackButton />
        </View>

        <Image
          source={require('../../assets/images/profile.jpg')}
          style={{
            width: 180,
            height: 180,
            alignSelf: 'center',
            marginBottom: 30,
            borderRadius: 100,
          }}
        />
        <View>
          <Text style={styles.title}>Edit Personal Details</Text>
<Text></Text>
          <FocusableInput
            label="Full Name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            placeholder="Enter name"
            error={errors.name}
          />
          <FocusableInput
            label="Phone"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (errors.phone) setErrors({ ...errors, phone: undefined });
            }}
            placeholder="Enter phone"
            keyboardType="phone-pad"
            error={errors.phone}
          />
          <FocusableInput
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            placeholder="example@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#e0f7fa',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0097a7',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#004d40',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#0097a7',
    paddingVertical: 14,
    borderRadius: 50,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
  // ============= הסטייל החדש נמצא כאן, בפנים! =============
  backButtonContainer: {
    position: 'absolute', // מאפשר מיקום חופשי ביחס לאבא
    top: 40,             // מרחק מלמעלה (אפשר לשנות לפי הצורך)
    left: 20,            // מרחק משמאל (אפשר לשנות לפי הצורך)
    zIndex: 1,           // מוודא שהכפתור יהיה מעל אלמנטים אחרים
  },
  // =========================================================
});