import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic, MicOff, Volume2 } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

// Import voice for mobile
const Voice = Platform.OS !== 'web' ? require('@react-native-community/voice').default : null;

interface VoiceRecognitionProps {
  onVoiceResult: (text: string) => void;
  onListeningChange: (isListening: boolean) => void;
  isEnabled?: boolean;
}

// Mock voice recognition responses for demo
const VOICE_RESPONSES = [
  'bagaimana cara ganti oli',
  'kenapa mesin overheat',
  'cara check aki mobil',
  'suara mesin kasar',
  'rem blong penyebabnya',
  'ac mobil tidak dingin'
];

export default function VoiceRecognition({ 
  onVoiceResult, 
  onListeningChange, 
  isEnabled = true 
}: VoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const waveAnimation = useSharedValue(0);
  const micAnimation = useSharedValue(1);

  const waveAnimatedStyle = useAnimatedStyle(() => ({
    opacity: waveAnimation.value,
  }));

  const micAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micAnimation.value }],
  }));

  // --- Voice Recognition Handlers ---
  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (!Voice) return;
    Voice.onSpeechResults = (e: any) => {
      setIsListening(false);
      setIsProcessing(false);
      onListeningChange(false);
      if (e.value && e.value.length > 0) {
        onVoiceResult(e.value[0]);
      }
    };
    Voice.onSpeechError = (e: any) => {
      setIsListening(false);
      setIsProcessing(false);
      setError('Voice error: ' + (e.error?.message || 'Unknown error'));
      onListeningChange(false);
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    if (isListening) {
      waveAnimation.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.3, { duration: 500 }),
          withTiming(0.8, { duration: 300 }),
          withTiming(0.1, { duration: 400 })
        ),
        -1,
        false
      );
      micAnimation.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        false
      );
    } else {
      waveAnimation.value = withTiming(0);
      micAnimation.value = withTiming(1);
    }
  }, [isListening]);

  // --- Start Listening ---
  const startListening = async () => {
    setError(null);
    if (!isEnabled) return;
    setIsListening(true);
    setIsProcessing(false);
    onListeningChange(true);
    if (Platform.OS === 'web') {
      // Web Speech API
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'id-ID';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.onresult = (event: any) => {
          setIsListening(false);
          setIsProcessing(false);
          onListeningChange(false);
          if (event.results && event.results[0] && event.results[0][0]) {
            onVoiceResult(event.results[0][0].transcript);
          }
        };
        recognition.onerror = (event: any) => {
          setIsListening(false);
          setIsProcessing(false);
          setError('Voice error: ' + event.error);
          onListeningChange(false);
        };
        recognition.onend = () => {
          setIsListening(false);
          setIsProcessing(false);
          onListeningChange(false);
        };
        recognition.start();
      } else {
        // Fallback: Simulate
        setTimeout(() => {
          setIsListening(false);
          setIsProcessing(true);
          setTimeout(() => {
            const randomResponse = VOICE_RESPONSES[Math.floor(Math.random() * VOICE_RESPONSES.length)];
            onVoiceResult(randomResponse);
            setIsProcessing(false);
            onListeningChange(false);
          }, 1000);
        }, 3000);
      }
    } else {
      // Mobile: Use react-native-voice
      try {
        await Voice.start('id-ID');
      } catch (e: any) {
        setIsListening(false);
        setIsProcessing(false);
        setError('Voice error: ' + (e.message || 'Unknown error'));
        onListeningChange(false);
      }
    }
  };

  // --- Stop Listening ---
  const stopListening = async () => {
    setIsListening(false);
    setIsProcessing(false);
    onListeningChange(false);
    if (Platform.OS === 'web') {
      // Web Speech API: not needed, handled by onend
    } else {
      try {
        await Voice.stop();
      } catch {}
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getStatusText = () => {
    if (error) return error;
    if (isProcessing) return 'Memproses...';
    if (isListening) return 'Mendengarkan...';
    return 'Tekan untuk berbicara';
  };

  const getButtonColors = ():[string, string] => {
    if (isProcessing) return ['#F59E0B', '#FBBF24'];
    if (isListening) return ['#7C3AED', '#A855F7'];
    return ['#DC2626', '#EF4444'];
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.micButton, !isEnabled && styles.micButtonDisabled]}
        onPress={toggleListening}
        disabled={!isEnabled || isProcessing}
      >
        <Animated.View style={[styles.micButtonInner, micAnimatedStyle]}>
          {/* Voice Wave Animation */}
          {isListening && (
            <>
              <Animated.View style={[styles.voiceWave, styles.wave1, waveAnimatedStyle]} />
              <Animated.View style={[styles.voiceWave, styles.wave2, waveAnimatedStyle]} />
              <Animated.View style={[styles.voiceWave, styles.wave3, waveAnimatedStyle]} />
            </>
          )}
          
          <LinearGradient
            colors={getButtonColors()}
            style={styles.micGradient}
          >
            {isListening ? (
              <MicOff size={32} color="#FFFFFF" />
            ) : isProcessing ? (
              <Volume2 size={32} color="#FFFFFF" />
            ) : (
              <Mic size={32} color="#FFFFFF" />
            )}
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
      
      <Text style={[styles.statusText, !isEnabled && styles.statusTextDisabled]}>
        {isEnabled ? getStatusText() : 'Voice tidak tersedia'}
      </Text>
      
      {Platform.OS === 'web' && (
        <Text style={styles.webNote}>
          *Voice recognition aktif (Web Speech API jika tersedia, fallback simulasi)
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  micButton: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonDisabled: {
    opacity: 0.5,
  },
  micButtonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  voiceWave: {
    position: 'absolute',
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  wave1: {
    width: 100,
    height: 100,
  },
  wave2: {
    width: 120,
    height: 120,
  },
  wave3: {
    width: 140,
    height: 140,
  },
  micGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginTop: 12,
    textAlign: 'center',
  },
  statusTextDisabled: {
    color: '#6B7280',
  },
  webNote: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
});