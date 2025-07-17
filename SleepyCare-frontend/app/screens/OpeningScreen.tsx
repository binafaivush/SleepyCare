import { StyleSheet, View, Image } from 'react-native';
import React, { useEffect } from 'react';
import { colors } from '../constants'; // Adjust the import path as necessary
import { useRouter } from 'expo-router';

const OpeningScreen = () => {
    const router = useRouter();
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/screens/LoginSignup');
        }, 4000);
        return () => clearTimeout(timer);
    }, [router]);
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.home
        }}>
            <Image
                source={require('../../assets/images/sleepycare_logo2.png')}
                style={styles.logo}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        position: 'absolute',
        top: 0,
        left: 0,
    },
});
export default OpeningScreen;