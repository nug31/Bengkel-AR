import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Volume2, Bot, User, MessageCircle, Wrench, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import VoiceRecognition from '@/components/VoiceRecognition';
import { DiagnosisEngine } from '@/components/DiagnosisEngine';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  text: string;
  timestamp: string;
  hasAudio?: boolean;
}

const MOCK_RESPONSES = {
  'bagaimana cara ganti oli': 'Untuk mengganti oli mesin:\n\n1. **Persiapan:**\n   • Panaskan mesin 5-10 menit\n   • Matikan mesin dan tunggu dingin\n   • Siapkan alat: kunci pas, wadah, oli baru\n\n2. **Langkah-langkah:**\n   • Buka baut pembuangan oli di bawah mesin\n   • Tunggu oli lama keluar semua\n   • Ganti filter oli (jika perlu)\n   • Pasang kembali baut pembuangan\n   • Isi oli baru melalui lubang pengisian\n   • Periksa level oli dengan dipstick\n\n3. **Tips:**\n   • Gunakan oli sesuai spesifikasi kendaraan\n   • Ganti oli setiap 5.000-10.000 km\n   • Buang oli bekas di tempat yang tepat',

  'kenapa mesin overheat': 'Penyebab mesin overheat dan solusinya:\n\n**Penyebab Umum:**\n1. **Radiator bermasalah** (40%)\n   • Tersumbat kotoran/kerak\n   • Bocor atau retak\n   • Solusi: Kuras radiator, perbaiki kebocoran\n\n2. **Kipas radiator rusak** (25%)\n   • Motor kipas mati\n   • Relay rusak\n   • Solusi: Ganti kipas atau relay\n\n3. **Thermostat macet** (20%)\n   • Tidak membuka saat panas\n   • Solusi: Ganti thermostat baru\n\n4. **Pompa air rusak** (15%)\n   • Tidak mensirkulasi coolant\n   • Solusi: Ganti water pump\n\n**Pencegahan:**\n• Periksa level coolant rutin\n• Service sistem pendingin 6 bulan sekali\n• Jangan buka tutup radiator saat panas',

  'cara check aki': 'Cara pemeriksaan aki mobil:\n\n**1. Pemeriksaan Visual:**\n   • Periksa terminal (tidak berkarat/longgar)\n   • Cek kondisi fisik aki (tidak retak/bengkak)\n   • Lihat level air aki (jika bisa dibuka)\n\n**2. Test Tegangan:**\n   • Gunakan multimeter/voltmeter\n   • Tegangan normal: 12.4-12.6V (mesin mati)\n   • Tegangan charging: 13.5-14.5V (mesin hidup)\n\n**3. Test Beban:**\n   • Nyalakan lampu utama 2-3 menit\n   • Tegangan tidak boleh turun drastis\n   • Jika turun <11V, aki lemah\n\n**4. Tanda Aki Rusak:**\n   • Starter lambat/susah\n   • Lampu redup saat starter\n   • Aki sering tekor\n   • Usia >3 tahun\n\n**Perawatan:**\n• Bersihkan terminal rutin\n• Isi air aki jika perlu\n• Charge aki jika jarang dipakai',

  'suara mesin kasar': 'Penyebab dan solusi suara mesin kasar:\n\n**Diagnosis Berdasarkan Suara:**\n\n1. **Suara Ketukan (Knocking):**\n   • Penyebab: Oktan BBM rendah, carbon build-up\n   • Solusi: Gunakan BBM oktan tinggi, carbon cleaning\n\n2. **Suara Gemuruh:**\n   • Penyebab: Oli kotor/habis, bearing aus\n   • Solusi: Ganti oli, periksa bearing\n\n3. **Suara Berdecit:**\n   • Penyebab: Belt kendor/aus\n   • Solusi: Setel atau ganti belt\n\n4. **Suara Tidak Rata:**\n   • Penyebab: Busi rusak, injector kotor\n   • Solusi: Ganti busi, bersihkan injector\n\n**Langkah Pemeriksaan:**\n• Periksa level oli mesin\n• Dengarkan sumber suara\n• Periksa RPM idle (700-900 RPM)\n• Test drive untuk konfirmasi\n\n**Peringatan:**\nJika suara makin parah, segera matikan mesin dan bawa ke bengkel!',

  'rem blong penyebabnya': '⚠️ **BAHAYA - REM BLONG!**\n\n**Penyebab Utama:**\n\n1. **Minyak Rem Habis/Bocor** (45%)\n   • Kebocoran selang rem\n   • Master rem bocor\n   • Solusi: Isi minyak rem, perbaiki kebocoran\n\n2. **Kampas Rem Habis** (30%)\n   • Aus hingga logam\n   • Solusi: Ganti kampas rem segera\n\n3. **Udara dalam Sistem** (15%)\n   • Sistem rem tidak di-bleeding\n   • Solusi: Bleeding sistem rem\n\n4. **Master Rem Rusak** (10%)\n   • Seal rusak, tidak ada tekanan\n   • Solusi: Ganti master rem\n\n**TINDAKAN DARURAT:**\n🚨 **SEGERA BERHENTI BERKENDARA!**\n• Gunakan rem tangan\n• Pindah gigi rendah untuk engine brake\n• Cari bengkel terdekat\n\n**Pencegahan:**\n• Periksa minyak rem bulanan\n• Ganti kampas rem sesuai jadwal\n• Test rem sebelum berkendara jauh\n\n**JANGAN DIABAIKAN - KESELAMATAN UTAMA!**',

  'ac mobil tidak dingin': 'Penyebab AC mobil tidak dingin:\n\n**Diagnosis Bertahap:**\n\n1. **Periksa Dasar:**\n   • Pastikan AC menyala (kompresor jalan)\n   • Cek setting temperature dan fan speed\n   • Periksa filter AC (cabin filter)\n\n2. **Penyebab Umum:**\n\n   **Freon Habis/Bocor** (50%)\n   • Gejala: Angin keluar tapi tidak dingin\n   • Solusi: Isi freon, cari dan perbaiki kebocoran\n   • Biaya: Rp 150.000 - 500.000\n\n   **Filter AC Kotor** (25%)\n   • Gejala: Angin lemah, bau tidak sedap\n   • Solusi: Ganti cabin filter\n   • Biaya: Rp 50.000 - 150.000\n\n   **Kompresor Rusak** (15%)\n   • Gejala: Kompresor tidak jalan\n   • Solusi: Service/ganti kompresor\n   • Biaya: Rp 800.000 - 2.500.000\n\n   **Kondensor Kotor** (10%)\n   • Gejala: AC dingin sebentar lalu panas\n   • Solusi: Cuci kondensor\n   • Biaya: Rp 100.000 - 200.000\n\n**Tips Perawatan:**\n• Nyalakan AC 10 menit setiap minggu\n• Ganti filter AC setiap 6 bulan\n• Service AC tahunan\n• Parkir di tempat teduh'
};

const COMMON_QUESTIONS = [
  'Bagaimana cara ganti oli?',
  'Kenapa mesin overheat?',
  'Cara check aki mobil',
  'Suara mesin kasar',
  'Rem blong penyebabnya',
  'AC mobil tidak dingin',
  'Cara service berkala',
  'Ganti kampas rem',
  'Periksa timing belt',
  'Masalah starter'
];

export default function VoiceAssistantScreen() {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      text: 'Halo! Saya asisten bengkel virtual Anda. 🔧\n\nSaya bisa membantu:\n• Diagnosis masalah kendaraan\n• Panduan perbaikan step-by-step\n• Tips perawatan rutin\n• Estimasi biaya perbaikan\n\nTanyakan masalah kendaraan atau gunakan voice command!',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      hasAudio: true
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleVoiceInput = (recognizedText: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      text: recognizedText,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Generate AI response
    setTimeout(() => {
      generateResponse(recognizedText);
    }, 1000);
  };

  const generateResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    let response = '';
    let hasAudio = false;

    // Check for exact matches first
    const exactMatch = Object.keys(MOCK_RESPONSES).find(key => 
      lowerInput.includes(key.toLowerCase())
    );

    if (exactMatch) {
      response = MOCK_RESPONSES[exactMatch as keyof typeof MOCK_RESPONSES];
      hasAudio = true;
    } else {
      // Try diagnosis engine for symptom-based queries
      const diagnosisResult = DiagnosisEngine.diagnoseByText(userInput);
      
      if (diagnosisResult) {
        response = `**${diagnosisResult.problem}**\n\n`;
        response += `**Kemungkinan Penyebab:**\n\n`;
        
        diagnosisResult.possibleCauses.forEach((cause, index) => {
          const urgencyIcon = cause.urgency === 'high' ? '🚨' : 
                             cause.urgency === 'medium' ? '⚠️' : 'ℹ️';
          response += `${index + 1}. **${cause.cause}** (${cause.probability}%) ${urgencyIcon}\n`;
          response += `   • ${cause.solution}\n`;
          response += `   • Biaya: ${cause.estimatedCost}\n\n`;
        });

        response += `**Rekomendasi:**\n`;
        diagnosisResult.recommendations.forEach(rec => {
          response += `• ${rec}\n`;
        });

        response += `\n**Estimasi Total: ${diagnosisResult.estimatedCostRange}**`;
        hasAudio = true;
      } else {
        // Generic helpful response
        response = `Maaf, saya belum memahami pertanyaan "${userInput}" dengan baik. 🤔\n\nCoba tanyakan dengan cara lain atau pilih dari pertanyaan umum di bawah:\n\n• Masalah mesin (tidak hidup, kasar, overheat)\n• Masalah rem (blong, tidak pakem)\n• Masalah kelistrikan (aki, lampu)\n• Masalah AC (tidak dingin)\n• Perawatan rutin\n\nAtau gunakan voice command untuk pertanyaan yang lebih spesifik!`;
      }
    }

    const assistantMessage: Message = {
      id: messages.length + 2,
      type: 'assistant',
      text: response,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      hasAudio
    };
    
    setMessages(prev => [...prev, assistantMessage]);
  };

  const sendTextMessage = () => {
    if (inputText.trim()) {
      handleVoiceInput(inputText);
      setInputText('');
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleVoiceInput(question);
  };

  const playAudio = (text: string) => {
    setIsPlaying(true);
    // Simulate TTS playback
    setTimeout(() => setIsPlaying(false), 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#374151']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Voice Assistant</Text>
        <Text style={styles.headerSubtitle}>Asisten Bengkel Virtual AI</Text>
      </LinearGradient>

      <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.type === 'user' ? styles.userMessage : styles.assistantMessage
            ]}
          >
            <View style={styles.messageHeader}>
              <View style={styles.messageIcon}>
                {message.type === 'user' ? (
                  <User size={16} color="#FFFFFF" />
                ) : (
                  <Bot size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.messageTime}>{message.timestamp}</Text>
              {message.type === 'assistant' && message.hasAudio && (
                <TouchableOpacity
                  onPress={() => playAudio(message.text)}
                  style={styles.playButton}
                >
                  <Volume2 size={16} color={isPlaying ? '#DC2626' : '#9CA3AF'} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Quick Questions */}
      <View style={styles.quickQuestions}>
        <Text style={styles.quickQuestionsTitle}>Pertanyaan Umum:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.quickQuestionsContainer}>
            {COMMON_QUESTIONS.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickQuestionButton}
                onPress={() => handleQuickQuestion(question)}
              >
                <Text style={styles.quickQuestionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Voice Control */}
      <VoiceRecognition
        onVoiceResult={handleVoiceInput}
        onListeningChange={setIsListening}
        isEnabled={true}
      />

      {/* Text Input */}
      <View style={styles.textInput}>
        <View style={styles.inputContainer}>
          <MessageCircle size={20} color="#9CA3AF" />
          <TextInput
            style={styles.textInputField}
            placeholder="Ketik pertanyaan Anda..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            onSubmitEditing={sendTextMessage}
          />
          <TouchableOpacity 
            onPress={sendTextMessage}
            style={[styles.sendButton, { opacity: inputText.trim() ? 1 : 0.5 }]}
            disabled={!inputText.trim()}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
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
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DC2626',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#374151',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  messageIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    flex: 1,
  },
  playButton: {
    padding: 4,
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  quickQuestions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#9CA3AF',
    marginBottom: 12,
  },
  quickQuestionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  quickQuestionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#374151',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  quickQuestionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  textInput: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#374151',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  textInputField: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
});