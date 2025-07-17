import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles/Resources';
import { ResourceType } from '../constants';
import Loader from '../components/Loader';
import { url } from '../constants';
import { useRouter } from 'expo-router';

const Resources : React.FC = () => {

  const [resources, setResources] = useState<ResourceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(url);
        console.log("the data: ",response);
        setResources(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }} finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <View style = {styles.container}>
      <Pressable style={styles.add} onPress={()=> router.push('/screens/ContentManagerScreen')}>
        <Text>add resource</Text>
      </Pressable>
    {loading ? (
<Loader/>      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : resources.length === 0 ? (
        <Text style={styles.error}>resources not found</Text>
      ) : (
    <FlatList
      data={resources}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <View>
        <Text>{item.title}</Text>
        <Text>{item.description}</Text>
        <Text>{item.type}</Text>
        <Text>{item.description}</Text>
        <Text>{item.uploaded_by}</Text>
        <Pressable>
          <Icon name="edit" size={20} color="#000" />
        </Pressable>
      </View>}
      ListEmptyComponent={<Text>No resources found - empty</Text>}
    />)}
  </View>);
};


export default Resources;
