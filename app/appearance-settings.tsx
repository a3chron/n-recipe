import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CATPPUCCIN_ACCENT_OPTIONS, ThemeMode, useAccentColors, useThemeSettings } from '@/hooks/use-system-accent';
import { router } from 'expo-router';
import { ArrowLeft, Check, Palette } from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, TouchableOpacity, useColorScheme, View } from 'react-native';

interface ThemeOptionProps {
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  accentColors: any;
}

function ThemeOption({ title, description, isSelected, onSelect, isFirst, isLast, accentColors }: ThemeOptionProps) {
  const roundedClass = isFirst ? 'rounded-t-xl' : (isLast ? 'rounded-b-xl' : '');
  
  return (
    <TouchableOpacity
      onPress={onSelect}
      className={`p-4 ${roundedClass}`}
      style={{ 
        backgroundColor: isSelected ? accentColors.surface : accentColors.mantle,
        borderWidth: isSelected ? 2 : 1,
        borderColor: isSelected ? accentColors.primary : accentColors.surface
      }}
      activeOpacity={0.7}
    >
      <ThemedView 
        className="flex-row items-center justify-between"
        style={{ backgroundColor: 'transparent' }}
      >
        <ThemedView 
          className="flex-1"
          style={{ backgroundColor: 'transparent' }}
        >
          <ThemedText 
            type="bold" 
            className="mb-1"
            style={{ color: accentColors.text }}
          >
            {title}
          </ThemedText>
          <ThemedText 
            className="text-sm"
            style={{ color: accentColors.subtext0 }}
          >
            {description}
          </ThemedText>
        </ThemedView>
        {isSelected && (
          <Check size={20} color={accentColors.primary} />
        )}
      </ThemedView>
    </TouchableOpacity>
  );
}

interface CatppuccinColorOptionProps {
  name: string;
  colorKey: string;
  colorValue: string;
  isSelected: boolean;
  onSelect: (colorKey: string) => void;
  accentColors: any;
}

function CatppuccinColorOption({ name, colorKey, colorValue, isSelected, onSelect, accentColors }: CatppuccinColorOptionProps) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(colorKey)}
      className="flex flex-row items-center p-3 mb-2 rounded-xl"
      style={{ 
        width: '48%',
        backgroundColor: isSelected ? accentColors.surface : accentColors.mantle,
        borderWidth: isSelected ? 2 : 1,
        borderColor: isSelected ? accentColors.primary : accentColors.surface
      }}
      activeOpacity={0.7}
    >
      {/* Color Circle */}
      <ThemedView 
        className="w-8 h-8 rounded-full mr-3"
        style={{ 
          backgroundColor: colorValue,
          borderWidth: 1,
          borderColor: accentColors.surface
        }}
      />
      
      {/* Color Name */}
      <ThemedText 
        type="default" 
        className="flex-1 text-sm"
        style={{ color: accentColors.text }}
      >
        {name}
      </ThemedText>
      
      {/* Selection Check */}
      {isSelected && (
        <Check size={16} color={accentColors.primary} />
      )}
    </TouchableOpacity>
  );
}

export default function AppearanceSettingsScreen() {
  const { settings, updateSettings } = useThemeSettings();
  const accentColors = useAccentColors();
  const colorScheme = useColorScheme();

  const handleThemeModeSelect = async (mode: ThemeMode) => {
    try {
      await updateSettings({ themeMode: mode });
      const themeNames = { system: 'System', catppuccin: 'Catppuccin', nothing: 'Nothing' };
      Alert.alert('Theme Updated', `Switched to ${themeNames[mode]} theme.`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update theme. Please try again.');
    }
  };

  const handleCatppuccinAccentSelect = async (accentKey: string) => {
    try {
      await updateSettings({ catppuccinAccent: accentKey });
      Alert.alert('Accent Updated', 'Catppuccin accent color updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update accent color. Please try again.');
    }
  };

  // Get the actual color values for Catppuccin colors based on current theme
  const getCatppuccinColorValue = (colorKey: string) => {
    const isDark = colorScheme === 'dark';
    const CATPPUCCIN_LATTE = {
      rosewater: '#dc8a78', flamingo: '#dd7878', pink: '#ea76cb', mauve: '#8839ef',
      red: '#d20f39', maroon: '#e64553', peach: '#fe640b', yellow: '#df8e1d',
      green: '#40a02b', teal: '#179299', sky: '#04a5e5', sapphire: '#209fb5',
      blue: '#1e66f5', lavender: '#7287fd'
    };
    
    const CATPPUCCIN_MOCHA = {
      rosewater: '#f5e0dc', flamingo: '#f2cdcd', pink: '#f5c2e7', mauve: '#cba6f7',
      red: '#f38ba8', maroon: '#eba0ac', peach: '#fab387', yellow: '#f9e2af',
      green: '#a6e3a1', teal: '#94e2d5', sky: '#89dceb', sapphire: '#74c7ec',
      blue: '#89b4fa', lavender: '#b4befe'
    };

    const palette = isDark ? CATPPUCCIN_MOCHA : CATPPUCCIN_LATTE;
    return palette[colorKey as keyof typeof palette] || palette.mauve;
  };

  return (
    <ThemedView className="flex-1" style={{ backgroundColor: accentColors.base }}>
      {/* Header */}
      <ThemedView 
        className="flex-row items-center px-6 pt-16 pb-4"
        style={{ backgroundColor: accentColors.base }}
      >
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color={accentColors.subtext0} />
        </TouchableOpacity>
        <ThemedView 
          className="flex-row items-center gap-3"
          style={{ backgroundColor: 'transparent' }}
        >
          <Palette size={24} color={accentColors.primary} />
          <ThemedText 
            type="title"
            style={{ color: accentColors.text }}
          >
            Appearance
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ScrollView 
        className="flex-1 px-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Theme Mode Selection */}
        <ThemedView 
          className="mb-8"
          style={{ backgroundColor: accentColors.base }}
        >
          <ThemedText 
            type="subtitle" 
            className="mb-4"
            style={{ color: accentColors.text }}
          >
            Theme Mode
          </ThemedText>
          
          <ThemedView style={{ backgroundColor: accentColors.base }}>
            <ThemeOption
              title="System Accent Color"
              description="Automatically matches your device's accent color (Android 12+)"
              isSelected={settings.themeMode === 'system'}
              onSelect={() => handleThemeModeSelect('system')}
              isFirst
              accentColors={accentColors}
            />
            
            <ThemeOption
              title="Catppuccin Theme"
              description="Latte & Mocha themes with selectable accent colors"
              isSelected={settings.themeMode === 'catppuccin'}
              onSelect={() => handleThemeModeSelect('catppuccin')}
              accentColors={accentColors}
            />
            
            <ThemeOption
              title="Nothing Theme"
              description="Dark / Light theme with red Nothing accent"
              isSelected={settings.themeMode === 'nothing'}
              onSelect={() => handleThemeModeSelect('nothing')}
              isLast
              accentColors={accentColors}
            />
          </ThemedView>
        </ThemedView>

        {/* Catppuccin Accent Colors */}
        {settings.themeMode === 'catppuccin' && (
          <ThemedView 
            className="mb-8"
            style={{ backgroundColor: accentColors.base }}
          >
            <ThemedText 
              type="subtitle" 
              className="mb-4"
              style={{ color: accentColors.text }}
            >
              Catppuccin Accent Colors
            </ThemedText>
            <ThemedText 
              className="mb-6"
              style={{ color: accentColors.subtext0 }}
            >
              Choose your favorite Catppuccin accent color
            </ThemedText>
            
            <View className="flex-row flex-wrap justify-between">
              {CATPPUCCIN_ACCENT_OPTIONS.map((option) => (
                <CatppuccinColorOption
                  key={option.value}
                  name={option.name}
                  colorKey={option.value}
                  colorValue={getCatppuccinColorValue(option.value)}
                  isSelected={settings.catppuccinAccent === option.value}
                  onSelect={handleCatppuccinAccentSelect}
                  accentColors={accentColors}
                />
              ))}
            </View>
          </ThemedView>
        )}

        {/* Preview Section */}
        <ThemedView 
          className="mb-8"
          style={{ backgroundColor: accentColors.base }}
        >
          <ThemedText 
            type="subtitle" 
            className="mb-4"
            style={{ color: accentColors.text }}
          >
            Preview
          </ThemedText>
          
          <ThemedView 
            className="rounded-xl p-6"
            style={{ 
              backgroundColor: accentColors.surface,
              borderWidth: 1,
              borderColor: accentColors.surface
            }}
          >
            <ThemedText 
              className="mb-4"
              style={{ color: accentColors.subtext0 }}
            >
              Current theme in action:
            </ThemedText>
            
            {/* Preview Button */}
            <TouchableOpacity
              className="py-3 px-6 rounded-lg mb-4 items-center"
              style={{ backgroundColor: accentColors.primary }}
              disabled
            >
              <ThemedText 
                className="font-semibold"
                style={{ color: accentColors.crust }}
              >
                Sample Button
              </ThemedText>
            </TouchableOpacity>
            
            {/* Preview Card */}
            <ThemedView 
              className="rounded-lg p-4"
              style={{ 
                backgroundColor: accentColors.mantle,
                borderWidth: 1,
                borderColor: accentColors.primary
              }}
            >
              <ThemedText 
                className="font-semibold mb-2"
                style={{ color: accentColors.primary }}
              >
                Recipe Card Preview
              </ThemedText>
              <ThemedText style={{ color: accentColors.subtext1 }}>
                This is how recipe cards will look with your selected theme and accent color.
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Instructions */}
        <ThemedView 
          className="mb-8 rounded-xl p-4"
          style={{ backgroundColor: accentColors.surface }}
        >
          <ThemedText 
            type="bold" 
            className="mb-2"
            style={{ color: accentColors.text }}
          >
            💡 Theme Information
          </ThemedText>
          <ThemedText 
            className="text-sm leading-5"
            style={{ color: accentColors.subtext1 }}
          >
            {settings.themeMode === 'system' 
              ? "Your app adapts to your device's system accent color. Changes may require an app restart to fully take effect."
              : settings.themeMode === 'catppuccin'
                ? `Using Catppuccin ${colorScheme === 'dark' ? 'Mocha' : 'Latte'} theme with ${CATPPUCCIN_ACCENT_OPTIONS.find(opt => opt.value === settings.catppuccinAccent)?.name || 'Mauve'} accent.`
                : "Using Nothing theme with signature red accent color."
            }
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}