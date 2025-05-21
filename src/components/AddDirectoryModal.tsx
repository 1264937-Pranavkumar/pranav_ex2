// src/components/AddDirectoryModal.tsx
import React, { useState } from 'react';
import {
  View,
  Modal,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { loadDirectories, saveDirectories } from '../utils/storage';

interface AddDirectoryModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddDirectoryModal: React.FC<AddDirectoryModalProps> = ({ visible, onClose }) => {
  const [name, setName] = useState('');
  const [iconUri, setIconUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setIconUri(result.assets[0].uri);
    }
  };

  const onSave = async () => {
    if (!name || !iconUri) {
      Alert.alert('Please enter name and pick an icon');
      return;
    }

    const newDirectory = { name, iconUri };
    const existing = await loadDirectories();
    const updated = [...existing, newDirectory];
    await saveDirectories(updated);
    setName('');
    setIconUri(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add New Directory</Text>
          <TextInput
            placeholder="Directory Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {iconUri ? (
              <Image source={{ uri: iconUri }} style={styles.icon} />
            ) : (
              <Text>Pick an Icon</Text>
            )}
          </TouchableOpacity>
          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Save" onPress={onSave} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  imagePicker: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
  },
  icon: { width: 80, height: 80 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default AddDirectoryModal;
