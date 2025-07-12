import { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from '../../context/AuthContext';
import { IdeasContext } from '../../context/IdeasContext';
import { AlertContext } from '../../context/AlertContext';

const IdeaItem = ({ idea, showActions = true }) => {
  const { user } = useContext(AuthContext);
  const { deleteIdea, expressInterest } = useContext(IdeasContext);
  const { setAlert } = useContext(AlertContext);

  const {
    _id,
    title,
    description,
    category,
    requiredFunding,
    successRate,
    author,
    interestedFunders
  } = idea;

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      deleteIdea(_id);
      setAlert('Idea deleted successfully', 'success');
    }
  };

  const handleInterest = () => {
    console.log('IdeaItem: Expressing interest in idea:', _id);
    console.log('IdeaItem: Current interestedFunders:', interestedFunders);
    expressInterest(_id);
    setAlert('Interest expressed successfully', 'success');
  };

  const getCategoryClass = (cat) => {
    return `idea-category ${cat}`;
  };

  return (
    <div className="idea-item">
      <div className="idea-header">
        <h3>
          <Link to={`/ideas/${_id}`}>{title}</Link>
        </h3>
        <span className={getCategoryClass(category)}>{category}</span>
      </div>
      
      <div className="idea-meta">
        <span>
          <i className="fas fa-user"></i> {author?.name || 'Unknown User'}
        </span>
        <span>
          <i className="fas fa-money-bill-wave"></i> {formatCurrency(requiredFunding)}
        </span>
        <span>
          <i className="fas fa-users"></i> {interestedFunders?.length || 0} interested
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <small style={{color: 'red'}}> (Debug: {JSON.stringify(interestedFunders?.map(f => f._id || f))})</small>
          )}
        </span>
      </div>
      
      <p>{truncateText(description, 150)}</p>
      
      {successRate !== null && (
        <div className="success-rate">
          <div className="success-rate-bar">
            <div 
              className="success-rate-fill" 
              style={{ width: `${successRate * 100}%` }}
            ></div>
          </div>
          <span>{Math.round(successRate * 100)}% success rate</span>
        </div>
      )}
      
      {showActions && (
        <div className="mt-2">
          <Link to={`/ideas/${_id}`} className="btn btn-primary">
            View Details
          </Link>
          
          {user && user.role === 'funder' && (
            <button 
              onClick={handleInterest} 
              className="btn btn-success m-1"
                          disabled={interestedFunders?.some(f => f._id === user._id || f === user._id)}
          >
            {interestedFunders?.some(f => f._id === user._id || f === user._id)
              ? 'Interested' 
              : 'Express Interest'}
            </button>
          )}
          
          {user && user._id === author?._id && (
            <>
              <Link to={`/edit-idea/${_id}`} className="btn btn-dark m-1">
                Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-danger m-1">
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

IdeaItem.propTypes = {
  idea: PropTypes.object.isRequired,
  showActions: PropTypes.bool
};

export default IdeaItem;

