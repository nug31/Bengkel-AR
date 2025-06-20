import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Modal,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { Book, Play, Clock, Star, TrendingUp, Award, ChevronRight, CirclePlay as PlayCircle, CircleCheck as CheckCircle, Lock, X } from 'lucide-react-native';

const LEARNING_CATEGORIES = [
  {
    id: 1,
    title: 'Perawatan Dasar',
    description: 'Pelajari dasar-dasar perawatan kendaraan',
    icon: '🔧',
    lessonsCount: 12,
    completedLessons: 9,
    color: ['#DC2626', '#EF4444'],
    progress: 75,
    isUnlocked: true,
  },
  {
    id: 2,
    title: 'Sistem Mesin',
    description: 'Memahami cara kerja mesin kendaraan',
    icon: '⚙️',
    lessonsCount: 18,
    completedLessons: 7,
    color: ['#1E3A8A', '#3B82F6'],
    progress: 40,
    isUnlocked: true,
  },
  {
    id: 3,
    title: 'Sistem Kelistrikan',
    description: 'Pelajari kelistrikan mobil dan motor',
    icon: '⚡',
    lessonsCount: 15,
    completedLessons: 3,
    color: ['#7C3AED', '#A855F7'],
    progress: 20,
    isUnlocked: true,
  },
  {
    id: 4,
    title: 'Sistem Rem',
    description: 'Memahami sistem pengereman',
    icon: '🛑',
    lessonsCount: 10,
    completedLessons: 6,
    color: ['#059669', '#10B981'],
    progress: 60,
    isUnlocked: true,
  },
  {
    id: 5,
    title: 'Diagnosis Lanjutan',
    description: 'Teknik diagnosis masalah kompleks',
    icon: '🔍',
    lessonsCount: 20,
    completedLessons: 0,
    color: ['#B91C1C', '#DC2626'],
    progress: 0,
    isUnlocked: true,
  },
  {
    id: 6,
    title: 'Modifikasi & Tuning',
    description: 'Upgrade performa kendaraan',
    icon: '🏁',
    lessonsCount: 25,
    completedLessons: 0,
    color: ['#7C2D12', '#EA580C'],
    progress: 0,
    isUnlocked: true,
  },
];

const FEATURED_LESSONS = [
  {
    id: 1,
    title: 'Cara Mengganti Oli Mesin',
    description: 'Pelajari langkah-langkah mengganti oli mesin dengan benar dan aman',
    thumbnail: 'https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '15 menit',
    difficulty: 'Pemula',
    rating: 4.8,
    category: 'Perawatan Dasar',
    isCompleted: true,
    isLocked: false,
    videoUrl: 'https://www.youtube.com/embed/6_3-1A0i3-g',
  },
  {
    id: 2,
    title: 'Diagnosis Masalah Aki',
    description: 'Cara mengidentifikasi dan mengatasi masalah aki dengan tools sederhana',
    thumbnail: 'https://images.pexels.com/photos/13065696/pexels-photo-13065696.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '20 menit',
    difficulty: 'Menengah',
    rating: 4.9,
    category: 'Sistem Kelistrikan',
    isCompleted: true,
    isLocked: false,
    videoUrl: 'https://www.youtube.com/embed/f_iJDFEVT9c',
  },
  {
    id: 3,
    title: 'Perawatan Sistem Pendingin',
    description: 'Mencegah overheating dengan perawatan sistem pendingin yang tepat',
    thumbnail: 'https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '25 menit',
    difficulty: 'Menengah',
    rating: 4.7,
    category: 'Sistem Mesin',
    isCompleted: false,
    isLocked: false,
    videoUrl: 'https://www.youtube.com/embed/j1dG4s15pWc',
  },
  {
    id: 4,
    title: 'Troubleshooting ECU',
    description: 'Teknik advanced untuk diagnosis masalah Electronic Control Unit',
    thumbnail: 'https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '45 menit',
    difficulty: 'Lanjutan',
    rating: 4.9,
    category: 'Diagnosis Lanjutan',
    isCompleted: false,
    isLocked: true,
    videoUrl: 'https://www.youtube.com/embed/hZAsoqmqv3g',
  },
];

const ACHIEVEMENTS = [
  { id: 1, title: 'Pemula', description: 'Selesaikan 5 pelajaran', earned: true, icon: '🎯' },
  { id: 2, title: 'Ahli Oli', description: 'Master perawatan dasar', earned: true, icon: '🛢️' },
  { id: 3, title: 'Teknisi Muda', description: 'Selesaikan 25 pelajaran', earned: true, icon: '👨‍🔧' },
  { id: 4, title: 'Master Bengkel', description: 'Selesaikan semua kategori', earned: false, icon: '🏆' },
  { id: 5, title: 'Diagnostician', description: 'Ahli diagnosis masalah', earned: false, icon: '🔬' },
  { id: 6, title: 'Speed Demon', description: 'Master modifikasi', earned: false, icon: '🏎️' },
];

const LEARNING_STATS = {
  totalLessons: 100,
  completedLessons: 25,
  totalHours: 45,
  studyStreak: 7,
  averageScore: 4.8,
  rank: 'Teknisi Muda'
};

export default function LearnScreen() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Pemula': return '#10B981';
      case 'Menengah': return '#F59E0B';
      case 'Lanjutan': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const handleLessonPress = (lesson: any) => {
    if (lesson.isLocked) {
      // Show unlock requirement
      return;
    }
    setSelectedLesson(lesson);
  };

  const handleCategoryPress = (category: any) => {
    if (!category.isUnlocked) {
      // Show unlock requirement
      return;
    }
    setSelectedCategory(category.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#374151']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Belajar</Text>
        <Text style={styles.headerSubtitle}>Tingkatkan skill bengkel dengan AI</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Enhanced Progress Overview */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Progress Belajar</Text>
          <View style={styles.progressCard}>
            <LinearGradient
              colors={['#DC2626', '#EF4444']}
              style={styles.progressGradient}
            >
              <View style={styles.progressHeader}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{LEARNING_STATS.rank}</Text>
                </View>
                <View style={styles.streakBadge}>
                  <Text style={styles.streakText}>🔥 {LEARNING_STATS.studyStreak} hari</Text>
                </View>
              </View>
              <View style={styles.progressStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{LEARNING_STATS.completedLessons}</Text>
                  <Text style={styles.statLabel}>Pelajaran Selesai</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{LEARNING_STATS.totalHours}h</Text>
                  <Text style={styles.statLabel}>Total Waktu</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{LEARNING_STATS.averageScore}</Text>
                  <Text style={styles.statLabel}>Rata-rata Score</Text>
                </View>
              </View>
              <View style={styles.overallProgress}>
                <Text style={styles.overallProgressText}>
                  Progress Keseluruhan: {Math.round((LEARNING_STATS.completedLessons / LEARNING_STATS.totalLessons) * 100)}%
                </Text>
                <View style={styles.overallProgressBar}>
                  <View style={[
                    styles.overallProgressFill, 
                    { width: `${(LEARNING_STATS.completedLessons / LEARNING_STATS.totalLessons) * 100}%` }
                  ]} />
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Enhanced Learning Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategori Pembelajaran</Text>
          <View style={styles.categoriesGrid}>
            {LEARNING_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, !category.isUnlocked && styles.categoryCardLocked]}
                onPress={() => handleCategoryPress(category)}
              >
                <LinearGradient
                  colors={(category.isUnlocked ? category.color : ['#374151', '#4B5563'])}
                  style={styles.categoryGradient}
                >
                  {!category.isUnlocked && (
                    <View style={styles.lockOverlay}>
                      <Lock size={24} color="#9CA3AF" />
                    </View>
                  )}
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[styles.categoryTitle, !category.isUnlocked && styles.categoryTitleLocked]}>
                    {category.title}
                  </Text>
                  <Text style={[styles.categoryDescription, !category.isUnlocked && styles.categoryDescriptionLocked]}>
                    {category.description}
                  </Text>
                  <View style={styles.categoryFooter}>
                    <Text style={[styles.categoryLessons, !category.isUnlocked && styles.categoryLessonsLocked]}>
                      {category.completedLessons}/{category.lessonsCount} pelajaran
                    </Text>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View style={[
                          styles.progressFill, 
                          { 
                            width: `${category.progress}%`,
                            backgroundColor: category.isUnlocked ? '#FFFFFF' : '#6B7280'
                          }
                        ]} />
                      </View>
                      <Text style={[styles.progressText, !category.isUnlocked && styles.progressTextLocked]}>
                        {category.progress}%
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Enhanced Featured Lessons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pelajaran Unggulan</Text>
          {FEATURED_LESSONS.map((lesson) => (
            <TouchableOpacity 
              key={lesson.id} 
              style={[styles.lessonCard, lesson.isLocked && styles.lessonCardLocked]}
              onPress={() => handleLessonPress(lesson)}
            >
              <View style={styles.lessonImageContainer}>
                <Image source={{ uri: lesson.thumbnail }} style={styles.lessonThumbnail} />
                <View style={styles.lessonOverlay}>
                  {lesson.isLocked ? (
                    <Lock size={32} color="#FFFFFF" />
                  ) : lesson.isCompleted ? (
                    <CheckCircle size={32} color="#10B981" />
                  ) : (
                    <PlayCircle size={48} color="#FFFFFF" />
                  )}
                </View>
                {lesson.isCompleted && (
                  <View style={styles.completedBadge}>
                    <CheckCircle size={16} color="#FFFFFF" />
                    <Text style={styles.completedText}>Selesai</Text>
                  </View>
                )}
              </View>
              <View style={styles.lessonContent}>
                <View style={styles.lessonHeader}>
                  <Text style={[styles.lessonTitle, lesson.isLocked && styles.lessonTitleLocked]}>
                    {lesson.title}
                  </Text>
                  <View style={styles.lessonMeta}>
                    <View style={styles.lessonBadge}>
                      <Text style={styles.lessonCategory}>{lesson.category}</Text>
                    </View>
                    <View style={[
                      styles.difficultyBadge, 
                      { backgroundColor: lesson.isLocked ? '#6B7280' : getDifficultyColor(lesson.difficulty) }
                    ]}>
                      <Text style={styles.difficultyText}>{lesson.difficulty}</Text>
                    </View>
                  </View>
                </View>
                <Text style={[styles.lessonDescription, lesson.isLocked && styles.lessonDescriptionLocked]}>
                  {lesson.isLocked ? 'Selesaikan pelajaran sebelumnya untuk membuka' : lesson.description}
                </Text>
                <View style={styles.lessonFooter}>
                  <View style={styles.lessonInfo}>
                    <Clock size={14} color="#9CA3AF" />
                    <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                  </View>
                  <View style={styles.lessonInfo}>
                    <Star size={14} color="#F59E0B" />
                    <Text style={styles.lessonRating}>{lesson.rating}</Text>
                  </View>
                  <ChevronRight size={20} color={lesson.isLocked ? '#6B7280' : '#DC2626'} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Enhanced Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pencapaian</Text>
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map((achievement) => (
              <View key={achievement.id} style={[
                styles.achievementCard,
                achievement.earned && styles.achievementEarned
              ]}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={[
                  styles.achievementTitle,
                  achievement.earned && styles.achievementTitleEarned
                ]}>
                  {achievement.title}
                </Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
                {achievement.earned && (
                  <View style={styles.earnedBadge}>
                    <Award size={12} color="#F59E0B" />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Study Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips Belajar</Text>
          <View style={styles.tipsCard}>
            <LinearGradient
              colors={['#7C3AED', '#A855F7']}
              style={styles.tipsGradient}
            >
              <Text style={styles.tipsTitle}>💡 Tips Hari Ini</Text>
              <Text style={styles.tipsText}>
                Konsistensi adalah kunci! Luangkan 15-30 menit setiap hari untuk belajar. 
                Praktikkan langsung apa yang dipelajari untuk hasil maksimal.
              </Text>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>

      {selectedLesson && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedLesson}
          onRequestClose={() => setSelectedLesson(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedLesson.title}</Text>
                <TouchableOpacity onPress={() => setSelectedLesson(null)} style={styles.closeButton}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.videoContainer}>
                <WebView
                  style={{ flex: 1 }}
                  javaScriptEnabled={true}
                  source={{ uri: selectedLesson.videoUrl }}
                />
              </View>
              <View style={styles.modalDescription}>
                <Text style={styles.modalDescriptionText}>{selectedLesson.description}</Text>
              </View>
            </View>
          </View>
        </Modal>
      )}

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
    marginBottom: 32,
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  progressCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  progressGradient: {
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rankBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rankText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  streakBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  overallProgress: {
    alignItems: 'center',
  },
  overallProgressText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  overallProgressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  categoryCard: {
    width: '47%',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  categoryCardLocked: {
    opacity: 0.7,
  },
  categoryGradient: {
    padding: 16,
    height: 180,
    position: 'relative',
  },
  lockOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  categoryTitleLocked: {
    color: '#9CA3AF',
  },
  categoryDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  categoryDescriptionLocked: {
    color: '#6B7280',
  },
  categoryFooter: {
    marginTop: 12,
  },
  categoryLessons: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  categoryLessonsLocked: {
    color: '#6B7280',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  progressTextLocked: {
    color: '#6B7280',
  },
  lessonCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  lessonCardLocked: {
    opacity: 0.7,
  },
  lessonImageContainer: {
    position: 'relative',
  },
  lessonThumbnail: {
    width: '100%',
    height: 120,
  },
  lessonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  completedText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  lessonContent: {
    padding: 16,
  },
  lessonHeader: {
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  lessonTitleLocked: {
    color: '#9CA3AF',
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  lessonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  lessonCategory: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  lessonDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 12,
  },
  lessonDescriptionLocked: {
    color: '#6B7280',
  },
  lessonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  lessonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lessonDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  lessonRating: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: '47%',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  achievementEarned: {
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#9CA3AF',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementTitleEarned: {
    color: '#FFFFFF',
  },
  achievementDescription: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  earnedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  tipsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  tipsGradient: {
    padding: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: '#1F2937',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000000',
    marginBottom: 16,
  },
  modalDescription: {
    flex: 1,
  },
  modalDescriptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    lineHeight: 20,
  },
});