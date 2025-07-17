import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Partner, PartnerRole } from '../types/partnerType';
import { styles } from '../styles/PartnerCard.styles';

interface Props {
  partner: Partner;
  onChangeRole: (id: string, role: PartnerRole) => void;
  onDelete: (id: string) => void;
}

const PartnerCard: React.FC<Props> = ({ partner, onChangeRole, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>
          {partner.name}
          {partner.fromInviteLink && ' 🔗'}
        </Text>
        <TouchableOpacity onPress={() => onDelete(partner.id)}>
          <Text style={styles.deleteText}>Remove</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.roleBox}>
        <Text style={styles.label}>Role:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={partner.role}
            onValueChange={(value) => onChangeRole(partner.id, value)}
            style={styles.picker}
            dropdownIconColor="#4EB6AC"
          >
            <Picker.Item label="Viewer" value="viewer" />
            <Picker.Item label="Editor" value="editor" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
        </View>
      </View>
    </View>
  );
};

export default PartnerCard;
