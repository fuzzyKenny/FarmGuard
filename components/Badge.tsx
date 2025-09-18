import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BadgeProps {
  count?: number;
  text: string;
}

const Badge: React.FC<BadgeProps> = ({ count, text }) => {
  return (
    <View style={styles.activeBadge}>
      <Text style={styles.activeBadgeText}>{count} {text}</Text>
    </View>
  );
};

export default Badge;

const styles = StyleSheet.create({
  activeBadge: {
    position: 'absolute',
    top: 35,
    right: -8,
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
});
