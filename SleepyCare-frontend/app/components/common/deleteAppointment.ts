import { Alert } from 'react-native';
import { httpDeleteAppointment } from '@/app/contexts/appointmentService';

export async function confirmAndDeleteAppointment(
  appointmentId: string,
  token: string,
  onSuccess?: () => void
) {
  Alert.alert(
    'Confirm Deletion',
    'Are you sure you want to delete this appointment?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            await httpDeleteAppointment(appointmentId, token);
            Alert.alert('Deleted', 'The appointment has been successfully deleted.');
            if (onSuccess) onSuccess();
          } catch (error) {
            console.error('Failed to delete appointment:', error);
            Alert.alert('Error', 'Something went wrong while deleting.');
          }
        },
      },
    ]
  );
}
