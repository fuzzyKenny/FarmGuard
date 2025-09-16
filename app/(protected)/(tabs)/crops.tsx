import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Droplet, Sprout, Sun } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CropsScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Your Crops</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage and monitor your plants</Text>
      </View>

      <View style={[styles.cropCard, { backgroundColor: colors.card }]}>
        <View style={styles.cropHeader}>
          <Sprout size={24} color="#10b981" />
          <View style={styles.cropInfo}>
            <Text style={[styles.cropName, { color: colors.text }]}>Tomato Plants</Text>
            <Text style={styles.cropStatus}>Healthy • 3 plants</Text>
          </View>
        </View>
        
        <View style={styles.cropStats}>
          <View style={styles.statItem}>
            <Droplet size={16} color="#3b82f6" />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>Last watered: 2 days ago</Text>
          </View>
          <View style={styles.statItem}>
            <Sun size={16} color="#fbbf24" />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>Sunlight: 6-8 hours daily</Text>
          </View>
        </View>
      </View>

      <View style={[styles.cropCard, { backgroundColor: colors.card }]}>
        <View style={styles.cropHeader}>
          <Sprout size={24} color="#10b981" />
          <View style={styles.cropInfo}>
            <Text style={[styles.cropName, { color: colors.text }]}>Basil Garden</Text>
            <Text style={styles.cropStatus}>Growing • 5 plants</Text>
          </View>
        </View>
        
        <View style={styles.cropStats}>
          <View style={styles.statItem}>
            <Droplet size={16} color="#3b82f6" />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>Last watered: Today</Text>
          </View>
          <View style={styles.statItem}>
            <Sun size={16} color="#fbbf24" />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>Sunlight: 4-6 hours daily</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  cropCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cropHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cropInfo: {
    marginLeft: 12,
    flex: 1,
  },
  cropName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  cropStatus: {
    fontSize: 14,
    color: '#10b981',
  },
  cropStats: {
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
  },
});