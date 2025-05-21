import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loadDirectories, saveDirectories } from '../utils/storage';
import AddDirectoryModal from '../components/AddDirectoryModal';
import { AntDesign } from '@expo/vector-icons';

const defaultIcons: any = {
  You: require('../../assets/icons/you.png'),
  Home: require('../../assets/icons/home.png'),
  Love: require('../../assets/icons/love.png'),
  Family: require('../../assets/icons/family.png'),
  Work: require('../../assets/icons/work.png'),
  Friends: require('../../assets/icons/friends.png'),
};

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [directories, setDirectories] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const load = async () => {
    const dirs = await loadDirectories();
    setDirectories(dirs);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', load);
    load();
    return unsubscribe;
  }, [navigation]);

  const handleLongPress = (name: string) => {
    Alert.alert(
      'Delete Directory',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = directories.filter((d) => d.name !== name);
            setDirectories(updated);
            await saveDirectories(updated);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Messages', { directory: item })}
      onLongPress={() => handleLongPress(item.name)}
    >
      <Image
        source={defaultIcons[item.name] || { uri: item.iconUri }}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={directories}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="pluscircle" size={60} color="#000" />
      </TouchableOpacity>

      <AddDirectoryModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          load();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  list: { padding: 10, justifyContent: 'center' },
  item: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
  },
  icon: { width: 60, height: 60, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: '500' },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
});

export default HomeScreen;
