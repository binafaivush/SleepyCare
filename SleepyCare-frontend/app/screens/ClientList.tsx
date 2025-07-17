import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, Pressable } from 'react-native';
// import Client from "../components/featurs/client";
import styles from '../styles/clientList';
import { ClientType } from '../constants';
import Loader from '../components/Loader';
import { httpGetClientByCounselorId } from '../contexts/clientService';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const ClientList: React.FC = () => {

  const router = useRouter();

  const [clients, setClients] = useState<ClientType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const currentUser = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await httpGetClientByCounselorId(currentUser.id, currentUser.token);
        console.log("Clients fetched:", response.data);

        setClients(response.data);
      } catch (err) {
        console.log("err client ", err);
        setError('Failed to fetch clients xxx');
      } finally {
        setLoading(false);
      }
    };
    if (currentUser && currentUser.id) {
      fetchClients();
    }
  }, [currentUser.id]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // פונקציה שמחזירה צבע רנדומלי קבוע לפי מחרוזת (id)
  function getColorFromId(id: string) {
    const colors = [
      '#FFB300', '#FF7043', '#29B6F6', '#AB47BC', '#66BB6A', '#EC407A', '#FFA726', '#26A69A', '#8D6E63', '#789262', '#D4E157', '#5C6BC0', '#FF8A65', '#26C6DA', '#9CCC65', '#7E57C2', '#FFCA28', '#42A5F5', '#D81B60', '#43A047'
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
        <Pressable style={styles.add} onPress={() => router.push('/screens/Addclient')}>
          <Text style={{ color: 'white', fontSize: 24 }}>+</Text>
        </Pressable>
        <Pressable style={styles.addNote} onPress={() => router.push('/screens/TextArea')}>
          <Text style={{ color: 'white', fontSize: 16 }}>add a note</Text>
        </Pressable>
      </View>
      {loading ? (
        <Loader />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : clients.length === 0 ? (
        <Text style={styles.error}>clients not found</Text>
      ) : (
        <FlatList
          data={clients}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const expanded = expandedIds.includes(item._id);
            return (
              <Pressable onPress={() => toggleExpand(item._id)} style={styles.card}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: expanded ? 8 : 0 }}>
                  <View style={{
                    width: 38, height: 38, borderRadius: 19, backgroundColor: 'transparent',
                    alignItems: 'center', justifyContent: 'center', marginRight: 10, borderWidth: 1, borderColor: getColorFromId(item._id),
                    display: 'flex'
                  }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: getColorFromId(item._id), textAlign: 'center', textAlignVertical: 'center', lineHeight: 38 }}>
                      {item.child_name?.charAt(0) || '?'}
                    </Text>
                  </View>
                  <Text style={styles.clientName}>{item.child_name}</Text>
                </View>
                {expanded && (
                  <>
                    <Text style={styles.clientLabel}>Birthdate</Text>
                    <Text style={styles.clientValue}>
                      {item.child_birthdate ? new Date(item.child_birthdate).toLocaleDateString('en-GB') : '-'}
                    </Text>
                    <Text style={styles.clientLabel}>Note</Text>
                    <Text style={styles.noteValue}>
                      {item.notes || '---'}
                    </Text>
                  </>
                )}
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
};

export default ClientList;
