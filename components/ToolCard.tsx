import Badge from '@/components/Badge';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ToolCardProps {
    text: string;
    description?: string;
    Icon: LucideIcon;
    iconColor: string;
    iconSize: number;
    showBadge?: boolean;
    count?: number;
    badgeText?: string;
}

interface CropHealthParams {
    title: string,
    description: string,
}

const ToolCard: React.FC<ToolCardProps> = ({ text, description, Icon, iconColor, iconSize, showBadge, count, badgeText }) => {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const handleCropHealth = ({title, description}: CropHealthParams) => {
    Alert.alert(title, description);
  };

  return (
      <TouchableOpacity
        style={[styles.toolCard, { backgroundColor: colors.card }]}
        onPress={() => handleCropHealth({title: text, description: "Coming soon" })}
      >
        <View style={styles.toolIconContainer}>
          <Icon size={iconSize} color={iconColor} />
          {showBadge && <Badge count={count ?? 0} text={badgeText ?? ''} />}
        </View>
        <Text style={[styles.toolTitle, { color: colors.text }]}>
          {text}
        </Text>
        <Text style={[styles.toolSubtitle, { color: colors.textSecondary }]}>
          {description}
        </Text>
      </TouchableOpacity>
  );
};

export default ToolCard;

const styles = StyleSheet.create({
  toolCard: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 140,
  },
  toolIconContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    marginTop: 12,
  },
  toolSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
});
