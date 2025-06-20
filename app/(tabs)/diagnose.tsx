import React, { useState } from 'react';
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
import { Search, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Wrench, Car, Recycle as Motorcycle, ChevronRight, TrendingUp, Circle as XCircle, Zap, Shield } from 'lucide-react-native';
import { DiagnosisEngine, SYMPTOMS_DATABASE, type DiagnosisResult } from '@/components/DiagnosisEngine';

const VEHICLE_TYPES = [
  { id: 'car', name: 'Mobil', icon: Car },
  { id: 'motorcycle', name: 'Motor', icon: Motorcycle },
];

export default function DiagnoseScreen() {
  const [selectedVehicle, setSelectedVehicle] = useState('car');
  const [searchText, setSearchText] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([]);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredSymptoms = SYMPTOMS_DATABASE.filter(item =>
    item.symptom.toLowerCase().includes(searchText.toLowerCase()) ||
    item.category.toLowerCase().includes(searchText.toLowerCase()) ||
    item.keywords.some(keyword => keyword.toLowerCase().includes(searchText.toLowerCase()))
  );

  const toggleSymptom = (symptomId: number) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomId)) {
        return prev.filter(id => id !== symptomId);
      } else {
        return [...prev, symptomId];
      }
    });
  };

  const runDiagnosis = () => {
    if (selectedSymptoms.length === 0) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis time
    setTimeout(() => {
      const result = DiagnosisEngine.diagnose(selectedSymptoms);
      if (result) {
        setDiagnosisResult(result);
        setShowResult(true);
      }
      setIsAnalyzing(false);
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#DC2626';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return 'Tinggi';
      case 'medium': return 'Sedang';
      case 'low': return 'Rendah';
      default: return 'Normal';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return '#DC2626';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return XCircle;
    }
  };

  if (isAnalyzing) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#1F2937', '#374151']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Menganalisis...</Text>
          <Text style={styles.headerSubtitle}>AI sedang memproses diagnosis</Text>
        </LinearGradient>

        <View style={styles.analyzingContainer}>
          <LinearGradient
            colors={['#7C3AED', '#A855F7']}
            style={styles.analyzingCard}
          >
            <Zap size={48} color="#FFFFFF" />
            <Text style={styles.analyzingTitle}>Diagnosis AI Aktif</Text>
            <Text style={styles.analyzingText}>
              Menganalisis {selectedSymptoms.length} gejala yang dipilih...
            </Text>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </LinearGradient>
        </View>
      </SafeAreaView>
    );
  }

  if (showResult && diagnosisResult) {
    const UrgencyIcon = getUrgencyIcon(diagnosisResult.overallUrgency);
    
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#1F2937', '#374151']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Hasil Diagnosis AI</Text>
          <Text style={styles.headerSubtitle}>Analisis lengkap masalah kendaraan</Text>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Main Problem Card */}
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <UrgencyIcon size={32} color={getUrgencyColor(diagnosisResult.overallUrgency)} />
              <View style={styles.resultInfo}>
                <Text style={styles.resultTitle}>{diagnosisResult.problem}</Text>
                <View style={[
                  styles.urgencyBadge,
                  { backgroundColor: getUrgencyColor(diagnosisResult.overallUrgency) }
                ]}>
                  <Text style={styles.urgencyText}>
                    Urgensi: {diagnosisResult.overallUrgency === 'high' ? 'Tinggi' : 
                             diagnosisResult.overallUrgency === 'medium' ? 'Sedang' : 'Rendah'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Possible Causes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kemungkinan Penyebab</Text>
            {diagnosisResult.possibleCauses.map((item, index) => (
              <View key={index} style={styles.causeCard}>
                <View style={styles.causeHeader}>
                  <View style={styles.causeInfo}>
                    <Text style={styles.causeName}>{item.cause}</Text>
                    <View style={[
                      styles.urgencyIndicator,
                      { backgroundColor: getUrgencyColor(item.urgency) }
                    ]}>
                      <Text style={styles.urgencyIndicatorText}>
                        {item.urgency === 'high' ? 'URGENT' : 
                         item.urgency === 'medium' ? 'PERHATIAN' : 'NORMAL'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.probabilityBadge}>
                    <TrendingUp size={14} color="#FFFFFF" />
                    <Text style={styles.probabilityText}>{item.probability}%</Text>
                  </View>
                </View>
                <Text style={styles.solutionText}>{item.solution}</Text>
                <View style={styles.costContainer}>
                  <Text style={styles.costLabel}>Estimasi Biaya:</Text>
                  <Text style={styles.costText}>{item.estimatedCost}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Recommendations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rekomendasi AI</Text>
            <View style={styles.recommendationsCard}>
              {diagnosisResult.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Shield size={16} color="#10B981" />
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Cost Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ringkasan Biaya</Text>
            <View style={styles.costCard}>
              <LinearGradient
                colors={['#059669', '#10B981']}
                style={styles.costGradient}
              >
                <Text style={styles.costAmount}>{diagnosisResult.estimatedCostRange}</Text>
                <Text style={styles.costNote}>
                  *Estimasi berdasarkan analisis AI dan data bengkel
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setShowResult(false);
                setSelectedSymptoms([]);
                setDiagnosisResult(null);
              }}
            >
              <Text style={styles.backButtonText}>Diagnosis Baru</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton}>
              <LinearGradient
                colors={['#DC2626', '#EF4444']}
                style={styles.primaryButtonGradient}
              >
                <Wrench size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Cari Bengkel</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
        <Text style={styles.headerTitle}>Diagnosis AI</Text>
        <Text style={styles.headerSubtitle}>Identifikasi masalah dengan kecerdasan buatan</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Vehicle Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jenis Kendaraan</Text>
          <View style={styles.vehicleTypes}>
            {VEHICLE_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.vehicleType,
                  selectedVehicle === type.id && styles.vehicleTypeSelected
                ]}
                onPress={() => setSelectedVehicle(type.id)}
              >
                <type.icon 
                  size={24} 
                  color={selectedVehicle === type.id ? '#FFFFFF' : '#9CA3AF'} 
                />
                <Text style={[
                  styles.vehicleTypeName,
                  selectedVehicle === type.id && styles.vehicleTypeNameSelected
                ]}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Search Symptoms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cari Gejala</Text>
          <View style={styles.searchContainer}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari berdasarkan gejala, kategori, atau kata kunci..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Symptoms Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Pilih Gejala ({selectedSymptoms.length} dipilih)
          </Text>
          {filteredSymptoms.map((symptom) => (
            <TouchableOpacity
              key={symptom.id}
              style={[
                styles.symptomCard,
                selectedSymptoms.includes(symptom.id) && styles.symptomCardSelected
              ]}
              onPress={() => toggleSymptom(symptom.id)}
            >
              <View style={styles.symptomInfo}>
                <Text style={[
                  styles.symptomText,
                  selectedSymptoms.includes(symptom.id) && styles.symptomTextSelected
                ]}>
                  {symptom.symptom}
                </Text>
                <View style={styles.symptomMeta}>
                  <Text style={styles.symptomCategory}>{symptom.category}</Text>
                  <View style={[
                    styles.severityBadge,
                    { backgroundColor: getSeverityColor(symptom.severity) }
                  ]}>
                    <Text style={styles.severityText}>
                      {getSeverityText(symptom.severity)}
                    </Text>
                  </View>
                </View>
              </View>
              {selectedSymptoms.includes(symptom.id) ? (
                <CheckCircle size={24} color="#10B981" />
              ) : (
                <ChevronRight size={24} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* AI Diagnosis Button */}
        {selectedSymptoms.length > 0 && (
          <View style={styles.diagnosisButtonContainer}>
            <TouchableOpacity
              style={styles.diagnosisButton}
              onPress={runDiagnosis}
            >
              <LinearGradient
                colors={['#7C3AED', '#A855F7']}
                style={styles.diagnosisButtonGradient}
              >
                <Zap size={24} color="#FFFFFF" />
                <Text style={styles.diagnosisButtonText}>Mulai Diagnosis AI</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
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
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  vehicleTypes: {
    flexDirection: 'row',
    gap: 12,
  },
  vehicleType: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#374151',
    borderRadius: 12,
    gap: 8,
  },
  vehicleTypeSelected: {
    backgroundColor: '#DC2626',
  },
  vehicleTypeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#9CA3AF',
  },
  vehicleTypeNameSelected: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  symptomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  symptomCardSelected: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  symptomInfo: {
    flex: 1,
  },
  symptomText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  symptomTextSelected: {
    color: '#10B981',
  },
  symptomMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  symptomCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  diagnosisButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  diagnosisButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  diagnosisButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  diagnosisButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  analyzingCard: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 20,
    width: '100%',
  },
  analyzingTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  analyzingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    width: '70%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  resultCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  urgencyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  causeCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  causeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  causeInfo: {
    flex: 1,
    marginRight: 12,
  },
  causeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  urgencyIndicator: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  urgencyIndicatorText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  probabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  probabilityText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  solutionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 8,
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  costLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  costText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  recommendationsCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  costCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  costGradient: {
    padding: 20,
    alignItems: 'center',
  },
  costAmount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  costNote: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  backButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#374151',
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});