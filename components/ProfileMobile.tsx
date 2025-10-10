import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Avatar } from './ui/avatar';
import { MailIcon, MapPinIcon, PhoneIcon } from './ui/Icons';

interface ProfileMobileProps {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  willing_to_relocate?: boolean;
  social_links?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  technical_skills?: string[];
  soft_skills?: string[];
  skills?: string[];
  certifications?: string[];
  experience?: any[];
  education?: any[];
  projects?: any[];
  summary?: string;
  onEdit?: () => void;
}

export default function ProfileMobile(props: ProfileMobileProps) {
  const {
    first_name, last_name, full_name, email, phone, location, willing_to_relocate,
    social_links, technical_skills, soft_skills, skills, certifications,
    experience, education, projects, summary
  } = props;
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.card}
    >
      <View style={styles.header}>
        <Avatar source={{}} style={styles.avatar} fallbackText={first_name?.[0] || full_name?.[0] || 'U'} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{full_name || `${first_name || ''} ${last_name || ''}`}</Text>
          <View style={styles.row}>
            {location && <><MapPinIcon width={16} height={16} color="#888" /><Text style={styles.meta}>{location}</Text></>}
            {email && <><MailIcon width={16} height={16} color="#888" /><Text style={styles.meta}>{email}</Text></>}
            {phone && <><PhoneIcon width={16} height={16} color="#888" /><Text style={styles.meta}>{phone}</Text></>}
          </View>
        </View>
      </View>
      {summary && <Text style={styles.sectionTitle}>Summary</Text>}
      {summary && <Text style={styles.desc}>{summary}</Text>}
      {skills && skills.length > 0 && <Text style={styles.sectionTitle}>Skills</Text>}
      {skills && skills.length > 0 && <Text style={styles.desc}>{skills.join(', ')}</Text>}
      {technical_skills && technical_skills.length > 0 && <Text style={styles.sectionTitle}>Technical Skills</Text>}
      {technical_skills && technical_skills.length > 0 && <Text style={styles.desc}>{technical_skills.join(', ')}</Text>}
      {soft_skills && soft_skills.length > 0 && <Text style={styles.sectionTitle}>Soft Skills</Text>}
      {soft_skills && soft_skills.length > 0 && <Text style={styles.desc}>{soft_skills.join(', ')}</Text>}
      {certifications && certifications.length > 0 && <Text style={styles.sectionTitle}>Certifications</Text>}
      {certifications && certifications.length > 0 && <Text style={styles.desc}>{certifications.join(', ')}</Text>}
      {social_links && (social_links.linkedin || social_links.github || social_links.portfolio) && <Text style={styles.sectionTitle}>Social Links</Text>}
      {social_links && (
        <View style={{ marginBottom: 8 }}>
          {social_links.linkedin && <Text style={styles.desc}>LinkedIn: {social_links.linkedin}</Text>}
          {social_links.github && <Text style={styles.desc}>GitHub: {social_links.github}</Text>}
          {social_links.portfolio && <Text style={styles.desc}>Portfolio: {social_links.portfolio}</Text>}
        </View>
      )}
      {experience && experience.length > 0 && <Text style={styles.sectionTitle}>Experience</Text>}
      {experience && experience.length > 0 && experience.map((exp, i) => (
        <View key={i} style={styles.expItem}>
          <Text style={styles.expTitle}>{exp.position} @ {exp.company}</Text>
          <Text style={styles.expMeta}>{exp.duration}</Text>
          <Text style={styles.expDesc}>{exp.description}</Text>
        </View>
      ))}
      {education && education.length > 0 && <Text style={styles.sectionTitle}>Education</Text>}
      {education && education.length > 0 && education.map((edu, i) => (
        <View key={i} style={styles.expItem}>
          <Text style={styles.expTitle}>{edu.degree} - {edu.institution}</Text>
          <Text style={styles.expMeta}>{edu.year}</Text>
        </View>
      ))}
      {projects && projects.length > 0 && <Text style={styles.sectionTitle}>Projects</Text>}
      {projects && projects.length > 0 && projects.map((proj, i) => (
        <View key={i} style={styles.expItem}>
          <Text style={styles.expTitle}>{proj.name}</Text>
          <Text style={styles.expDesc}>{proj.description}</Text>
          {proj.technologies && proj.technologies.length > 0 && <Text style={styles.expMeta}>Tech: {proj.technologies.join(', ')}</Text>}
        </View>
      ))}
      {typeof willing_to_relocate === 'boolean' && <Text style={styles.sectionTitle}>Willing to Relocate</Text>}
      {typeof willing_to_relocate === 'boolean' && <Text style={styles.desc}>{willing_to_relocate ? 'Yes' : 'No'}</Text>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginTop: 24,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 12 },
  name: { fontWeight: '700', fontSize: 18 },
  title: { color: '#888', fontSize: 14, marginBottom: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  meta: { color: '#666', fontSize: 13, marginLeft: 4, marginRight: 8 },
  sectionTitle: { fontWeight: '700', marginTop: 12, marginBottom: 4, color: '#2563eb' },
  desc: { color: '#444', fontSize: 14, marginBottom: 6 },
  expItem: { marginBottom: 8 },
  expTitle: { fontWeight: '600', fontSize: 15 },
  expMeta: { color: '#888', fontSize: 13 },
  expDesc: { color: '#444', fontSize: 13 },
});
