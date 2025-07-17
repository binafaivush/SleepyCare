import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DeleteAccountButton from '../components/DeleteAccountButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/userSlice';
import styles from '../styles/PersonalDetailsEditScreen';
import ChooseChildModal from './SelectChild';
const PersonalDetailsEditScreen: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
     const [modalVisible, setModalVisible] = useState(false); 
    const full_name = useSelector((state: RootState) => state.user.name) || 'Dvory Weiss';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* <View style={styles.headerContainer}>
                     <Text style={styles.headerTitle}>Edit Profile</Text>
                 </View> */}
                <View style={styles.profileInfoContainer}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={require('../../assets/images/profile.jpg')}
                            style={styles.profileImage}
                        />
                        <TouchableOpacity style={styles.editIconContainer}>
                            <Icon name="pencil" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.profileName}>{full_name}</Text>
                </View>
                <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => setModalVisible(true)} // פותח את המודל
                    activeOpacity={0.7}>
                    {/* רקע עם אייקון */}
                    <View style={styles.optionIconBackground}>
                        <Icon name='account-edit-outline' size={24} color="#FFFFFF" />
                    </View>
                    {/* טקסט */}
                    <Text style={styles.optionText}>Select Child</Text>

                    {/* חץ ימין */}
                    <Icon name="chevron-right" size={24} style={{ fontWeight: 'bold' }} />
                </TouchableOpacity>

                {/* הצגת הפופאפ */}
                <ChooseChildModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                />
                <TouchableOpacity style={styles.optionItem}
                    onPress={() => router.push('/screens/ChildDetailsEditScreen')}
                    activeOpacity={0.7}>
                        <View style={styles.optionIconBackground}>
                        <Icon name='account-edit-outline' size={24} color="#FFFFFF" />
                    </View>
                    <Text style={styles.optionText}>Selected child profile</Text>
                    <Icon name="chevron-right" size={24} style={{ fontWeight: 'bold' }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => router.push('/screens/EditProfile')}
                    activeOpacity={0.7}>
                    <View style={styles.optionIconBackground}>
                        <Icon name='account-edit-outline' size={24} color="#FFFFFF" />
                    </View>
                    <Text style={styles.optionText}>Edit Profile</Text>
                    <Icon name="chevron-right" size={24} style={{ fontWeight: 'bold' }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => router.push('/screens/ChangePasswordScreen')}
                    activeOpacity={0.7}>
                    <View style={styles.optionIconBackground}>
                        <Icon name='lock-outline' size={24} color="#FFFFFF" />
                    </View>
                    <Text style={styles.optionText}>Change Password</Text>
                    <Icon name="chevron-right" size={24} style={{ fontWeight: 'bold' }} />
                </TouchableOpacity>
                <DeleteAccountButton />
                <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={async () => {
                        dispatch(logout());
                        // await AsyncStorage.clear();
                        router.push('/screens/LoginSignup');
                    }}>
                    <Icon name="logout" size={22} color="#FFFFFF" style={styles.signOutIcon} />
                    <Text style={styles.signOutButtonText}>Sign out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};
export default PersonalDetailsEditScreen;