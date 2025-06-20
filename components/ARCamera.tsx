import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Camera, 
  Scan, 
  Zap,
  X,
  Info,
  Play
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface DetectedComponent {
  id: number;
  name: string;
  description: string;
  position: { x: number; y: number };
  status: 'normal' | 'warning' | 'error';
  confidence: number;
}

interface ARCameraProps {
  onComponentDetected: (component: DetectedComponent) => void;
  onScanComplete: (components: DetectedComponent[]) => void;
}

const MOCK_COMPONENTS: DetectedComponent[] = [
  {
    id: 1,
    name: 'Mesin',
    description: 'Jantung kendaraan yang mengkonversi bahan bakar menjadi tenaga',
    position: { x: 0.3, y: 0.4 },
    status: 'normal',
    confidence: 0.95
  },
  {
    id: 2,
    name: 'Aki/Battery',
    description: 'Menyimpan dan menyediakan listrik untuk sistem kendaraan',
    position: { x: 0.7, y: 0.3 },
    status: 'warning',
    confidence: 0.87
  },
  {
    id: 3,
    name: 'Radiator',
    description: 'Mendinginkan cairan pendingin mesin',
    position: { x: 0.5, y: 0.6 },
    status: 'normal',
    confidence: 0.92
  },
  {
    id: 4,
    name: 'Filter Udara',
    description: 'Menyaring udara yang masuk ke mesin',
    position: { x: 0.2, y: 0.7 },
    status: 'error',
    confidence: 0.78
  }
];

export default function ARCamera({ onComponentDetected, onScanComplete }: ARCameraProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [detectedComponents, setDetectedComponents] = useState<DetectedComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<DetectedComponent | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  
  const scanAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);

  useEffect(() => {
    scanAnimation.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      false
    );
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );
  }, []);

  const scanAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanAnimation.value * (height * 0.6) }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const startScanning = () => {
    setIsScanning(true);
    setDetectedComponents([]);
    
    // Simulate progressive component detection
    const detectionInterval = setInterval(() => {
      const currentIndex = detectedComponents.length;
      if (currentIndex < MOCK_COMPONENTS.length) {
        const newComponent = MOCK_COMPONENTS[currentIndex];
        setDetectedComponents(prev => [...prev, newComponent]);
        onComponentDetected(newComponent);
      } else {
        clearInterval(detectionInterval);
        setIsScanning(false);
        onScanComplete(MOCK_COMPONENTS);
      }
    }, 800);

    // Stop scanning after all components are detected
    setTimeout(() => {
      clearInterval(detectionInterval);
      setIsScanning(false);
    }, 4000);
  };

  const resetScan = () => {
    setDetectedComponents([]);
    setSelectedComponent(null);
  };

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Kamera diperlukan untuk fitur AR</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Izinkan Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'warning': return '#F59E0B';
      case 'error': return '#DC2626';
      default: return '#10B981';
    }
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        // Mock camera view for web
        <LinearGradient
          colors={['#4B5563', '#6B7280']}
          style={styles.mockCamera}
        >
          {/* Scanning Animation */}
          {isScanning && (
            <Animated.View style={[styles.scanLine, scanAnimatedStyle]} />
          )}

          {/* Detected Components */}
          {detectedComponents.map((component) => (
            <TouchableOpacity
              key={component.id}
              style={[
                styles.componentMarker,
                {
                  left: component.position.x * width - 20,
                  top: component.position.y * (height * 0.6) - 20,
                }
              ]}
              onPress={() => setSelectedComponent(component)}
            >
              <Animated.View style={[styles.markerPulse, pulseAnimatedStyle]}>
                <View style={[
                  styles.marker,
                  { backgroundColor: getStatusColor(component.status) }
                ]} />
              </Animated.View>
              <View style={styles.confidenceIndicator}>
                <Text style={styles.confidenceText}>
                  {Math.round(component.confidence * 100)}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Scan Target Frame */}
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </LinearGradient>
      ) : (
        // Real camera view for mobile
        <CameraView style={styles.camera} facing={facing}>
          {/* Scanning Animation */}
          {isScanning && (
            <Animated.View style={[styles.scanLine, scanAnimatedStyle]} />
          )}

          {/* Detected Components */}
          {detectedComponents.map((component) => (
            <TouchableOpacity
              key={component.id}
              style={[
                styles.componentMarker,
                {
                  left: component.position.x * width - 20,
                  top: component.position.y * (height * 0.6) - 20,
                }
              ]}
              onPress={() => setSelectedComponent(component)}
            >
              <Animated.View style={[styles.markerPulse, pulseAnimatedStyle]}>
                <View style={[
                  styles.marker,
                  { backgroundColor: getStatusColor(component.status) }
                ]} />
              </Animated.View>
              <View style={styles.confidenceIndicator}>
                <Text style={styles.confidenceText}>
                  {Math.round(component.confidence * 100)}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Scan Target Frame */}
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </CameraView>
      )}

      {/* Component Info Panel */}
      {selectedComponent && (
        <View style={styles.infoPanel}>
          <View style={styles.infoPanelHeader}>
            <View style={styles.componentInfo}>
              <Text style={styles.componentName}>{selectedComponent.name}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(selectedComponent.status) }
              ]}>
                <Text style={styles.statusText}>
                  {selectedComponent.status === 'normal' ? 'Normal' : 
                   selectedComponent.status === 'warning' ? 'Perhatian' : 'Bermasalah'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setSelectedComponent(null)}>
              <X size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.componentDescription}>
            {selectedComponent.description}
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Info size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Detail</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
              <Play size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Tutorial</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Control Buttons */}
      <View style={styles.controls}>
        {detectedComponents.length === 0 ? (
          <TouchableOpacity
            style={[styles.scanButton, isScanning && styles.scanButtonActive]}
            onPress={startScanning}
            disabled={isScanning}
          >
            <LinearGradient
              colors={isScanning ? ['#7C3AED', '#A855F7'] : ['#DC2626', '#EF4444']}
              style={styles.scanButtonGradient}
            >
              {isScanning ? (
                <Zap size={24} color="#FFFFFF" />
              ) : (
                <Scan size={24} color="#FFFFFF" />
              )}
              <Text style={styles.scanButtonText}>
                {isScanning ? 'Scanning...' : 'Mulai Scan AR'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.resetButton} onPress={resetScan}>
              <Text style={styles.resetButtonText}>Scan Ulang</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.flipButton} 
              onPress={() => setFacing(current => current === 'back' ? 'front' : 'back')}
            >
              <Camera size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  camera: {
    flex: 1,
  },
  mockCamera: {
    flex: 1,
    position: 'relative',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#DC2626',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    zIndex: 10,
  },
  scanFrame: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    bottom: '20%',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#DC2626',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  componentMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  markerPulse: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  confidenceIndicator: {
    position: 'absolute',
    top: -25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  infoPanel: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#1F2937',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
    zIndex: 30,
  },
  infoPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  componentInfo: {
    flex: 1,
  },
  componentName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  componentDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#374151',
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#DC2626',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 30,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  scanButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  scanButtonActive: {
    opacity: 0.8,
  },
  scanButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  scanButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  resetButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#374151',
    borderRadius: 20,
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  flipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#DC2626',
    borderRadius: 20,
  },
});