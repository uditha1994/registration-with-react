import { createContext, useContext, useState, useEffect } from "react";
import {
    collection, addDoc, getDocs, getDoc,
    doc, updateDoc, deleteDoc, query, where,
    orderBy, limit, startAt, startAfter, serverTimestamp
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "./AuthContext";

//create Job context
const JobContext = createContext();

//cutom hook to use job context
export function useJobs() {
    return useContext(JobContext);
}

//Job provider component
export function JobProvider({ children }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const { currentUser, userProfile } = useAuth();

    //post a new job 
    async function postJob(jobData) {
        try {
            if (!currentUser || userProfile?.userType !== 'company') {
                throw new Error('Only companies can post jobs');
            }
            const jobDoc = {
                ...jobData,
                companyId: currentUser.uid,
                companyName: userProfile.companyName,
                companyLogo: userProfile.logo || '',
                postedAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                isActive: true,
                applicationCount: 0
            };

            const docref = await addDoc(collection(db, 'jobs'), jobDoc);
            return docref.id;
        } catch (error) {
            throw error;
        }
    }

    //fetch jobs - with filters & pagination
    async function fetchJobs(filters = {}, loadMore = false) {
        try {
            setLoading(true);

            const jobQuery = collection(db, 'jobs');
            let contsrains = [where('isActive', '===', true)];

            //apply filters
            if (filters.location && filters.location !== 'all') {
                contsrains.push(where('location', '==', filters.location));
            }
            if (filters.jobType && filters.jobType !== 'all') {
                contsrains.push(where('jobType', '==', filters.jobType));
            }
            if (filters.experienceLevel && filters.experienceLevel !== 'all') {
                contsrains.push(where('experienceLevel', '==', filters.experienceLevel));
            }
            if (filters.industry && filters.industry !== 'all') {
                contsrains.push(where('industry', '==', filters.industry));
            }

            //add ordering and pagination
            contsrains.push(orderBy('postedAt', 'desc'));
            contsrains.push(limit(10));

            if (loadMore && lastDoc) {
                contsrains.push(startAfter(lastDoc));
            }

            jobQuery = query(jobQuery, ...contsrains);
            const snapshot = await getDocs(jobQuery);

            const jobList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            if (loadMore) {
                setJobs(prev => [...prev, ...jobList]);
            } else {
                setJobs(jobList);
            }

            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
            setHasMore(snapshot.docs.length === 10);

            return jobList;

        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    //search jobs by title or company
    async function searchJobs(searchTerm, filters = {}) {
        try {
            setLoading(true);

            const jobQuery = collection(db, 'jobs');
            let contsrains = [where('isActive', '===', true)];

            //apply filters
            if (filters.location && filters.location !== 'all') {
                contsrains.push(where('location', '==', filters.location));
            }
            if (filters.jobType && filters.jobType !== 'all') {
                contsrains.push(where('jobType', '==', filters.jobType));
            }

            contsrains.push(orderBy('postedAt', 'desc'));
            jobQuery = query(jobQuery, ...contsrains);

            const snapshot = await getDocs(jobQuery);
            let joblist = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                joblist = joblist.filter(job =>
                    job.title?.toLowerCase().includes(searchLower) ||
                    job.companyName?.toLowerCase().includes(searchLower) ||
                    job.description?.toLowerCase().includes(searchLower) ||
                    job.skills?.some(skill => skill.toLowerCase().includes(searchLower))
                );
            }

            setJobs(joblist);
            return joblist;

        } catch (error) {
            console.error('Error searching jobs', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    //get single job by id
    async function getJobById(jobid) {
        try {
            const jobDoc = await getDoc(doc(db, 'jobs', jobid));
            if (jobDoc.exists()) {
                return {
                    id: jobDoc.id,
                    ...jobDoc.data()
                };
            }
            return null;
        } catch (error) {
            console.error('Error searching job', error);
            throw error;
        }
    }

    //get job posts for current company
    async function getCompanyJobs() {
        try {
            if (!currentUser || userProfile?.userType !== 'company') {
                return [];
            }

            const jobQuery = query(
                collection(db, 'jobs'),
                where('companyId', '===', currentUser.uid),
                orderBy('postedAt', 'desc')
            );
            const snapshot = await getDocs(jobQuery);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching company jobs", error);
            throw error;
        }
    }

    //update job
    async function updateJob(jobId, updates) {
        try {
            if (!currentUser || userProfile?.userType !== 'company') {
                throw new Error('Only comapies can update jobs');
            }
            const updateData = {
                ...updates,
                updatedAt: serverTimestamp()
            }
            await updateDoc(doc(db, 'jobs', jobId), updateData);
            return true;
        } catch (error) {
            throw error;
        }
    }

    //delete job

    //apply to job
    async function applyToJob(jobId, applicationData) {
        try {
            if (!currentUser || userProfile?.userType !== 'jobSeeker') {
                throw new Error('Only job seeeker can apply to jobs');
            }

            const application = {
                ...applicationData,
                applicantId: currentUser.uid,
                applicantName: userProfile.firstName + ' ' + userProfile.lastName,
                applicantEmail: userProfile.email,
                appliedAt: serverTimestamp(),
                status: 'pending'
            };

            await addDoc(collection(db, 'applications'), application);
        } catch (error) {

        }
    }

} 