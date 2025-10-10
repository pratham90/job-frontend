

import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from './ui/Button';
import { UploadIcon } from './ui/Icons';
import { Progress } from './ui/progress';

interface ResumeUploadProps {
  onResumeUploaded: (resumeData: any) => void;
}

const ResumeUpload = ({ onResumeUploaded }: ResumeUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  // Mock resume parsing function
  const parseResume = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = {
          personalInfo: {
            name: "John Doe",
            email: "john.doe@email.com",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA",
            title: "Senior Software Engineer"
          },
          summary: "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies.",
          experience: [
            {
              company: "Tech Innovators Inc.",
              position: "Senior Software Engineer",
              duration: "2021 - Present",
              description: "Led development of scalable web applications serving 1M+ users"
            },
            {
              company: "StartupXYZ",
              position: "Full Stack Developer",
              duration: "2019 - 2021",
              description: "Built and maintained multiple client applications using React and Node.js"
            }
          ],
          education: [
            {
              degree: "Bachelor of Science in Computer Science",
              school: "University of California, Berkeley",
              year: "2019"
            }
          ],
          skills: [
            "JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "MongoDB", "PostgreSQL"
          ]
        };
        resolve(mockData);
      }, 2000);
    });
  };

  const handlePickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      // Validate file size (max 5MB)
      if (file.size && file.size > 5 * 1024 * 1024) {
        Alert.alert('Error', 'File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setUploading(true);
      setUploadProgress(0);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadProgress(100);
          // Simulate parsing
          parseResume().then((parsed) => {
            onResumeUploaded(parsed);
          });
        }
      }, 200);
    } else if (result.canceled) {
      // User cancelled
    } else {
      Alert.alert('Error', 'Failed to pick document.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Resume</Text>
      <View style={styles.uploadBox}>
        <UploadIcon width={36} height={36} color="#2563eb" />
        <Text style={styles.instructions}>Select a PDF or Word document to upload your resume.</Text>
        <Button onPress={handlePickDocument} style={styles.button} title="Select File" />
        {selectedFile && (
          <View style={styles.fileInfo}>
            <Text style={styles.fileName}>Selected: {selectedFile.name}</Text>
            <Text style={styles.fileSize}>Size: {selectedFile.size ? (selectedFile.size / 1024).toFixed(1) : '?'} KB</Text>
          </View>
        )}
        {uploading && <Progress value={uploadProgress} style={styles.progress} />}
        {uploading && (
          <Text style={styles.progressText}>{uploadProgress}%</Text>
        )}
      </View>
      <Text style={styles.supported}>Supported formats: PDF, DOC, DOCX (max 5MB)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2563eb',
  },
  uploadBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    width: '100%',
    maxWidth: 400,
  },
  instructions: {
    color: '#666',
    marginVertical: 12,
    textAlign: 'center',
  },
  button: {
    marginTop: 12,
    width: 160,
  },
  progress: {
    marginTop: 16,
    width: '100%',
  },
  progressText: {
    marginTop: 8,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  supported: {
    marginTop: 18,
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
  },
  fileInfo: {
    marginTop: 12,
    alignItems: 'center',
  },
  fileName: {
    fontSize: 15,
    color: '#333',
  },
  fileSize: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});

export default ResumeUpload;