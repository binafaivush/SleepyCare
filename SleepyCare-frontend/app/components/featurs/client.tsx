import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet,Pressable } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { httpDeleteClient,httpUpdateClient,httpGetAllClient } from '@/app/contexts/clientService';
import styles from '@/app/styles/client';
import { ClientType } from '@/app/constants';
import { url } from '@/app/constants';

const Client = ({ clientId, token }: { clientId: string; token: string }) => {

  const router = useRouter();

  const [client, setClient] = useState<ClientType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      if (clientId === 'demo') {
        // Provide a demo client directly
        setClient({
          _id: 'demo',
          user_id: 'demo',
          notes: 'Demo client',
          counselor_id: 'demo',
          child_name: 'Demo Child',
          child_birthdate: '2020-01-01',
        });
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(url+clientId);
        setClient(response.data);
      } catch (err) {
        setError('Failed to fetch clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [clientId]);


  const deleteClient = (clientId: string) => {
    httpDeleteClient(clientId,token)
      .then(res => {
        console.log("Client deleted", res);
        setClient(null);
      })
      .catch(err => {
        console.error("Error deleting client", err);
        setError(err.message || "Unknown error occurred");
      });
  };


  return (
    loading ? (
      <Text>loading...</Text>
    ) : error ? (
      <Text style={styles.error}>{error}</Text>
    ) : !client ? (
      <Text style={styles.error}>Client not found</Text>
    ) : (
      <View style={styles.container}>
        <Text style={styles.title}>Client Details</Text>
        <Text style={styles.info}>Name: {client.child_name}</Text>
        <Text style={styles.info}>Birthdate: {client.child_birthdate}</Text>
        <Text style={styles.info}>Notes: {client.notes}</Text>
        <View style={styles.viewPressable}>
          <Pressable onPress={() => {router.push('/screens/updateClient')}}>
            <FontAwesomeIcon name="edit" size={20} color="#000" />
          </Pressable>
          <Pressable onPress={() => {deleteClient(client._id)}}>
            <MaterialIcon name="delete" size={20} color="#000" />
          </Pressable>
          <Pressable onPress={()=> {}}>
           <FontAwesomeIcon name="calendar" size={18} color="#000" />
          </Pressable>
        </View>
      </View>
    )
  );
  
};



export default Client;
