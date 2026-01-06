import { View, Text, TextInput } from 'react-native';
import { Button } from '@repo/ui/button';
import { useState } from 'react';
import { database } from '../../db';
import { HabitRepository } from '@repo/db';
import { router } from 'expo-router';

const habitRepo = HabitRepository(database);

export default function CreateHabitScreen() {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await habitRepo.create(title, 'default');
      router.back();
    } catch (e) {
      alert('Error creating habit');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-4 pt-10">
      <Text className="text-white text-2xl font-bold mb-6">New Habit</Text>
      
      <View className="gap-2 mb-6">
        <Text className="text-gray-400">Title</Text>
        <TextInput
          className="bg-surface text-white p-4 rounded-xl border border-gray-700 text-lg"
          placeholder="e.g. Read 10 pages"
          placeholderTextColor="#666"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />
      </View>

      <Button onPress={handleCreate} disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Habit'}
      </Button>
    </View>
  );
}
