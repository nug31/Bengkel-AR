import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Bell, Globe, Shield, CircleHelp as HelpCircle, Star, Award, TrendingUp, ChevronRight, LogOut, CreditCard as Edit3 } from 'lucide-react-native';

const PROFILE_STATS = [
  { label: 'Pelajaran Selesai', value: '24', icon: Award, color: '#10B981' },
  { label: 'Diagnosis Sukses', value: '12', icon: TrendingUp, color: '#3B82F6' },
  { label: 'Rating Rata-rata', value: '4.8', icon: Star, color: '#F59E0B' },
];

const MENU_ITEMS = [
  {
    id: 1,
    title: 'Pengaturan Akun',
    subtitle: 'Edit profil dan preferensi',
    icon: User,
    hasSwitch: false,
  },
  {
    id: 2,
    title: 'Notifikasi',
    subtitle: 'Atur pemberitahuan aplikasi',
    icon: Bell,
    hasSwitch: true,
    switchValue: true,
  },
  {
    id: 3,
    title: 'Bahasa',
    subtitle: 'Indonesia',
    icon: Globe,
    hasSwitch: false,
  },
  {
    id: 4,
    title: 'Mode Gelap',
    subtitle: 'Sesuaikan tampilan aplikasi',
    icon: Settings,
    hasSwitch: true,
    switchValue: true,
  },
  {
    id: 5,
    title: 'Privasi & Keamanan',
    subtitle: 'Kelola data dan keamanan',
    icon: Shield,
    hasSwitch: false,
  },
  {
    id: 6,
    title: 'Bantuan & Dukungan',
    subtitle: 'FAQ dan kontak support',
    icon: HelpCircle,
    hasSwitch: false,
  },
];

const LANGUAGE_OPTIONS = [
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'jv', name: 'Bahasa Jawa', flag: '☕' },
  { code: 'su', name: 'Bahasa Sunda', flag: '🏔️' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
];

export default function ProfileScreen() {
  const [switchStates, setSwitchStates] = useState({
    2: true, // Notifications
    4: true, // Dark mode
  });
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('id');

  const toggleSwitch = (itemId) => {
    setSwitchStates(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleMenuPress = (item) => {
    if (item.id === 3) {
      setShowLanguages(!showLanguages);
    }
  };

  if (showLanguages) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#1F2937', '#374151']}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowLanguages(false)}
          >
            <Text style={styles.backButtonText}>← Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pilih Bahasa</Text>
        </LinearGradient>

        <ScrollView style={styles.content}>
          {LANGUAGE_OPTIONS.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageOption,
                selectedLanguage === language.code && styles.languageOptionSelected
              ]}
              onPress={() => setSelectedLanguage(language.code)}
            >
              <Text style={styles.languageFlag}>{language.flag}</Text>
              <Text style={[
                styles.languageName,
                selectedLanguage === language.code && styles.languageNameSelected
              ]}>
                {language.name}
              </Text>
              {selectedLanguage === language.code && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#374151']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Profil</Text>
        <Text style={styles.headerSubtitle}>Kelola akun dan pengaturan</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={['#DC2626', '#EF4444']}
            style={styles.profileGradient}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <User size={40} color="#FFFFFF" />
                </View>
                <TouchableOpacity style={styles.editButton}>
                  <Edit3 size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>Bengkel User</Text>
                <Text style={styles.userEmail}>user@bengkel.id</Text>
                <Text style={styles.memberSince}>Member sejak Jan 2024</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistik Aktivitas</Text>
          <View style={styles.statsContainer}>
            {PROFILE_STATS.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                  <stat.icon size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pengaturan</Text>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item)}
            >
              <View style={styles.menuIcon}>
                <item.icon size={20} color="#9CA3AF" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              {item.hasSwitch ? (
                <Switch
                  value={switchStates[item.id] || false}
                  onValueChange={() => toggleSwitch(item.id)}
                  trackColor={{ false: '#374151', true: '#DC2626' }}
                  thumbColor={switchStates[item.id] ? '#FFFFFF' : '#9CA3AF'}
                />
              ) : (
                <ChevronRight size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aplikasi</Text>
          <View style={styles.appInfo}>
            <Text style={styles.appName}>AR Bengkelku</Text>
            <Text style={styles.appVersion}>Versi 1.0.0</Text>
            <Text style={styles.appDescription}>
              Aplikasi panduan perbaikan kendaraan dengan teknologi AR dan AI assistant
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut size={20} color="#DC2626" />
            <Text style={styles.logoutText}>Keluar dari Akun</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 32,
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileGradient: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  appInfo: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    gap: 16,
  },
  languageOptionSelected: {
    borderWidth: 2,
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  languageFlag: {
    fontSize: 24,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  languageNameSelected: {
    color: '#10B981',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});