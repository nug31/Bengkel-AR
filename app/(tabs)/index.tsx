import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ARCamera from '@/components/ARCamera';

interface DetectedComponent {
  id: number;
  name: string;
  description: string;
  position: { x: number; y: number };
  status: 'normal' | 'warning' | 'error';
  confidence: number;
}

export default function ARScanScreen() {
  const [scanResults, setScanResults] = useState<DetectedComponent[]>([]);

  const handleComponentDetected = (component: DetectedComponent) => {
    console.log('Component detected:', component);
  };

  const handleScanComplete = (components: DetectedComponent[]) => {
    setScanResults(components);
    console.log('Scan complete:', components);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#374151']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>AR Bengkelku</Text>
        <Text style={styles.headerSubtitle}>Arahkan kamera ke komponen kendaraan</Text>
      </LinearGradient>

      <ARCamera
        onComponentDetected={handleComponentDetected}
        onScanComplete={handleScanComplete}
      />
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
    textAlign: 'center',
  },
});