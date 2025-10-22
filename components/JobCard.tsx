import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { HandlerStateChangeEvent, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { BookmarkIcon, Building2Icon, CheckIcon, ClockIcon, DollarSignIcon, MapPinIcon, UsersIcon, XIcon } from './ui/Icons';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  description: string;
  requirements: string[];
  benefits: string[];
  companySize: string;
  industry: string;
  logo?: string;
  matchPercentage?: number;
}

interface JobCardProps {
  job: Job;
  onSave?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  onPass?: (jobId: string) => void;
  showActions?: boolean;
  isApplied?: boolean;
  isSaved?: boolean;
  onRemove?: () => void;
  disableSwipe?: boolean;
}

const { width } = Dimensions.get('window');

export function JobCard({ job, onSave, onApply, onPass, showActions = true, isApplied = false, isSaved = false, onRemove, disableSwipe = false }: JobCardProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [swipeStatus, setSwipeStatus] = useState<string | null>(null);
  const sections = ['overview', 'aboutRole', 'requirements'];

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotateZ = useSharedValue(0);

  // Removed unused animatedStyle

  const tiltStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotateZ: `${interpolate(translateX.value, [-width, 0, width], [-6, 0, 6])}deg` },
    ],
    shadowOpacity: 0.12 + Math.min(Math.abs(translateX.value) / width, 1) * 0.12,
    shadowRadius: 8 + Math.min(Math.abs(translateX.value) / width, 1) * 6,
  }));

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    'worklet';
    translateX.value = event.nativeEvent.translationX;
    rotateZ.value = interpolate(translateX.value, [-width, 0, width], [-6, 0, 6]);
  };

  const onGestureEnd = (event: HandlerStateChangeEvent<Record<string, unknown>>) => {
    const tx = (event.nativeEvent as any).translationX ?? 0;
    if (Math.abs(tx) > width * 0.25) {
      const dir = tx > 0 ? 1 : -1;
      setSwipeStatus(dir > 0 ? 'Accepted' : 'Rejected');
      translateX.value = withTiming(dir * width, { duration: 300 }, (finished) => {
        if (finished) {
          if (dir > 0 && onApply) runOnJS(onApply)(job.id);
          if (dir < 0 && onPass) runOnJS(onPass)(job.id);
          // Reset card state for next job
          runOnJS(setSwipeStatus)(null);
          translateX.value = 0;
          opacity.value = 1;
          rotateZ.value = 0;
        }
      });
      opacity.value = withTiming(0, { duration: 300 });
    } else {
      translateX.value = withTiming(0, { duration: 250 });
      rotateZ.value = withTiming(0, { duration: 250 });
    }
  };

  useEffect(() => {
    translateX.value = withTiming(0, { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });
  }, [job.id, translateX, opacity]);

  // Handler for swipe gesture on About slide
  const onAboutGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.translationX < -50) {
      setCurrentSection(2); // swipe left to go to requirements
    } else if (event.nativeEvent.translationX > 50) {
      setCurrentSection(0); // swipe right to go back to overview
    }
  };

  if (disableSwipe) {
    return (
      <Animated.View style={[styles.card, tiltStyle]}>
        {/* Card content without PanGestureHandler */}
        {/* Swipe status label, swipe labels, and actions omitted for saved tab */}
        {currentSection === 0 && (
          <View style={styles.header}>
            <View style={styles.companyRow}>
              <View style={styles.companyIcon}><Building2Icon size={28} color="#2563eb" /></View>
              <View>
                <Text style={styles.company}>{job.company}</Text>
                <Text style={styles.industry}>{job.industry}</Text>
              </View>
              {job.matchPercentage && (
                <View style={styles.match}><Text style={styles.matchText}>✨ {job.matchPercentage}% match</Text></View>
              )}
            </View>
          </View>
        )}
        <View style={styles.content}>
          {currentSection === 0 && (
            <>
              <Text style={styles.title}>{job.title}</Text>
              <View style={styles.row}>
                <MapPinIcon size={16} color="#888" />
                <Text style={styles.meta}>
                  {typeof job.location === 'object' && job.location !== null
                    ? (() => {
                        const loc = job.location as { city?: string; state?: string; country?: string; remote?: boolean };
                        return [loc.city, loc.state, loc.country, loc.remote ? 'Remote' : ''].filter(Boolean).join(', ');
                      })()
                    : job.location}
                </Text>
              </View>
              <View style={styles.row}>
                <DollarSignIcon size={16} color="#888" />
                <Text style={styles.meta}>
                  {typeof job.salary === 'object' && job.salary !== null
                    ? (() => {
                        const s = job.salary as { min?: number; max?: number; currency?: string; is_public?: boolean };
                        if (s.is_public === false || (!s.min && !s.max)) return 'Not disclosed';
                        if (s.min && s.max && s.min !== s.max) return `${s.currency || ''} ${s.min} - ${s.max}`;
                        if (s.min) return `${s.currency || ''} ${s.min}`;
                        return 'Not disclosed';
                      })()
                    : job.salary}
                </Text>
              </View>
              <View style={styles.row}><ClockIcon size={16} color="#888" /><Text style={styles.meta}>{job.type} • Posted {job.posted}</Text></View>
              <View style={styles.row}><UsersIcon size={16} color="#888" /><Text style={styles.meta}>{job.companySize} employees</Text></View>
              <Text style={styles.sectionTitle}>📋 About the role</Text>
              <Text style={styles.desc} numberOfLines={6} ellipsizeMode="tail">{job.description}</Text>
              {job.description && job.description.length > 300 && (
                <TouchableOpacity onPress={() => setCurrentSection(1)}>
                  <Text style={styles.readMore}>Show more</Text>
                </TouchableOpacity>
              )}
            </>
          )}
          {currentSection === 1 && (
            <View>
              <Text style={styles.sectionTitle}>📋 About the role</Text>
              <ScrollView style={[styles.descScroll, { maxHeight: 320 }]} contentContainerStyle={{ paddingBottom: 4 }} showsVerticalScrollIndicator={true}>
                <Text style={styles.desc}>{job.description}</Text>
              </ScrollView>
            </View>
          )}
          {currentSection === 2 && (
            <View>
              <Text style={styles.sectionTitle}>✅ Requirements</Text>
              {job.requirements.map((r, i) => (
                <View key={i} style={styles.benefitRow}><Text style={styles.benefitDot}>•</Text><Text style={styles.benefitText}>{r}</Text></View>
              ))}
            </View>
          )}
        </View>
        {/* Section indicators */}
        <View style={styles.sectionDots}>
          {sections.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setCurrentSection(i)}>
              <View style={[styles.dot, i === currentSection && styles.activeDot]} />
            </TouchableOpacity>
          ))}
        </View>
        {/* Navigation arrows */}
        <View style={styles.arrows}>
          <TouchableOpacity onPress={() => setCurrentSection((currentSection - 1 + sections.length) % sections.length)} style={styles.arrowBtn}><Text style={styles.arrowText}>←</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentSection((currentSection + 1) % sections.length)} style={styles.arrowBtn}><Text style={styles.arrowText}>→</Text></TouchableOpacity>
        </View>
        {/* Remove button for saved jobs */}
        {!showActions && isSaved && onRemove && (
          <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
            <TouchableOpacity onPress={onRemove} style={{ padding: 8, backgroundColor: '#fee2e2', borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}>
              <XIcon size={16} color="#ef4444" />
              <Text style={{ color: '#ef4444', fontWeight: 'bold', marginLeft: 4 }}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    );
  }
  // Default: allow swipe
  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onEnded={onGestureEnd}
    >
      <Animated.View style={[styles.card, tiltStyle]}>
        {/* Swipe status label */}
        {swipeStatus && (
          <View style={{ position: 'absolute', top: 18, left: 0, right: 0, zIndex: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: swipeStatus === 'Accepted' ? '#22c55e' : '#ef4444', backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 6, borderRadius: 12, borderWidth: 2, borderColor: swipeStatus === 'Accepted' ? '#22c55e' : '#ef4444', overflow: 'hidden' }}>{swipeStatus}</Text>
          </View>
        )}
        <View style={styles.swipeLabels} pointerEvents="none">
          <View style={[styles.swipeBadge, styles.swipeYes, { opacity: Math.max(0, translateX.value / (width * 0.25)) }]}> 
            <Text style={styles.swipeText}>APPLY</Text>
          </View>
          <View style={[styles.swipeBadge, styles.swipeNo, { opacity: Math.max(0, -translateX.value / (width * 0.25)) }]}> 
            <Text style={styles.swipeText}>PASS</Text>
          </View>
        </View>
        {currentSection === 0 && (
          <View style={styles.header}>
            <View style={styles.companyRow}>
              <View style={styles.companyIcon}><Building2Icon size={28} color="#2563eb" /></View>
              <View>
                <Text style={styles.company}>{job.company}</Text>
                <Text style={styles.industry}>{job.industry}</Text>
              </View>
              {job.matchPercentage && (
                <View style={styles.match}><Text style={styles.matchText}>✨ {job.matchPercentage}% match</Text></View>
              )}
            </View>
          </View>
        )}
        <View style={styles.content}>
          {currentSection === 0 && (
            <>
              <Text style={styles.title}>{job.title}</Text>
              <View style={styles.row}>
                <MapPinIcon size={16} color="#888" />
                <Text style={styles.meta}>
                  {typeof job.location === 'object' && job.location !== null
                    ? (() => {
                        const loc = job.location as { city?: string; state?: string; country?: string; remote?: boolean };
                        return [loc.city, loc.state, loc.country, loc.remote ? 'Remote' : ''].filter(Boolean).join(', ');
                      })()
                    : job.location}
                </Text>
              </View>
              <View style={styles.row}>
                <DollarSignIcon size={16} color="#888" />
                <Text style={styles.meta}>
                  {typeof job.salary === 'object' && job.salary !== null
                    ? (() => {
                        const s = job.salary as { min?: number; max?: number; currency?: string; is_public?: boolean };
                        if (s.is_public === false || (!s.min && !s.max)) return 'Not disclosed';
                        if (s.min && s.max && s.min !== s.max) return `${s.currency || ''} ${s.min} - ${s.max}`;
                        if (s.min) return `${s.currency || ''} ${s.min}`;
                        return 'Not disclosed';
                      })()
                    : job.salary}
                </Text>
              </View>
              <View style={styles.row}><ClockIcon size={16} color="#888" /><Text style={styles.meta}>{job.type} • Posted {job.posted}</Text></View>
              <View style={styles.row}><UsersIcon size={16} color="#888" /><Text style={styles.meta}>{job.companySize} employees</Text></View>
              <Text style={styles.sectionTitle}>📋 About the role</Text>
              <Text style={styles.desc} numberOfLines={6} ellipsizeMode="tail">{job.description}</Text>
              {job.description && job.description.length > 300 && (
                <TouchableOpacity onPress={() => setCurrentSection(1)}>
                  <Text style={styles.readMore}>Show more</Text>
                </TouchableOpacity>
              )}
            </>
          )}
          {currentSection === 1 && (
            <PanGestureHandler onGestureEvent={onAboutGestureEvent}>
              <View>
                <Text style={styles.sectionTitle}>📋 About the role</Text>
                <ScrollView style={[styles.descScroll, { maxHeight: 320 }]} contentContainerStyle={{ paddingBottom: 4 }} showsVerticalScrollIndicator={true}>
                  <Text style={styles.desc}>{job.description}</Text>
                </ScrollView>
              </View>
            </PanGestureHandler>
          )}
          {currentSection === 2 && (
            <View>
              <Text style={styles.sectionTitle}>✅ Requirements</Text>
              {job.requirements.map((r, i) => (
                <View key={i} style={styles.benefitRow}><Text style={styles.benefitDot}>•</Text><Text style={styles.benefitText}>{r}</Text></View>
              ))}
            </View>
          )}
        </View>
        {/* Section indicators */}
        <View style={styles.sectionDots}>
          {sections.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setCurrentSection(i)}>
              <View style={[styles.dot, i === currentSection && styles.activeDot]} />
            </TouchableOpacity>
          ))}
        </View>
        {/* Navigation arrows */}
        <View style={styles.arrows}>
          <TouchableOpacity onPress={() => setCurrentSection((currentSection - 1 + sections.length) % sections.length)} style={styles.arrowBtn}><Text style={styles.arrowText}>←</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentSection((currentSection + 1) % sections.length)} style={styles.arrowBtn}><Text style={styles.arrowText}>→</Text></TouchableOpacity>
        </View>
        {/* Action buttons */}
        {showActions && currentSection === 0 && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onPass?.(job.id)} style={[styles.passBtn]}>
              <XIcon size={18} color="#ef4444" />
              <Text style={styles.passText}>Pass</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <TouchableOpacity onPress={() => onSave?.(job.id)} style={[styles.saveBtn, isSaved && styles.saveBtnActive]}>
                <BookmarkIcon size={20} color={isSaved ? '#eab308' : '#888'} />
              </TouchableOpacity>
              {isSaved && (
                <Text style={styles.savedLabel}>Saved</Text>
              )}
            </View>
            <LinearGradient
              colors={[isApplied ? '#9ca3af' : '#2563eb', isApplied ? '#9ca3af' : '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.applyGradient]}
            >
              <TouchableOpacity onPress={() => !isApplied && onApply?.(job.id)} disabled={isApplied} style={styles.applyBtn}>
                <CheckIcon size={18} color="#fff" />
                <Text style={styles.applyText}>{isApplied ? 'Applied' : 'Apply'}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
        {/* Remove button for saved jobs */}
        {!showActions && isSaved && onRemove && (
          <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
            <TouchableOpacity onPress={onRemove} style={{ padding: 8, backgroundColor: '#fee2e2', borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}>
              <XIcon size={16} color="#ef4444" />
              <Text style={{ color: '#ef4444', fontWeight: 'bold', marginLeft: 4 }}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 0,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    flexShrink: 1,
    flexGrow: 0,
    // height: '90%', // Fixed height for card
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
    maxHeight: 320, // Make content area scrollable within card
  },
  readMore: {
    color: '#2563eb',
    fontWeight: 'bold',
    marginTop: 2,
    fontSize: 13,
  },
  header: { marginBottom: 10 },
  companyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  companyIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5fd', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  company: { fontWeight: '700', fontSize: 16 },
  industry: { color: '#888', fontSize: 13 },
  match: { backgroundColor: '#f1f5fd', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 'auto' },
  matchText: { color: '#2563eb', fontWeight: '600', fontSize: 13 },
  content: { marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 6, color: '#222' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  meta: { color: '#666', fontSize: 13, marginLeft: 4 },
  sectionTitle: { fontWeight: '700', marginTop: 12, marginBottom: 4, color: '#2563eb' },
  desc: { color: '#444', fontSize: 14, marginBottom: 6 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  benefitDot: { color: '#2563eb', fontSize: 18, marginRight: 6 },
  benefitText: { color: '#444', fontSize: 14 },
  sectionDots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 8 },
  dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: '#e5e7eb', marginHorizontal: 4 },
  activeDot: { backgroundColor: '#2563eb', width: 16 },
  arrows: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  arrowBtn: { padding: 8 },
  arrowText: { fontSize: 18, color: '#2563eb' },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, gap: 8 },
  actionBtn: { flex: 1, marginHorizontal: 4 },
  saveBtn: { padding: 10, borderRadius: 8, backgroundColor: '#f1f5fd', alignItems: 'center', justifyContent: 'center' },
  saveBtnActive: { backgroundColor: '#fef9c3' },
  swipeLabels: { position: 'absolute', top: 12, left: 12, right: 12, zIndex: 2, flexDirection: 'row', justifyContent: 'space-between' },
  swipeBadge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1.5 },
  swipeYes: { backgroundColor: 'rgba(219, 234, 254, 0.8)', borderColor: '#60a5fa' },
  swipeNo: { backgroundColor: 'rgba(254, 226, 226, 0.85)', borderColor: '#f87171' },
  swipeText: { color: '#0f172a', fontWeight: '700', letterSpacing: 1 },
  passBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#ffffff', paddingVertical: 12, borderRadius: 10 },
  passText: { color: '#ef4444', fontWeight: '700' },
  applyGradient: { flex: 1, borderRadius: 10 },
  applyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 10 },
  applyText: { color: '#fff', fontWeight: '700' },
  savedLabel: {
    color: '#eab308',
    fontWeight: 'bold',
    marginLeft: 2,
    fontSize: 13,
  },
  descScroll: {
    maxHeight: 120,
    marginBottom: 4,
  },
});