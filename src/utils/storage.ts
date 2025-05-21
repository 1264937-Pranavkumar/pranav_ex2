import AsyncStorage from '@react-native-async-storage/async-storage';

const DIRECTORY_KEY = 'directories';

const defaultDirectories = [
  { name: 'You', iconUri: require('../../assets/icons/you.png') },
  { name: 'Home', iconUri: require('../../assets/icons/home.png') },
  { name: 'Love', iconUri: require('../../assets/icons/love.png') },
  { name: 'Family', iconUri: require('../../assets/icons/family.png') },
  { name: 'Work', iconUri: require('../../assets/icons/work.png') },
  { name: 'Friends', iconUri: require('../../assets/icons/friends.png') },
];

export const loadDirectories = async () => {
  const data = await AsyncStorage.getItem('directories');
  return data ? JSON.parse(data) : [];
};

export const saveDirectories = async (directories: any[]) => {
  await AsyncStorage.setItem('directories', JSON.stringify(directories));
};

