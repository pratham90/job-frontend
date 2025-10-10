import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../../constants/api';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { JobCard } from '../../components/JobCard';
// import { useJobContext } from '../../components/JobContext';
import TopHeader from '../../components/TopHeader';
import { LogOutIcon } from '../../components/ui/Icons';
// import { Select } from '../../components/ui/select';
// import * as Location from 'expo-location';
import { useAuth } from '../../components/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export default function Index(){
  const { logout, user } = useAuth();
  const insets = useSafeAreaInsets();
  const [jobs, setJobs] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [saved, setSaved] = useState<any[]>([]);
  // const [appliedJobs, setAppliedJobs] = useState<any[]>([]); // Removed unused state
  const job = jobs[current];
  // Always check saved state for the current job, fallback to false if no job
  const isSaved = job && saved.length > 0 ? saved.some((j) => (j.id || j._id) === (job.id || job._id)) : false;
  // Location selection moved to Profile tab

  // Swipe limit state (in-memory, per session)
  const [swipeCount, setSwipeCount] = useState(0);
  const [swipeStart, setSwipeStart] = useState<number | null>(null);
  const [swipeBlocked, setSwipeBlocked] = useState(false);
  const SWIPE_LIMIT = 20;
  const SWIPE_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in ms

  // Fetch jobs from backend for this user on tab focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchJobs = async () => {
        if (!user?.id) return;
        try {
          const res = await fetch(api.recommend(user.id, { limit: 40 }));
          if (!res.ok) throw new Error('Failed to fetch jobs');
          const data = await res.json();
          setJobs(data.map((item: any) => ({ ...item.job, matchPercentage: Math.round(item.match_score * 100) })));
          setCurrent(0);
        } catch {
          setJobs([]);
        }
      };
      fetchJobs();
    }, [user?.id])
  );

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
  }, [user?.id, SWIPE_WINDOW]);

  // Reset swipe state on user change
  useEffect(() => {
    setSwipeCount(0);
    setSwipeStart(null);
    setSwipeBlocked(false);
  }, [user?.id]);

  // Load swipe state from AsyncStorage
  useEffect(() => {
    const loadSwipeState = async () => {
      if (!user?.id) return;
      try {
        const stored = await AsyncStorage.getItem(`swipe_${user.id}`);
        if (stored) {
          const { count, start } = JSON.parse(stored);
          const now = Date.now();
          if (now - start < SWIPE_WINDOW) {
            setSwipeCount(count);
            setSwipeStart(start);
            setSwipeBlocked(count >= SWIPE_LIMIT);
          } else {
            setSwipeCount(0);
            setSwipeStart(now);
            setSwipeBlocked(false);
            await AsyncStorage.setItem(`swipe_${user.id}`, JSON.stringify({ count: 0, start: now }));
          }
        } else {
          const now = Date.now();
          setSwipeCount(0);
          setSwipeStart(now);
          setSwipeBlocked(false);
          await AsyncStorage.setItem(`swipe_${user.id}`, JSON.stringify({ count: 0, start: now }));
        }
      } catch {
        setSwipeCount(0);
        setSwipeStart(Date.now());
        setSwipeBlocked(false);
      }
    };
    loadSwipeState();
  }, [user?.id]);

  // Save applied job to backend
  const saveAppliedJob = useCallback(async (job: any) => {
    const userId = user?.id || user?.clerk_id;
    const jobId = job?.id || job?._id;
    if (!userId || !jobId) {
      console.error('Missing user_id or job_id', { user, job });
      return;
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

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Backend error: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      console.log('Backend LIKE response:', data);
    } catch (e) {
      console.error('Error sending LIKE to backend:', e);
      // Optionally show an alert or UI error
    }
  }, [user]);

  // Handle swipe (accept/reject)
  // Fix: Pass job object directly to handleSwipe to avoid closure issues
  const handleSwipe = useCallback((type: 'accept' | 'reject', jobObj: any) => {
    if (swipeBlocked) return;
    let newCount = swipeCount + 1;
    let newStart = swipeStart ?? Date.now();
    const now = Date.now();
    if (now - newStart >= SWIPE_WINDOW) {
      newCount = 1;
      newStart = now;
      setSwipeBlocked(false);
    }
    setSwipeCount(newCount);
    setSwipeStart(newStart);
    if (newCount >= SWIPE_LIMIT) setSwipeBlocked(true);
    AsyncStorage.setItem(`swipe_${user.id}`, JSON.stringify({ count: newCount, start: newStart }));
    if (type === 'accept') {
      saveAppliedJob(jobObj); // 'like' action
      setCurrent((prev) => prev + 1);
      // Debugging: Alert and log
      if (typeof window !== 'undefined' && window.alert) window.alert('Apply (like) triggered for job: ' + jobObj.title);
      console.log('Apply (like) triggered for job:', jobObj);
    } else {
      // 'dislike' action for pass
      const userId = user?.id || user?.clerk_id;
      const jobId = jobObj?.id || jobObj?._id;
      if (userId && jobId) {
        if (typeof window !== 'undefined' && window.alert) window.alert('Pass (dislike) triggered for job: ' + jobObj.title);
        console.log('Sending DISLIKE to backend:', { user_id: userId, job_id: jobId, action: 'dislike', job_payload: jobObj });
  fetch(api.swipe(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, job_id: jobId, action: 'dislike', job_payload: jobObj }),
        })
          .then(res => res.json())
          .then(data => console.log('Backend DISLIKE response:', data))
          .catch(e => console.error('Error sending DISLIKE to backend:', e));
      }
      setCurrent((prev) => prev + 1);
    }
  }, [swipeBlocked, swipeCount, swipeStart, user, saveAppliedJob, SWIPE_WINDOW]);

  // Toggle save/unsave and persist to backend
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
        setSaved((prev) => prev.filter((j) => (j.id || j._id) !== jobId));
      } else {
  await fetch(api.swipe(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, job_id: jobId, action: 'save', job_payload: jobObj }),
        });
        setSaved((prev) => [...prev, jobObj]);
      }
      // Do NOT advance to next job after save/unsave
    } catch {
      // No-op on error; UI state remains unchanged
    }
  }, [user, saved]);

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
      {/* Location selection moved to Profile tab */}
      <View style={[styles.scrollContent, { paddingHorizontal: Math.max(16, SCREEN_WIDTH * 0.05), paddingBottom: Math.max(16, insets.bottom + 72) }]}> 
        <Animated.View
          style={[styles.card, { maxWidth: 560, width: '100%', overflow: 'hidden' }]}
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(300)}
        >
          <LinearGradient colors={['rgba(59,130,246,0.08)', 'rgba(59,130,246,0.02)']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120 }} />
          <Text style={styles.title}>Recommended for you</Text>
          <Text style={styles.subtitle}>Swipe through jobs. Accept to apply, save for later, or reject.</Text>
          {swipeBlocked ? (
            <Text style={{ color: '#ef4444', marginTop: 32, fontSize: 18, textAlign: 'center' }}>
              You have reached your daily swipe limit of 20 jobs. Swiping will reset after 24 hours.
            </Text>
          ) : job ? (
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
    paddingVertical: 24,
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