import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, Alert } from 'react-native';

type Props = {
  title: string;
  icon: any;
  onPress: () => void;
  onDelete?: () => void;
};

export default function DirectoryCard({ title, icon, onPress, onDelete }: Props) {
  const handleLongPress = () => {
    if (onDelete) {
      Alert.alert(`Delete "${title}"?`, 'All messages will be lost.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={handleLongPress}
      delayLongPress={300}
    >
      <Image source={icon} style={styles.icon} />
      <Text style={styles.text}>{title}</Text>
      {onDelete && <Image source={require('../../assets/icons/delete.png')} style={styles.deleteIcon} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    margin: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    tintColor: 'red',
  },
});
