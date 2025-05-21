import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type MessagesScreenRouteProp = RouteProp<RootStackParamList, 'Messages'>;

export default function MessagesScreen() {
  const route = useRoute<MessagesScreenRouteProp>();
  const { directory } = route.params;
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const key = `messages-${directory.name}`;

  useEffect(() => {
    const load = async () => {
      const json = await AsyncStorage.getItem(key);
      setMessages(json ? JSON.parse(json) : []);
    };
    load();
  }, []);

  const saveMessages = async (updated: string[]) => {
    setMessages(updated);
    await AsyncStorage.setItem(key, JSON.stringify(updated));
  };

  const handleAddOrEdit = () => {
    if (!input.trim()) return;

    if (editingIndex !== null) {
      const updated = [...messages];
      updated[editingIndex] = input;
      saveMessages(updated);
      setEditingIndex(null);
    } else {
      const updated = [...messages, input];
      saveMessages(updated);
    }

    setInput('');
  };

  const handleEdit = (index: number) => {
    setInput(messages[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    Alert.alert('Delete Message', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updated = messages.filter((_, i) => i !== index);
          saveMessages(updated);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{directory.name}</Text>
      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.message}>
            <Text style={styles.text}>{item}</Text>
            <View style={styles.buttons}>
              <Button title="Edit" onPress={() => handleEdit(index)} />
              <Button title="Delete" onPress={() => handleDelete(index)} />
            </View>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter message"
        value={input}
        onChangeText={setInput}
      />
      <Button title={editingIndex !== null ? 'Update Message' : 'Add Message'} onPress={handleAddOrEdit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginTop: 12,
  },
  message: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: '#f2f2f2',
  },
  text: { fontSize: 16 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between' },
});
