import { useState, useEffect } from "react";
import { JOB_TYPES, EXPERIENCE_LEVELS, LOCATION, INDUSTRIES } from "../../utils/constants";
import './jobs.css';

export default function JobSearch({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        location: 'all',
        jobType: 'all',
        experienceLevel: 'all',
        industry: 'all',
        salaryRange: 'all'
    });
    const [showAdvanced, setShowAdvanced] = useState(false);
    // const {searchJobs, fetchJobs} = useJobs;

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            if (searchTerm.trim()) {
                await searchJobs(searchTerm, filters);
            } else {
                await fetchJobs(filters);
            }
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            location: 'all',
            jobType: 'all',
            experienceLevel: 'all',
            industry: 'all',
            salaryRange: 'all'
        });
    }

    return (
        <div className="job-search">

        </div>
    )
}