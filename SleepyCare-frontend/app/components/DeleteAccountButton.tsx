import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { deleteUserAccount } from '../contexts/userService';
import { clearUserData } from '../store/userSlice';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface DeleteAccountButtonProps {
  onSuccess?: () => void;
}

const DeleteAccountButton: React.FC<DeleteAccountButtonProps> = ({ onSuccess }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme(); const dispatch = useDispatch();
  const router = useRouter();
  const { id: userId, token: authToken } = useSelector((state: RootState) => state.user);

  const handleDelete = async () => {
    if (!userId || !authToken) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please login again and try again',
        position: 'bottom',
        visibilityTime: 4000
      });
      return;
    }

    setIsLoading(true);
    try {
      await deleteUserAccount(userId, authToken);
      dispatch(clearUserData());
      setShowDialog(false);
      if (onSuccess) {
        onSuccess();
      }

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account deleted successfully',
        position: 'bottom',
        visibilityTime: 2000
      });

      router.push('/screens/LoginSignup');
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'An unexpected error occurred',
        position: 'bottom',
        visibilityTime: 4000
      });
    } finally {
      setIsLoading(false);
      setShowDialog(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => setShowDialog(true)}
        activeOpacity={0.7}
        disabled={isLoading}
      >
        <View style={styles.optionIconBackground}>
          <Icon name="account-remove-outline" size={24} color="#FFFFFF" />
        </View>
        <Text style={styles.optionText}>Delete Account</Text>
        <Icon name="chevron-right" size={24} style={{ fontWeight: 'bold' }} />
      </TouchableOpacity>
      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title style={styles.dialogTitle}>Delete Account</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Are you sure you want to delete your account?
              This action is irreversible and all your data will be permanently deleted.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)} style={styles.cancelButton}>
              Cancel
            </Button>
            <Button
              onPress={handleDelete}
              loading={isLoading}
              disabled={isLoading}
              textColor={theme.colors.error}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const PRIMARY_COLOR = '#4DB6AC';

const styles = StyleSheet.create({
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 6,
    paddingHorizontal: 30,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 2,
    // elevation: 2,
  },
  optionIconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold'

  },
  deleteButton: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: '#4DB6AC'
  },
  buttonText: {
    fontSize: 16,
  },
  dialogTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dialogText: {
    textAlign: 'left',
    fontSize: 16,
    lineHeight: 24,
  },
  cancelButton: {
    marginRight: 8,
  },
});

export default DeleteAccountButton;
