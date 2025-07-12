import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IdeasContext } from '../../context/IdeasContext';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

const IdeaForm = () => {
  const { addIdea, updateIdea, getIdeaById, error } = useContext(IdeasContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetAudience: '',
    requiredFunding: '',
    expectedImpact: '',
    implementationPlan: ''
  });
  
  const [formError, setFormError] = useState('');
  
  const {
    title,
    description,
    category,
    targetAudience,
    requiredFunding,
    expectedImpact,
    implementationPlan
  } = formData;
  
  useEffect(() => {
    const loadIdea = async () => {
      if (isEditing) {
        const idea = await getIdeaById(id);
        if (idea) {
          setFormData({
            title: idea.title || '',
            description: idea.description || '',
            category: idea.category || '',
            targetAudience: idea.targetAudience || '',
            requiredFunding: idea.requiredFunding || '',
            expectedImpact: idea.expectedImpact || '',
            implementationPlan: idea.implementationPlan || ''
          });
        }
      }
    };
    
    loadIdea();
  }, [getIdeaById, id, isEditing]);
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    // Validate form
    if (!title || !description || !category || !targetAudience || !requiredFunding) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    // Convert requiredFunding to number
    const ideaData = {
      ...formData,
      requiredFunding: parseFloat(requiredFunding)
    };
    
    let success;
    if (isEditing) {
      success = await updateIdea(id, ideaData);
    } else {
      success = await addIdea(ideaData);
    }
    
    if (success) {
      navigate('/dashboard');
    } else {
      setFormError(error || 'Failed to save idea');
    }
  };
  
  return (
    <section className="container">
      <h1 className="large text-primary">
        {isEditing ? 'Edit Your Idea' : 'Submit Your Idea'}
      </h1>
      <p className="lead">
        <i className="fas fa-lightbulb"></i>{' '}
        {isEditing
          ? 'Make changes to your existing idea'
          : 'Share your innovative idea with the community'}
      </p>
      
      {formError && <div className="alert alert-danger">{formError}</div>}
      
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Title"
            name="title"
            value={title}
            onChange={onChange}
          />
          <small className="form-text">A catchy title for your idea</small>
        </div>
        
        <div className="form-group">
          <textarea
            placeholder="* Description"
            name="description"
            value={description}
            onChange={onChange}
            rows="5"
          ></textarea>
          <small className="form-text">
            Describe your idea in detail
          </small>
        </div>
        
        <div className="form-group">
          <select name="category" value={category} onChange={onChange}>
            <option value="">* Select Category</option>
            <option value="agriculture">Agriculture</option>
            <option value="education">Education</option>
            <option value="healthcare">Healthcare</option>
            <option value="technology">Technology</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="other">Other</option>
          </select>
          <small className="form-text">
            Select the category that best fits your idea
          </small>
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="* Target Audience"
            name="targetAudience"
            value={targetAudience}
            onChange={onChange}
          />
          <small className="form-text">
            Who will benefit from your idea?
          </small>
        </div>
        
        <div className="form-group">
          <input
            type="number"
            placeholder="* Required Funding (USD)"
            name="requiredFunding"
            value={requiredFunding}
            onChange={onChange}
            min="0"
            step="100"
          />
          <small className="form-text">
            Estimated funding needed in USD
          </small>
        </div>
        
        <div className="form-group">
          <textarea
            placeholder="Expected Impact"
            name="expectedImpact"
            value={expectedImpact}
            onChange={onChange}
            rows="3"
          ></textarea>
          <small className="form-text">
            Describe the potential impact of your idea
          </small>
        </div>
        
        <div className="form-group">
          <textarea
            placeholder="Implementation Plan"
            name="implementationPlan"
            value={implementationPlan}
            onChange={onChange}
            rows="3"
          ></textarea>
          <small className="form-text">
            Outline your plan to implement this idea
          </small>
        </div>
        
        <input
          type="submit"
          className="btn btn-primary my-1"
          value={isEditing ? 'Update Idea' : 'Submit Idea'}
        />
      </form>
    </section>
  );
};

export default IdeaForm;
