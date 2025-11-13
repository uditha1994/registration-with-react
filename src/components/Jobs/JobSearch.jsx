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
            <div className="search-container">
                <form
                    onSubmit={handleSearch}
                    className="search-form"
                >
                    <div className="search-main">
                        <div className="search-input-group">
                            <input
                                type="text"
                                placeholder="Search jobs, companies"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <button type="submit" className="search-button">
                                <span>🔎</span> Search
                            </button>
                        </div>
                    </div>

                    <div className="search-filters">
                        <div className="filter-row">
                            <select
                                value={filters.location}
                                onChange={(e) => handleFilterChange
                                    ('location', e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Job Types</option>
                                {Object.values(JOB_TYPES).map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}