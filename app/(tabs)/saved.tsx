import React, { useCallback, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../../constants/api';
import { Dimensions, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { JobCard } from '../../components/JobCard';
import TopHeader from '../../components/TopHeader';
import { LogOutIcon } from '../../components/ui/Icons';
import { useAuth } from '../../components/AuthContext';

export default function SavedScreen() {
		const { width: SCREEN_WIDTH } = Dimensions.get('window');
		const insets = useSafeAreaInsets();
		const { logout, user } = useAuth();
		const [saved, setSaved] = useState<any[]>([]);

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
				setSaved(jobs);
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
				// Wait for backend to update before re-fetching
				setTimeout(() => {
					fetchSavedJobs();
				}, 200);
			} catch {
				// Optionally show an error message
			}
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
					{ paddingHorizontal: Math.max(8, SCREEN_WIDTH * 0.01), flexGrow: 1, paddingTop: 8, paddingBottom: Math.max(24, insets.bottom + 72), width: '100%', maxWidth: 700, alignSelf: 'center' },
				]}
				ListEmptyComponent={
					<View style={[styles.card, { maxWidth: 700, width: '99%', alignItems: 'center', marginTop: 48 }]}> 
						<Text style={{ color: '#888', fontSize: 16 }}>No saved jobs yet</Text>
						<Text style={{ color: '#888', marginTop: 4, fontSize: 14 }}>
							Bookmark jobs while browsing to save them for later
						</Text>
					</View>
				}
				renderItem={({ item, index }) => (
					<Animated.View entering={FadeIn.delay(index * 60)} style={{ marginBottom: 16, width: '99%', maxWidth: 700, alignSelf: 'center', position: 'relative' }}>
						<JobCard
							job={item}
							showActions={false}
							isSaved={true}
							disableSwipe={true}
						/>
						<TouchableOpacity
							style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, backgroundColor: '#fff', borderRadius: 16, padding: 4, elevation: 2 }}
							onPress={() => removeSaved(item._id || item.id || item.job_id)}
							accessibilityLabel="Remove saved job"
						>
							<LogOutIcon size={20} color="#ef4444" />
						</TouchableOpacity>
					</Animated.View>
				)}
			/>
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
