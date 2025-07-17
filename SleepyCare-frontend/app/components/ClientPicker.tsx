import React, { useEffect, useState } from "react";
import { View, Text,  StyleSheet } from "react-native";

import { Picker } from "@react-native-picker/picker";
import { ClientType } from "../constants";
import styles, { PRIMARY_COLOR } from "../styles/SleepAnalytics";


interface ClientPickerProps {
  clients: ClientType[]; // Add clients prop to receive the client list from the parent
  onClientSelect: (clientId: string) => void;
  selectedClientId: string; // Add selectedClientId prop to receive the currently selected client ID
}

const ClientPicker: React.FC<ClientPickerProps> = ({ clients, onClientSelect, selectedClientId }) => {
  const [loadingClients, setLoadingClients] = useState<boolean>(true); // Local state to manage loading
  console.log("clients",clients)
  const handleClientChange = (clientId: string) => {
    console.log(clientId);
    onClientSelect(clientId);
  };

  // Simulate a network request to fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      setLoadingClients(true);
      try {
        // Simulate network request delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Here you would typically fetch your clients, e.g.:
        // const fetchedClients = await httpGetClientsByCounselor();
        // setClients(fetchedClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Client:</Text>
        {loadingClients ? (
          <Text style={{ textAlign: 'center', color: PRIMARY_COLOR }}>Loading clients...</Text>
        ) : (
          <Picker
            selectedValue={selectedClientId}
            onValueChange={handleClientChange}
            style={styles.picker}
          >
            <Picker.Item label="Select a client" value="" />
            {clients.map((client: ClientType) => (
              <Picker.Item key={client._id} label={client.child_name} value={client._id} />
            ))}
          </Picker>
        )}
      </View>
    </View>
  );
};

export default ClientPicker;

