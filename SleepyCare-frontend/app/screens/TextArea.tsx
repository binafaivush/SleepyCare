import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { httpGetClientByCounselorId } from '../contexts/clientService';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import BackButton from '../components/BackButton';

const clientsList = [
    { label: 'John Doe', value: '1' },
    { label: 'Jane Smith', value: '2' },
];



const ClientNotesScreen = () => {
    const currentCounselor = useSelector((state: RootState) => state.user);
    const [clientOpen, setClientOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const [clients, setClients] = useState(clientsList);
    const [notes, setNotes] = useState('');

    // פונקציה שמביאה את רשימת הילדים מהשרת ומחזירה אותם בפורמט המתאים ל-dropdown
    const getClientsListFromServer = async () => {
        console.log('getClientsListFromServer called with:', currentCounselor.id);
        try {
            const children = await httpGetClientByCounselorId(currentCounselor.id, currentCounselor.token);
            console.log('children from server:', children);
            return children.data.map((child: any) => ({ label: child.child_name, value: child._id }));
        } catch (error) {
            console.log('getClientsListFromServer error:', error);
            return [];
        }
    };
    useEffect(() => {
        console.log('Current counselor ID:', currentCounselor.id || 'not available');
        getClientsListFromServer()
            .then((result) => {
                if (result && result.length > 0) {
                    setClients(result);
                } else {
                    setClients(clientsList); // Use dummy list if no results
                }
            })
            .catch((err) => {
                console.log('Error fetching clients:', err);
                setClients(clientsList); // Use dummy list on error
                Alert.alert('Error loading data from server, showing dummy list.');
            });
    }, [currentCounselor]);

    const handleSave = () => {
        if (selectedClient && notes.trim()) {
            // כאן נןסיף את הלוגיקה לשמירת ההערות ללקוח הנבחר
            console.log(`Saving for client ${selectedClient}: ${notes}`);
            setSelectedClient(null);
            setNotes('');
            setClientOpen(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.container}
        >
            <View style={styles.box}>
                        <BackButton/>
                <Text style={styles.title}>Client Comments</Text>

                <DropDownPicker
                    placeholder="select client"
                    open={clientOpen}
                    value={selectedClient}
                    items={clients}
                    setOpen={setClientOpen}
                    setValue={setSelectedClient}
                    setItems={setClients}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                    zIndex={3000}
                    zIndexInverse={1000}
                    textStyle={{
                        fontSize: 16,
                    }}
                    labelStyle={{
                        fontSize: 16,
                    }}
                />
                {selectedClient && (
                    // <Text style={{ marginBottom: 16, fontSize: 16 }}>
                    //     Selected Client: {clients.find(client => client.value === selectedClient)?.label}
                    // </Text>
                    <Text style={{ marginBottom: 16, fontSize: 16,fontWeight: 'bold', color: '#008B8B' }}>
                        {currentCounselor.name || "the consultant"} writes a note to {clients.find(client => client.value === selectedClient)?.label}
                    </Text>
                )}
                <TextInput
                    label="Comments / Description"
                    value={notes}
                    onChangeText={setNotes}
                    mode="outlined"
                    multiline
                    numberOfLines={10}
                    style={styles.textInput}
                    outlineColor="#00B3B3"
                    activeOutlineColor="#008B8B"
                />

                <Button
                    mode="contained"
                    onPress={handleSave}
                    disabled={!selectedClient || !notes.trim()}
                    style={styles.button}
                    buttonColor="#008B8B"
                    textColor="white"
                >
                    Save
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ClientNotesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#E0F7F7', // רקע טורקיז בהיר
    },
    box: {
        flex: 1,
        backgroundColor: '#E0F7F7',
        padding: 20,
        borderRadius: 16,
    },
    title: {
        fontSize: 25,
        fontWeight: '800',
        marginBottom: 16,
        textAlign: 'center',
        color: '#008B8B', // כותרת טורקיז כהה
    },
    dropdown: {
        marginBottom: 16,
        borderRadius: 8,
        borderColor: '#008B8B',
    },
    dropdownContainer: {
        borderRadius: 8,
        borderColor: '#008B8B',
    },
    textInput: {
        marginBottom: 16,
        backgroundColor: 'white',
        height: 200,
        fontSize: 16,
        borderRadius: 8,
    },
    button: {
        borderRadius: 8,
        paddingVertical: 6,
        fontSize: 20,
    },
});
