import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { httpAddClient } from '../contexts/clientService';
import styles from '../styles/addClient';
import { ClientType } from '../constants';
import BackButton from '../components/BackButton';

// טיפוס עבור טופס הלקוח

const AddClient: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<ClientType>({
    defaultValues: {
      _id: '',
      parentId: '',
      counselorId: '',
      childName: '',
      childBirthdate: '',
    },
  });

  const onSubmit = (data: ClientType) => {
    console.log('Client Data:', data);
    httpAddClient(data)
      .then(res => console.log('Client added successfully', res))
      .catch(err => console.error('Error adding client', err));
  };

  return (
    <View style={styles.container}>
      <View style={{ alignSelf: 'flex-start' }}>
    <BackButton />
  </View>
      <Text style={styles.title}>Add Client</Text>

      <Controller
        control={control}
        rules={{ required: 'ID is required', pattern: { value: /^[0-9]{9}$/, message: 'ID must be 9 digits' } }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="ID" onChangeText={onChange} value={value}  />
        )}
        name="_id"
      />
      {errors._id && <Text style={styles.errorText}>{errors._id.message?.toString()}</Text>}

      <Controller
        control={control}
        rules={{ required: 'Parent ID is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Parent ID" onChangeText={onChange} value={value} />
        )}
        name="parentId"
      />
      {errors.parentId && <Text style={styles.errorText}>{errors.parentId.message?.toString()}</Text>}

      <Controller
        control={control}
        rules={{ required: 'Counselor ID is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Counselor ID" onChangeText={onChange} value={value} />
        )}
        name="counselorId"
      />
      {errors.counselorId && <Text style={styles.errorText}>{errors.counselorId.message?.toString()}</Text>}

      <Controller
        control={control}
        rules={{ required: 'Child name is required', pattern: { value: /^[A-Za-zא-ת]{2,}$/, message: 'Only letters, at least 2' } }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Child Name" onChangeText={onChange} value={value} />
        )}
        name="childName"
      />
      {errors.childName && <Text style={styles.errorText}>{errors.childName.message?.toString()}</Text>}

      <Controller
        control={control}
        rules={{ 
          required: 'Birthdate is required', 
          pattern: { 
            value: /^(?:\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}\.\d{2}\.\d{4})$/, 
            message: 'Format: YYYY-MM-DD, DD/MM/YYYY, DD.MM.YYYY' 
          } 
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Birthdate" onChangeText={onChange} value={value} />
        )}
        name="childBirthdate"
      />
      {errors.childBirthdate && <Text style={styles.errorText}>{errors.childBirthdate.message?.toString()}</Text>}

      <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>submit</Text>
      </Pressable>
    </View>
  );
};

export default AddClient;
