import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, Pressable, ScrollView, } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { uploadFileToFirebase } from '../components/uploadFileToFirebase'; // Adjust the import path as necessary
import { Alert } from 'react-native';
import styles from '../styles/ContentManagerScreen';
import BackButton from '../components/BackButton';

export default function ContentManagerScreen() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [link, setLink] = useState('');
  const [accessLevel, setAccessLevel] = useState<'all' | 'link' | 'clients'>('all');
  const [contentType, setContentType] = useState<'video' | 'file' | 'link' | null>(null);
  const [fileUri, setFileUri] = useState<string | null>(null);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setFileName(file.name);
      setFileUri(file.uri);
      console.log('Selected file:', file.uri);
    }
  };


  const handleContentType = async (type: 'video' | 'file' | 'link') => {
    setContentType(type);
    if (type === 'video' || type === 'file') {
      await pickDocument();
    }
  };

  const renderInputSection = () => {
    if (contentType === 'link') {
      return (
        <TextInput
          placeholder="Paste link here"
          value={link}
          onChangeText={setLink}
          style={styles.input}
        />
      );
    }
    if ((contentType === 'file' || contentType === 'video') && fileName) {
      return <Text style={styles.fileName}>Selected file: {fileName}</Text>;
    }
    return null;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={{ alignSelf: 'flex-start' }}>
          <BackButton />
        </View>
        <MaterialCommunityIcons name="cloud-upload" size={72} color="#555" />
        <Text style={styles.title}>Upload New Content</Text>
      </View>

      <Text style={styles.subtitle}>Select content type:</Text>
      <View style={styles.uploadOptions}>
        <UploadButton
          icon="video-plus"
          label="Video"
          color="#e67e22"
          onPress={() => handleContentType('video')}
        />
        <UploadButton
          icon="file-plus"
          label="Article"
          color="#3498db"
          onPress={() => handleContentType('file')}
        />
        <UploadButton
          icon="link-plus"
          label="Link"
          color="#2ecc71"
          onPress={() => handleContentType('link')}
        />
      </View>

      {/* Show input section only if contentType is selected, and before access level picker */}
      {contentType && renderInputSection()}

      {/* Always show access level picker and save button */}
      <Text style={styles.label}>Access Level:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={accessLevel}
          onValueChange={(itemValue) => setAccessLevel(itemValue)}
        >
          <Picker.Item label="Everyone" value="all" />
          <Picker.Item label="Anyone with the link" value="link" />
          <Picker.Item label="Clients only" value="clients" />
        </Picker>
      </View>

      <Pressable
        style={styles.saveButton}
        onPress={async () => {
          try {
            if (!contentType) {
              Alert.alert('Missing Info', 'Please select content type');
              return;
            }

            if (contentType === 'link') {
              if (!link.trim()) {
                Alert.alert('Missing Link', 'Please paste a valid link');
                return;
              }
              console.log('Saving link:', link);
              // שליחה לשרת כאן
              Alert.alert('Success', 'Link saved successfully!');
            } else if (contentType === 'file' || contentType === 'video') {
              if (!fileUri || !fileName) {
                Alert.alert('Missing File', 'Please select a file first');
                return;
              }
              const downloadUrl = await uploadFileToFirebase(fileUri, fileName);
              console.log('File uploaded to:', downloadUrl);
              // שליחה לשרת כאן
              Alert.alert('Success', 'File uploaded successfully!');
            }
          } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Upload Failed', 'Something went wrong. Please try again.');
          }
        }}
      >
        <Text style={styles.saveButtonText}>Save Content</Text>
      </Pressable>
    </ScrollView>
  );
}

interface UploadButtonProps {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  icon,
  label,
  color,
  onPress,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      style={[
        styles.optionButton,
        {
          backgroundColor: isPressed ? '#f2f2f2' : '#fff',
          borderColor: color,
        },
      ]}
    >
      <MaterialCommunityIcons name={icon} size={32} color={color} />
      <Text style={[styles.optionLabel, { color }]}>{label}</Text>
    </Pressable>
  );
};





