import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState, useCallback } from 'react';
// removed duplicate Modal/Button import
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../../constants/api';
import { Dimensions, StyleSheet, Text, View, Modal, Button } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { JobCard } from '../../components/JobCard';

// import { useJobContext } from '../../components/JobContext';
import TopHeader from '../../components/TopHeader';
import { LogOutIcon } from '../../components/ui/Icons';
// import { Select } from '../../components/ui/select';
// import * as Location from 'expo-location';
import { useAuth } from '../../components/AuthContext';
import { useLocation } from '../../components/LocationContext';


const { width: SCREEN_WIDTH } = Dimensions.get('window');
export default function Index(){
  const { location } = useLocation();
  const { logout, user } = useAuth();
  const insets = useSafeAreaInsets();
  const [jobs, setJobs] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [saved, setSaved] = useState<any[]>([]);
  // const [appliedJobs, setAppliedJobs] = useState<any[]>([]); // Removed unused state
  const job = jobs[current];
  // Always check saved state for the current job, fallback to false if no job
  const isSaved = job && saved.length > 0 ? saved.some((j) => (j.id || j._id) === (job.id || job._id)) : false;


  // Remove local swipe logic, only track current index and modal
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Fetch jobs from backend for this user on tab focus
  useEffect(() => {
    const fetchJobs = async () => {
      if (!user?.id) return;
      try {
        // Pass location to backend if set and not 'all'
        const params: any = { limit: 40 };
        if (location && location !== 'all') {
          params.location = location;
        }
        const res = await fetch(api.recommend(user.id, params));
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        setJobs(data.map((item: any) => ({ ...item.job, matchPercentage: Math.round(item.match_score * 100) })));
        setCurrent(0);
        setShowLimitModal(false);
      } catch {
        setJobs([]);
      }
    };
    fetchJobs();
  }, [user?.id, location]);

  // Fetch saved jobs for this user (for isSaved state and Saved tab parity)
  useEffect(() => {
    const fetchSaved = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(api.saved(user.id));
        if (!res.ok) throw new Error('Failed to fetch saved jobs');
        const data = await res.json();
        setSaved(Array.isArray(data) ? data : []);
      } catch {
        setSaved([]);
      }
    };
    fetchSaved();
  }, [user?.id]);



  // Save applied job to backend
  const saveAppliedJob = useCallback(async (job: any) => {
    const userId = user?.id || user?.clerk_id;
    const jobId = job?.id || job?._id;
    if (!userId || !jobId) {
      console.error('Missing user_id or job_id', { user, job });
      return false;
    }
    try {
      const payload = {
        user_id: userId,
        job_id: jobId,
        action: 'like',
        job_payload: job,
      };
      console.log('Sending LIKE to backend:', payload);

      const res = await fetch(api.swipe(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 429) {
        // Backend swipe limit reached
        setShowLimitModal(true);
        return false;
      }
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Backend error: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      console.log('Backend LIKE response:', data);
      return true;
    } catch (e) {
      console.error('Error sending LIKE to backend:', e);
      return false;
    }
  }, [user]);

  // Handle swipe (accept/reject)
  // Fix: Pass job object directly to handleSwipe to avoid closure issues
  // Only allow swiping through jobs received from backend
  const handleSwipe = useCallback(async (type: 'accept' | 'reject', jobObj: any) => {
    if (current >= jobs.length - 1) {
      setShowLimitModal(true);
      return;
    }
    if (type === 'accept') {
      const success = await saveAppliedJob(jobObj); // 'like' action
      if (success) {
        setCurrent((prev) => prev + 1);
      }
      // If not success (429), modal is already shown and index not incremented
    } else {
      const userId = user?.id || user?.clerk_id;
      const jobId = jobObj?.id || jobObj?._id;
      if (userId && jobId) {
        fetch(api.swipe(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, job_id: jobId, action: 'dislike', job_payload: jobObj }),
        })
          .then(res => {
            if (res.status === 429) {
              setShowLimitModal(true);
              return null;
            }
            return res.json();
          })
          .then(data => { if (data) console.log('Backend DISLIKE response:', data); })
          .catch(e => console.error('Error sending DISLIKE to backend:', e));
      }
      setCurrent((prev) => prev + 1);
    }
  }, [current, jobs.length, user, saveAppliedJob]);

  // Toggle save/unsave and persist to backend
  const fetchSaved = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(api.saved(user.id));
      if (!res.ok) throw new Error('Failed to fetch saved jobs');
      const data = await res.json();
      setSaved(Array.isArray(data) ? data : []);
    } catch {
      setSaved([]);
    }
  }, [user?.id]);

  const toggleSave = useCallback(async (jobObj: any) => {
    const userId = user?.id || user?.clerk_id;
    const jobId = jobObj?.id || jobObj?._id;
    if (!userId || !jobId) return;
    const currentlySaved = saved.some((j) => (j.id || j._id) === jobId);
    try {
      if (currentlySaved) {
        await fetch(api.removeSaved(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, job_id: jobId }),
        });
      } else {
        await fetch(api.swipe(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, job_id: jobId, action: 'save', job_payload: jobObj }),
        });
      }
      // Always re-fetch saved jobs after save/unsave
      fetchSaved();
    } catch {
      // No-op on error; UI state remains unchanged
    }
  }, [user, saved, fetchSaved]);

  // Update saved jobs on mount and when user changes
  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  // Location selection moved to Profile tab

  return (
    <LinearGradient colors={['#bed9f3ff', '#d5d7daff', '#dcdcdcff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
      <TopHeader
        title="Discover Jobs"
        subtitle="Curated matches based on your skills"
        colors={['#f8fafc', '#e5e7eb', '#f1f5f9']}
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              onPress={logout}
              style={{ flexDirection: 'row', alignItems: 'center', color: '#ef4444', fontWeight: 'bold', fontSize: 15, marginLeft: 8 }}
            >
              <LogOutIcon size={18} color="#ef4444" style={{ marginRight: 4 }} />
              Logout
            </Text>
          </View>
        }
      />
      <View style={[styles.scrollContent, { paddingHorizontal: Math.max(16, SCREEN_WIDTH * 0.05), paddingBottom: Math.max(16, insets.bottom + 72) }]}> 
        <Animated.View
          style={[styles.card, { maxWidth: 560, width: '100%', overflow: 'hidden' }]}
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(300)}
        >
          <LinearGradient colors={['rgba(59,130,246,0.08)', 'rgba(59,130,246,0.02)']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 0 }} />
          {/* <Text style={styles.title}>Recommended for you</Text> */}
          
          {job ? (
            <JobCard
              job={job}
              onApply={() => handleSwipe('accept', job)}
              onPass={() => handleSwipe('reject', job)}
              onSave={() => toggleSave(job)}
              showActions
              isSaved={isSaved}
            />
          ) : (
            <Text style={{ color: '#888', marginTop: 32, fontSize: 18, textAlign: 'center' }}>No more jobs to show!</Text>
          )}
          {/* Modal for swipe limit reached */}
          <Modal visible={showLimitModal} transparent animationType="slide">
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
              <View style={{ backgroundColor: "white", padding: 24, borderRadius: 12, alignItems: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>Swipe limit reached</Text>
                <Text style={{ marginBottom: 16 }}>You have reached your daily swipe limit. It will reset in 24 hours.</Text>
                <Button title="OK" onPress={() => setShowLimitModal(false)} />
              </View>
            </View>
          </Modal>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f6fb',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginHorizontal: 24,
    marginTop: 6,
    marginBottom: 0,
    alignSelf: 'flex-start',
    minHeight: 36,
    minWidth: 0,
    shadowColor: '#2563eb',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  locationLabel: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
    marginRight: 4,
  },
  locationSelect: {
    minWidth: 90,
    maxWidth: 140,
    backgroundColor: '#f8fafc',
    borderColor: '#dbeafe',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111',
  },
  brand: {
    color: '#2563eb',
  },
  subtitle: {
    color: '#444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 400,
  },
  jobCard: {
    backgroundColor: '#f1f5fd',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    minWidth: 180,
    alignItems: 'flex-start',
    shadowColor: '#2563eb',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});