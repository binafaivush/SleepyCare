import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../styles/VoiceRecorder.styles';

export default function VoiceRecorder() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const animation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (recording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      animation.setValue(1);
    }
  }, [recording]);

  const startRecording = async () => {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) return;

    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

    const { recording } = await Audio.Recording.createAsync({
      android: {
        extension: '.m4a',
        outputFormat: 2,
        audioEncoder: 3,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
      },
      ios: {
        extension: '.caf',
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
      },
    } as any);

    setRecording(recording);
    setRecordedUri(null);
  };

  const stopRecording = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordedUri(uri);
    setRecording(null);
  };

  const playSound = async () => {
    if (!recordedUri) return;
    const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
    setSound(sound);
    await sound.playAsync();
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎙️ Voice Recorder</Text>

      {recording && (
        <Animated.View style={[styles.recordIndicator, { opacity: animation }]} />
      )}

      <Pressable style={[styles.button, styles.breastmilk]} onPress={startRecording} disabled={!!recording}>
        <Text style={styles.buttonText}>Start</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.formula]} onPress={stopRecording} disabled={!recording}>
        <Text style={styles.buttonText}>Stop</Text>
      </Pressable>

      {recordedUri && (
        <Pressable style={[styles.button, styles.solid]} onPress={playSound}>
          <FontAwesome name="volume-up" size={24} color="white" />
          <Text style={styles.buttonText}> Play</Text>
        </Pressable>
      )}
    </View>
  );
}
