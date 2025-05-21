import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeMessages = async (key: string, messages: string[]) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(messages));
  } catch (e) {
    console.error('Error saving messages:', e);
  }
};

export const getMessages = async (key: string): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error fetching messages:', e);
    return [];
  }
};
