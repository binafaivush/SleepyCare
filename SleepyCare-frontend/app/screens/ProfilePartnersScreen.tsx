import React, { useEffect, useState, useCallback } from 'react';
import {  View,  Text,  FlatList,  Alert,  TouchableOpacity,} from 'react-native';
// import Clipboard from '@react-native-clipboard/clipboard';
import * as Clipboard from 'expo-clipboard';

import Icon from 'react-native-vector-icons/FontAwesome5';

import { Partner, PartnerRole } from '../types/partnerType';
import PartnerCard from '../screens/PartnerCard';
import {  getPartners,  updatePartnerRole,  deletePartner,  createInviteLink,} from '../contexts/partnersService';
import { styles } from '../styles/ProfilePartnersScreen.styles';

const ProfilePartnersScreen: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPartners();
        setPartners(data);
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch partners');
      }
    };
    fetchData();
  }, []);

  const handleRoleChange = useCallback(async (id: string, newRole: PartnerRole) => {
    try {
      await updatePartnerRole(id, newRole);
      setPartners((prev) =>
        prev.map((p) => (p.id === id ? { ...p, role: newRole } : p))
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to update role');
    }
  }, []);

  const handleDelete = useCallback((id: string) => {
    Alert.alert('Delete Partner', 'Are you sure you want to remove this partner?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePartner(id);
            setPartners((prev) => prev.filter((p) => p.id !== id));
          } catch (err) {
            Alert.alert('Error', 'Failed to delete partner');
          }
        },
      },
    ]);
  }, []);

  const handleCreateLink = useCallback(async () => {
    try {
      const link = await createInviteLink();
      setInviteLink(link);
      setCopied(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to create invite link');
    }
  }, []);

  const handleCopy = useCallback(() => {
    if (inviteLink) {
      Clipboard.setString(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [inviteLink]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Partners</Text>

      <FlatList
        data={partners}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PartnerCard
            partner={item}
            onChangeRole={handleRoleChange}
            onDelete={handleDelete}
          />
        )}
      />

      <TouchableOpacity style={styles.inviteButton} onPress={handleCreateLink}>
        <Text style={styles.inviteText}>+ Create New Invite Link</Text>
      </TouchableOpacity>

      {inviteLink && (
        <View style={styles.linkContainer}>
          <View style={styles.linkBox}>
            <Text numberOfLines={1} style={styles.linkText}>{inviteLink}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
              <Icon name={copied ? 'check' : 'copy'} size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          {copied && <Text style={styles.copiedText}>✓ Link copied</Text>}
        </View>
      )}
    </View>
  );
};

export default ProfilePartnersScreen;
