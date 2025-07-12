import { useContext, useEffect, useState } from 'react';
import { IdeasContext } from '../../context/IdeasContext';
import IdeaItem from './IdeaItem';
import Spinner from '../layout/Spinner';

const Ideas = () => {
  const { ideas, getIdeas, loading } = useContext(IdeasContext);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minFunding: '',
    maxFunding: '',
    sortBy: 'newest'
  });

  useEffect(() => {
    getIdeas();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (ideas) {
      console.log('Ideas component: Received ideas:', ideas.length);
      ideas.forEach(idea => {
        console.log(`Idea ${idea._id}: ${idea.title} - Interested: ${idea.interestedFunders?.length || 0}`);
      });
      applyFilters();
    }
    // eslint-disable-next-line
  }, [ideas, filters]);

  const applyFilters = () => {
    let result = [...ideas];

    // Filter by category
    if (filters.category) {
      result = result.filter(idea => idea.category === filters.category);
    }

    // Filter by funding range
    if (filters.minFunding) {
      result = result.filter(idea => idea.requiredFunding >= parseInt(filters.minFunding));
    }
    if (filters.maxFunding) {
      result = result.filter(idea => idea.requiredFunding <= parseInt(filters.maxFunding));
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'highestFunding':
        result.sort((a, b) => b.requiredFunding - a.requiredFunding);
        break;
      case 'lowestFunding':
        result.sort((a, b) => a.requiredFunding - b.requiredFunding);
        break;
      case 'highestSuccess':
        result.sort((a, b) => (b.successRate || 0) - (a.successRate || 0));
        break;
      case 'lowestSuccess':
        result.sort((a, b) => (a.successRate || 0) - (b.successRate || 0));
        break;
      default:
        break;
    }

    setFilteredIdeas(result);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="ideas-container">
      <div className="section-header">
        <h1>Browse Ideas</h1>
        <p>
          <i className="fas fa-lightbulb"></i> Discover innovative rural development ideas from our community
        </p>
      </div>

      <div className="filter-container card">
        <h3>Filter Ideas</h3>
        <div className="grid-4">
          <div>
            <label htmlFor="category">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="agriculture">Agriculture</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="technology">Technology</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="minFunding">Min Funding ($)</label>
            <input
              type="number"
              name="minFunding"
              value={filters.minFunding}
              onChange={handleFilterChange}
              placeholder="Min Funding"
            />
          </div>
          <div>
            <label htmlFor="maxFunding">Max Funding ($)</label>
            <input
              type="number"
              name="maxFunding"
              value={filters.maxFunding}
              onChange={handleFilterChange}
              placeholder="Max Funding"
            />
          </div>
          <div>
            <label htmlFor="sortBy">Sort By</label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highestFunding">Highest Funding</option>
              <option value="lowestFunding">Lowest Funding</option>
              <option value="highestSuccess">Highest Success Rate</option>
              <option value="lowestSuccess">Lowest Success Rate</option>
            </select>
          </div>
        </div>
      </div>

      <div className="ideas">
        {filteredIdeas.length > 0 ? (
          filteredIdeas.map(idea => <IdeaItem key={idea._id} idea={idea} />)
        ) : (
          <p>No ideas found matching your criteria</p>
        )}
      </div>
    </div>
  );
};

export default Ideas;