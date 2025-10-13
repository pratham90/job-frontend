import React, { useCallback, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../../constants/api';
import { Dimensions, FlatList, StyleSheet, Text, View, TouchableOpacity, Modal, Pressable, Button } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { JobCard } from '../../components/JobCard';
import TopHeader from '../../components/TopHeader';
import { LogOutIcon } from '../../components/ui/Icons';


import { useAuth } from '../../components/AuthContext';

// Copy saveAppliedJob logic from Discover tab
export default function SavedScreen() {
	const { width: SCREEN_WIDTH } = Dimensions.get('window');
	const insets = useSafeAreaInsets();
	const { logout, user } = useAuth();
	const [saved, setSaved] = useState<any[]>([]);
	const [selectedJob, setSelectedJob] = useState<any | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [showLimitModal, setShowLimitModal] = useState(false);

		// Fetch saved jobs from backend
		const fetchSavedJobs = useCallback(async () => {
			if (!user?.id) {
				setSaved([]);
				return;
			}
			try {
		const res = await fetch(api.saved(user.id), { cache: 'no-store' }); // api.saved uses deployed link
				if (!res.ok) throw new Error('Failed to fetch saved jobs');
				const data = await res.json();
				// Flatten job_details if present
				   const jobs = Array.isArray(data)
					   ? data.map((item) => item.job_details ? { ...item.job_details, ...item } : item)
					   : [];
				   // If jobs array is empty but data is an array, try using data directly (backend may return plain jobs)
				   if (jobs.length === 0 && Array.isArray(data) && data.length > 0) {
					   setSaved(data);
				   } else {
					   setSaved(jobs);
				   }
					} catch {
						setSaved([]);
			}
		}, [user?.id]);

		// Reload saved jobs every time tab is focused
		useFocusEffect(
			React.useCallback(() => {
				fetchSavedJobs();
			}, [fetchSavedJobs])
		);


		// Remove job from saved (DB and UI)
		const removeSaved = useCallback(async (jobId: string) => {
			if (!user?.id) return;
			try {
				const res = await fetch(api.removeSaved(), {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ user_id: user.id, job_id: jobId }),
				});
				if (!res.ok) return;
				fetchSavedJobs();
			} catch {}
		}, [user?.id, fetchSavedJobs]);

		// Apply for a saved job: use same logic as Discover tab
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
					setShowLimitModal(true);
					return false;
				}
				if (!res.ok) {
					const errorText = await res.text();
					throw new Error(`Backend error: ${res.status} ${errorText}`);
				}
				fetchSavedJobs();
				return true;
			} catch (e) {
				console.error('Error sending LIKE to backend:', e);
				return false;
			}
		}, [user, fetchSavedJobs]);

		const applySavedJob = useCallback(async (job: any) => {
			if (showLimitModal) return;
			await saveAppliedJob(job);
		}, [saveAppliedJob, showLimitModal]);

		// Pass (dislike) a saved job
		const passSavedJob = useCallback(async (job: any) => {
			if (!user?.id) return;
			try {
				const payload = {
					user_id: user.id,
					job_id: job.id || job._id || job.job_id,
					action: 'dislike',
					job_payload: job,
				};
				const res = await fetch(api.swipe(), {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				});
				if (!res.ok) throw new Error('Failed to pass');
				fetchSavedJobs();
			} catch {}
		}, [user?.id, fetchSavedJobs]);

		return (
		<LinearGradient colors={['#bed9f3ff', '#d5d7daff', '#dcdcdcff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
			<TopHeader
				title="Saved Jobs"
				subtitle="Bookmark jobs while browsing to save them for later"
				colors={['#f8fafc', '#e5e7eb', '#f1f5f9']}
				right={
					<TouchableOpacity onPress={logout} style={{ flexDirection: 'row', alignItems: 'center' }}>
						<LogOutIcon size={20} color="#ef4444" style={{ marginRight: 4 }} />
						<Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Logout</Text>
					</TouchableOpacity>
				}
			/>
			<FlatList
				data={saved}
				keyExtractor={(item, index) => String(item._id || item.id || item.job_id) + '-' + index}
				contentContainerStyle={[
					styles.scrollContent,
					{
						paddingHorizontal: Math.max(8, SCREEN_WIDTH * 0.01),
						flexGrow: 1,
						paddingTop: 8,
						paddingBottom: Math.max(24, insets.bottom + 72),
						width: SCREEN_WIDTH > 600 ? 520 : '98%',
						maxWidth: 520,
						alignSelf: 'center',
					},
				]}
			ListEmptyComponent={
					<View style={[styles.card, { maxWidth: 520, width: SCREEN_WIDTH > 600 ? 480 : '98%', alignItems: 'center', marginTop: 48 }]}> 
						<Text style={{ color: '#888', fontSize: 16 }}>No saved jobs yet</Text>
						<Text style={{ color: '#888', marginTop: 4, fontSize: 14 }}>
							Bookmark jobs while browsing to save them for later
						</Text>
					</View>
				}
				   renderItem={({ item, index }) => (
					   <TouchableOpacity
						   activeOpacity={0.9}
						   onPress={() => {
							   setSelectedJob(item);
							   setModalVisible(true);
						   }}
					   >
						   <Animated.View
							   entering={FadeIn.delay(index * 60)}
							   style={{
								   marginBottom: 22,
								   width: '160%',
								   maxWidth: 440,
								   minHeight: 90,
								   alignSelf: 'center',
								   borderRadius: 22,
								   overflow: 'hidden',
								   borderWidth: 1,
								   borderColor: '#e0e7ef',
								   shadowColor: '#2563eb',
								   shadowOpacity: 0.10,
								   shadowRadius: 16,
								   shadowOffset: { width: 0, height: 6 },
								   elevation: 8,
							   }}
						   >
							   <LinearGradient
								   colors={['#f8fafc', '#e0e7ef']}
								   start={{ x: 0, y: 0 }}
								   end={{ x: 1, y: 1 }}
				   style={{ paddingVertical: 28, paddingHorizontal: 28 }}>
							   <Text style={{ fontSize: 19, fontWeight: 'bold', color: '#1e293b', marginBottom: 8, textAlign: 'center', letterSpacing: 0.2 }} numberOfLines={2} ellipsizeMode="tail">
								   {item.title && String(item.title).trim() !== '' ? item.title : 'Untitled Job'}
							   </Text>
							   <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 16 }}>
								   Tap to view full job details
							   </Text>
							   <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
								   <TouchableOpacity
									   style={{
										   flex: 1,
										   backgroundColor: '#fff',
										   borderRadius: 8,
										   paddingVertical: 11,
										   marginRight: 10,
										   borderWidth: 1.2,
										   borderColor: '#ef4444',
										   alignItems: 'center',
									   }}
									   activeOpacity={0.85}
									   onPress={() => passSavedJob(item)}
								   >
									   <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 15 }}>Pass</Text>
								   </TouchableOpacity>
								   <TouchableOpacity
									   style={{
										   flex: 1,
										   backgroundColor: '#2563eb',
										   borderRadius: 8,
										   paddingVertical: 11,
										   marginHorizontal: 10,
										   alignItems: 'center',
									   }}
									   activeOpacity={0.85}
									   onPress={() => applySavedJob(item)}
								   >
									   <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Apply</Text>
								   </TouchableOpacity>
								   <TouchableOpacity
									   style={{
										   flex: 1,
										   backgroundColor: '#fff',
										   borderRadius: 8,
										   paddingVertical: 11,
										   paddingHorizontal: 2,
										   marginLeft: 10,
										   borderWidth: 1.2,
										   borderColor: '#f87171',
										   alignItems: 'center',
									   }}
									   activeOpacity={0.85}
									   onPress={() => removeSaved(item.id || item._id || item.job_id)}
								   >
									   <Text style={{ color: '#f87171', fontWeight: 'bold', fontSize: 14 }}>Remove</Text>
								   </TouchableOpacity>
							   </View>
							   </LinearGradient>
						   </Animated.View>
					   </TouchableOpacity>
				   )}
					/>
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
		   {/* Modal for full job details and actions */}
		   <Modal
			   visible={modalVisible}
			   animationType="slide"
			   transparent={true}
			   onRequestClose={() => setModalVisible(false)}
		   >
			   <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }}>
				   <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 16, width: SCREEN_WIDTH > 600 ? 520 : '98%', maxWidth: 520, maxHeight: '90%' }}>
					   <View style={{ alignItems: 'flex-end' }}>
						   <Pressable onPress={() => setModalVisible(false)} style={{ padding: 8 }}>
							   <Text style={{ fontSize: 22, color: '#888' }}>×</Text>
						   </Pressable>
					   </View>
					   {selectedJob && (
						   <JobCard
							   job={selectedJob}
							   showActions={true}
							   isSaved={true}
							   disableSwipe={true}
							   onApply={() => { applySavedJob(selectedJob); setModalVisible(false); }}
							   onPass={() => { passSavedJob(selectedJob); setModalVisible(false); }}
							   onRemove={() => { removeSaved(selectedJob._id || selectedJob.id || selectedJob.job_id); setModalVisible(false); }}
						   />
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
