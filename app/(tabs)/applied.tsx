import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Dimensions, FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { JobCard } from '../../components/JobCard';
import type { Job } from '../../components/JobContext';
import { useJobContext } from '../../components/JobContext';
import TopHeader from '../../components/TopHeader';
import { LogOutIcon } from '../../components/ui/Icons';
import { useAuth } from '../../components/AuthContext';
import { Badge } from '../../components/ui/badge';
import { BriefcaseIcon } from '../../components/ui/Icons'

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export default function AppliedScreen() {
  const [applied, setApplied] = useState<Job[]>([]);
  const insets = useSafeAreaInsets();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { logout, user } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      const fetchLikedJobs = async () => {
        if (!user?.id) return;
        try {
          const res = await fetch(`http://192.168.100.2:3000/api/recommend/liked/${user.id}`);
          if (!res.ok) throw new Error('Failed to fetch liked jobs');
          const data = await res.json();
          setApplied(data || []);
        } catch {
          setApplied([]);
        }
      };
      fetchLikedJobs();
    }, [user?.id])
  );

  // Example progress stages
  const stages = [
    { key: 'applied', label: 'Applied' },
    { key: 'interview', label: 'Interview' },
    { key: 'offer', label: 'Offer' },
    { key: 'hired', label: 'Hired' },
  ];
  // For demo, always at stage 0 (applied)
  const currentStage = 0;

  return (
    <LinearGradient colors={['#bed9f3ff', '#d5d7daff', '#dcdcdcff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
      <TopHeader
        title="My Applications"
        right={
          <TouchableOpacity onPress={logout} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LogOutIcon size={20} color="#ef4444" style={{ marginRight: 4 }} />
            <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Logout</Text>
          </TouchableOpacity>
        }
      />
      <FlatList
        data={applied}
        keyExtractor={item => item.id}
        
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: Math.max(16, SCREEN_WIDTH * 0.05), paddingBottom: Math.max(24, insets.bottom + 72) },
        ]}
        renderItem={({ item: app, index }) => (
          <TouchableOpacity
          
            activeOpacity={0.9}
            onPress={() => {
              setSelectedJob(app);
              setModalVisible(true);
            }}
          >
            <Animated.View
              entering={FadeIn.delay(index * 60)}
              exiting={FadeOut}
              style={styles.applicationCardWrapper}
            >
              <View style={styles.applicationCard}>
                <View style={styles.headerRow}>
                  <View style={{ marginRight: 12, justifyContent: 'center', alignItems: 'center' }}>
                    <BriefcaseIcon size={28} color="#2563eb" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.jobTitle}>{app.title}</Text>
                    <Text style={styles.company}>{app.company}</Text>
                  </View>
                  <View style={{ marginLeft: 8 }}>
                    <Badge variant="secondary">Applied</Badge>
                  </View>
                </View>
                {/* Progress Stepper */}
                <View style={styles.progressStepper}>
                  {stages.map((stage, i) => (
                    <React.Fragment key={stage.key}>
                      <View style={[styles.progressCircle, i <= currentStage ? styles.progressActive : styles.progressInactive]}>
                        <Text style={styles.progressCircleText}>{i + 1}</Text>
                      </View>
                      {i < stages.length - 1 && (
                        <View style={[styles.progressLine, i < currentStage ? styles.progressActive : styles.progressInactive]} />
                      )}
                    </React.Fragment>
                  ))}
                </View>
                <View style={styles.progressLabels}>
                  {stages.map((stage, i) => (
                    <Text
                      key={stage.key}
                      style={[styles.progressLabel, i === currentStage && styles.progressLabelActive]}
                    >
                      {stage.label}
                    </Text>
                  ))}
                </View>
                <View style={{ marginTop: 8 }}>
                  <Text style={styles.progressText}>Application submitted</Text>
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
        )}
      />

      {/* Modal for full job details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 16, width: '94%', maxWidth: 520, maxHeight: '90%' }}>
            <View style={{ alignItems: 'flex-end' }}>
              <Pressable onPress={() => setModalVisible(false)} style={{ padding: 8 }}>
                <Text style={{ fontSize: 22, color: '#888' }}>×</Text>
              </Pressable>
            </View>
            {selectedJob && (
              <>
                {/* Progress Stepper in modal */}
                <View style={styles.progressStepper}>
                  {stages.map((stage, i) => (
                    <React.Fragment key={stage.key}>
                      <View style={[styles.progressCircle, i <= currentStage ? styles.progressActive : styles.progressInactive]}>
                        <Text style={styles.progressCircleText}>{i + 1}</Text>
                      </View>
                      {i < stages.length - 1 && (
                        <View style={[styles.progressLine, i < currentStage ? styles.progressActive : styles.progressInactive]} />
                      )}
                    </React.Fragment>
                  ))}
                </View>
                <View style={styles.progressLabels}>
                  {stages.map((stage, i) => (
                    <Text
                      key={stage.key}
                      style={[styles.progressLabel, i === currentStage && styles.progressLabelActive]}
                    >
                      {stage.label}
                    </Text>
                  ))}
                </View>
                <JobCard job={selectedJob} showActions={false} isApplied={true} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 30,
    paddingBottom: 24,
  },
  applicationCardWrapper: {
    width: '99%',
    maxWidth: 800,
    alignSelf: 'center',
    marginBottom: 18,
    marginTop: 0,
  },
  applicationCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginBottom: 0,
  },
  progressStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 4,
  },
  progressCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  progressCircleText: {
    color: '#334155',
    fontWeight: 'bold',
  },
  progressActive: {
    backgroundColor: '#60a5fa',
    borderColor: '#60a5fa',
  },
  progressInactive: {
    backgroundColor: '#e5e7eb',
    borderColor: '#e5e7eb',
  },
  progressLine: {
    height: 4,
    width: 32,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  progressLabel: {
    fontSize: 11,
    color: '#888',
    width: 48,
    textAlign: 'center',
  },
  progressLabelActive: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  company: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    marginLeft: 2,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stageIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  stageName: {
    fontSize: 15,
    color: '#222',
  },
  stageDate: {
    color: '#888',
    marginLeft: 8,
    fontSize: 12,
  },
  interviewBanner: {
    backgroundColor: '#f3e8ff',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  interviewBannerText: {
    color: '#7c3aed',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  interviewBannerDate: {
    marginLeft: 8,
    color: '#7c3aed',
  },
  actionBanner: {
    backgroundColor: '#fef9c3',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBannerText: {
    color: '#b45309',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111',
  },
  subtitle: {
    color: '#666',
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});
