import { IdeasContext } from '../../context/IdeasContext';
import { AuthContext } from '../../context/AuthContext';
import Spinner from '../layout/Spinner';
import { useEffect, useContext, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AlertContext } from '../../context/AlertContext';
import axios from '../../utils/axiosConfig';


const IdeaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { idea, getIdeaById, deleteIdea, expressInterest, loading, error } = useContext(IdeasContext);
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [explanation, setExplanation] = useState(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  useEffect(() => {
    console.log('IdeaDetail: Loading idea with ID:', id);
    getIdeaById(id);
    fetchExplanation();
    // eslint-disable-next-line
  }, [id]);

  const fetchExplanation = async () => {
    try {
      setLoadingExplanation(true);
      const res = await axios.get(`/api/ideas/${id}/explanation`);
      setExplanation(res.data);
      setLoadingExplanation(false);
    } catch (err) {
      console.error('Error fetching explanation:', err);
      setLoadingExplanation(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      deleteIdea(id);
      setAlert('Idea deleted successfully', 'success');
      navigate('/ideas');
    }
  };

  const handleInterest = () => {
    expressInterest(id);
    setAlert('Interest expressed successfully', 'success');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">
          <h3>Error Loading Idea</h3>
          <p>{error}</p>
          <Link to="/ideas" className="btn btn-primary">
            Back to Ideas
          </Link>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="container">
        <div className="alert alert-warning">
          <h3>Idea Not Found</h3>
          <p>The idea you're looking for doesn't exist or has been removed.</p>
          <Link to="/ideas" className="btn btn-primary">
            Back to Ideas
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    category,
    targetAudience,
    requiredFunding,
    expectedImpact,
    implementationPlan,
    successRate,
    author,
    interestedFunders,
    createdAt
  } = idea;

  return (
    <div className="idea-detail">
      <Link to="/ideas" className="btn btn-light">
        <i className="fas fa-arrow-left"></i> Back to Ideas
      </Link>
      
      {user && user._id === author._id && (
        <div className="idea-actions my-1">
          <Link to={`/edit-idea/${id}`} className="btn btn-dark">
            <i className="fas fa-edit"></i> Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            <i className="fas fa-trash"></i> Delete
          </button>
        </div>
      )}
      
      <div className="card">
        <h1 className="text-primary">{title}</h1>
        
        <div className="idea-meta my-1">
          <span className={`idea-category ${category}`}>{category}</span>
          <span>
            <i className="fas fa-calendar"></i> Posted on {formatDate(createdAt)}
          </span>
          <span>
            <i className="fas fa-user"></i> By{' '}
            <Link to={`/profile/${author._id}`}>{author.name}</Link>
          </span>
        </div>
        
        {successRate !== null && (
          <div className="success-rate my-1">
            <h3>Success Rate Prediction</h3>
            <div className="success-rate-bar">
              <div 
                className="success-rate-fill" 
                style={{ width: `${successRate * 100}%` }}
              ></div>
            </div>
            <span>{Math.round(successRate * 100)}% predicted success rate</span>
            
            {explanation && !loadingExplanation && (
              <div className="explanation mt-1">
                <h4>Factors affecting prediction:</h4>
                <ul className="list">
                  {explanation.explanation.map((factor, index) => (
                    <li key={index} className={`text-${factor.impact === 'positive' ? 'success' : 'danger'}`}>
                      <i className={`fas fa-${factor.impact === 'positive' ? 'plus' : 'minus'}-circle`}></i> {factor.explanation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {loadingExplanation && <p>Loading explanation...</p>}
          </div>
        )}
        
        <div className="idea-details">
          <div className="grid-2">
            <div>
              <h3>Description</h3>
              <p>{description}</p>
              
              <h3>Target Audience</h3>
              <p>{targetAudience}</p>
              
              <h3>Required Funding</h3>
              <p>{formatCurrency(requiredFunding)}</p>
            </div>
            
            <div>
              <h3>Expected Impact</h3>
              <p>{expectedImpact || 'Not specified'}</p>
              
              <h3>Implementation Plan</h3>
              <p>{implementationPlan || 'Not specified'}</p>
              
              <h3>Interested Funders ({interestedFunders.length})</h3>
              {interestedFunders.length > 0 ? (
                <ul className="list">
                  {interestedFunders.map(funder => (
                    <li key={funder._id}>
                      <Link to={`/profile/${funder._id}`}>{funder.name}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No funders have expressed interest yet</p>
              )}
            </div>
          </div>
        </div>
        
        {user && user.role === 'funder' && (
          <div className="my-1">
            <button 
              onClick={handleInterest} 
              className="btn btn-success"
              disabled={interestedFunders.some(f => f._id === user._id || f === user._id)}
            >
              {interestedFunders.some(f => f._id === user._id || f === user._id) 
                ? 'Already Interested' 
                : 'Express Interest'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaDetail;

