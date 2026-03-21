import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode, setDarkMode } = useTheme();

  const settingSections = [
    {
      title: 'Appearance',
      items: [
        {
          id: 'dark-mode',
          label: 'Dark Mode',
          icon: (isDarkMode ? 'moon' : 'sunny') as keyof typeof Ionicons.glyphMap,
          type: 'toggle' as const,
          value: isDarkMode,
          onChange: () => setDarkMode(!isDarkMode),
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          id: 'about-app',
          label: 'About After Hours Picks',
          icon: 'information-circle-outline' as keyof typeof Ionicons.glyphMap,
          type: 'link' as const,
          description: 'Version 1.0.0',
        },
      ],
    },
    {
      title: 'Resources',
      items: [
        {
          id: 'podcast',
          label: 'Follow the Podcast',
          icon: 'link' as keyof typeof Ionicons.glyphMap,
          type: 'link' as const,
          description: 'Visit the official After Hours website',
          url: 'https://harvardafterhours.com/episodes/',
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        {
          id: 'terms',
          label: 'Terms of Service',
          icon: 'document-text-outline' as keyof typeof Ionicons.glyphMap,
          type: 'link' as const,
        },
        {
          id: 'privacy',
          label: 'Privacy Policy',
          icon: 'lock-closed-outline' as keyof typeof Ionicons.glyphMap,
          type: 'link' as const,
        },
      ],
    },
  ];

  const themeStyles = isDarkMode ? darkStyles : ({} as typeof darkStyles);
  const iconColor = isDarkMode ? '#aaa' : '#666';
  const chevronColor = isDarkMode ? '#888' : '#999';
  const footerColor = isDarkMode ? '#666' : '#999';

  return (
    <ScrollView style={[styles.container, themeStyles.container]} contentContainerStyle={styles.content}>
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Text style={[styles.title, themeStyles.title]}>Settings</Text>
      </View>

      <View style={styles.sections}>
        {settingSections.map((section, sectionIndex) => (
          <View key={section.title} style={sectionIndex > 0 ? styles.section : null}>
            <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>{section.title}</Text>
            <View style={[styles.sectionCard, themeStyles.sectionCard]}>
              {section.items.map((item, itemIndex) => (
                <View key={item.id}>
                  {item.type === 'toggle' ? (
                    <View style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <View style={[styles.iconContainer, themeStyles.iconContainer]}>
                          <Ionicons name={item.icon} size={20} color={iconColor} />
                        </View>
                        <Text style={[styles.settingLabel, themeStyles.settingLabel]}>{item.label}</Text>
                      </View>
                      <Pressable
                        onPress={item.onChange}
                        style={[styles.toggle, item.value && styles.toggleActive]}
                      >
                        <View style={[styles.toggleThumb, item.value && styles.toggleThumbActive]} />
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      style={styles.settingItem}
                      onPress={() => 'url' in item && typeof item.url === 'string' && Linking.openURL(item.url)}
                    >
                      <View style={styles.settingLeft}>
                        <View style={[styles.iconContainer, themeStyles.iconContainer]}>
                          <Ionicons name={item.icon} size={20} color={iconColor} />
                        </View>
                        <View style={styles.settingTextContainer}>
                          <Text style={[styles.settingLabel, themeStyles.settingLabel]}>{item.label}</Text>
                          {'description' in item && item.description && (
                            <Text style={[styles.settingDescription, themeStyles.settingDescription]}>{item.description}</Text>
                          )}
                        </View>
                      </View>
                      {item.id !== 'about-app' && <Ionicons name="chevron-forward" size={20} color={chevronColor} style={styles.chevron} />}
                    </Pressable>
                  )}

                  {itemIndex < section.items.length - 1 && <View style={[styles.divider, themeStyles.divider]} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={[styles.footerText, themeStyles.footerText]}>After Hours Picks</Text>
          <View style={styles.footerSubtextRow}>
            <Text style={[styles.footerSubtext, { color: footerColor }]}>Made with </Text>
            <Ionicons name="heart" size={12} color={footerColor} />
            <Text style={[styles.footerSubtext, { color: footerColor }]}> for listeners</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  sections: {
    paddingHorizontal: 24,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#999',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e5e5',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#4689F3',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  chevron: {
    marginLeft: 8,
  },
  footerSubtextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginLeft: 68,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 12,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
  },
  title: {
    color: '#e5e5e5',
  },
  sectionTitle: {
    color: '#888',
  },
  sectionCard: {
    backgroundColor: '#1e1e1e',
  },
  iconContainer: {
    backgroundColor: '#333',
  },
  settingLabel: {
    color: '#e5e5e5',
  },
  settingDescription: {
    color: '#888',
  },
  divider: {
    backgroundColor: '#333',
  },
  footerText: {
    color: '#666',
  },
});

