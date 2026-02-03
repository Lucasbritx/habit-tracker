import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@repo/ui/button';
import { database } from '../../db';
import { sync } from '@repo/db';

export default function SettingsScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSync = async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      await sync(database, supabase);
      Alert.alert('Success', 'Sync completed!');
    } catch (e: any) {
      Alert.alert('Sync Error', e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogin = () => {
    Alert.alert('Info', 'Login flow for mobile is being integrated. Use the Web app to sign up.');
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-gray-400">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background p-6">
      <Text className="text-white text-3xl font-bold mt-12 mb-8">Settings</Text>

      <View className="bg-surface rounded-2xl p-6 border border-gray-800 mb-6">
        <Text className="text-gray-400 text-sm mb-1">Account</Text>
        {user ? (
          <View>
            <Text className="text-white text-lg font-semibold mb-4">{user.email}</Text>
            
            <TouchableOpacity 
              onPress={handleLogout}
              className="bg-red-900/20 p-4 rounded-xl border border-red-900/50"
            >
              <Text className="text-red-400 text-center font-bold">Sign Out</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleSync}
              disabled={isSyncing}
              className="mt-4 bg-primary/20 p-4 rounded-xl border border-primary/50"
            >
              <Text className="text-primary text-center font-bold">
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text className="text-gray-500 mb-4">Not signed in. Sync is disabled.</Text>
            <Button onPress={handleLogin}>Sign In</Button>
          </View>
        )}
      </View>

      <View className="bg-surface rounded-2xl p-6 border border-gray-800">
        <Text className="text-gray-400 text-sm mb-4">App Info</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-300">Version</Text>
          <Text className="text-gray-500">1.0.0</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-300">Built with</Text>
          <Text className="text-gray-500">Antigravity</Text>
        </View>
      </View>
    </View>
  );
}
