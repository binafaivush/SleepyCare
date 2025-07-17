import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { httpUpdateClient } from "../contexts/clientService";
import React, { useState } from 'react';
import styles from "../styles/updetClient";
import { ClientType } from "../constants";
import BackButton from "../components/BackButton";

const UpdetClient = (clientToUpdate : ClientType) => {
    
        const [client, setClient] = useState<ClientType | null>(null);
        const [error, setError] = useState<string | null>(null);
    
        const newClient = (client : ClientType ) => {
            httpUpdateClient(client)
              .then(res => {
                console.log("Client update", res);
                //עדכון מערך הלקוחות ברידקס
              })
              .catch(err => {
                console.error("Error update client", err);
                setError(err.message || "Unknown error occurred");
              });
          };
    
        return ( 
            <View style={styles.container}>
                    <BackButton />

                <Text style={styles.title}>Customer update</Text>
                <TextInput style={styles.input} placeholder="name" />
                <TextInput style={styles.input} placeholder="phone" keyboardType="phone-pad" />
                <TextInput style={styles.input} placeholder="address" />
                <Pressable style={styles.button} onPress={() => {}}>
                    <Text style={styles.buttonText}>update</Text>
                </Pressable>
            </View> 
        );
};


 
export default UpdetClient;