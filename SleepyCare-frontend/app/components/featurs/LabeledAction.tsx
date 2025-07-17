import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar } from 'react-native-paper';
import { colors } from '../../constants'; // Adjust the import path as necessary
interface LabeledActionProps {
  icon: string;
  label: string;
  onPress: () => void;
  style?: any;
  active?: boolean;
}

const LabeledAction: React.FC<LabeledActionProps> = ({ icon, label, onPress, style, active }) => (
  <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
    <Appbar.Action icon={icon} onPress={onPress} color={active ? '#1CCFC0' : undefined} />
    <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 10,
    paddingVertical: 2,
  },
  label: {
    fontSize: 12,
    color: '#333',
    marginTop: -8,
  },
  activeLabel: {
    color: '#1CCFC0', // turquoise
    fontWeight: 'bold',
  },
});

export default LabeledAction;
