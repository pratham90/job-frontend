import React, { createContext, ReactNode, useContext, useState } from 'react';
import { mockJobs } from './mockData';

export interface Job {
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

interface JobContextType {
  jobs: Job[];
  current: number;
  applied: Job[];
  saved: Job[];
  handleAccept: (jobId: string) => void;
  handleReject: (jobId: string) => void;
  handleSave: (jobId: string) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export function JobProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [current, setCurrent] = useState(0);
  const [applied, setApplied] = useState<Job[]>([]);
  const [saved, setSaved] = useState<Job[]>([]);

  const handleAccept = (jobId: string) => {
    setApplied((prev) => [...prev, jobs[current]]);
    setCurrent((prev) => prev + 1);
  };
  const handleReject = (jobId: string) => {
    setCurrent((prev) => prev + 1);
  };
  const handleSave = (jobId: string) => {
    setSaved((prev) => {
      const job = jobs.find((j) => j.id === jobId);
      if (!job) return prev;
      const exists = prev.some((j) => j.id === jobId);
      if (exists) {
        // Remove job if already saved
        return prev.filter((j) => j.id !== jobId);
      } else {
        // Add job if not already saved
        return [...prev, job];
      }
    });
  };

  return (
    <JobContext.Provider value={{ jobs, current, applied, saved, handleAccept, handleReject, handleSave }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobContext(): JobContextType {
  const ctx = useContext(JobContext);
  if (!ctx) throw new Error('useJobContext must be used within a JobProvider');
  return ctx;
}
