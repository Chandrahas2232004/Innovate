import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const EditProfile = () => {
  const { user, updateProfile, error } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    bio: '',
    expertise: '',
    fundingInterests: ''
  });
  
  const [formError, setFormError] = useState('');
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        location: user.location || '',
        bio: user.bio || '',
        expertise: user.expertise ? user.expertise.join(', ') : '',
        fundingInterests: user.fundingInterests || ''
      });
    }
  }, [user]);
  
  const { name, location, bio, expertise, fundingInterests } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    // Convert expertise string to array
    const expertiseArray = expertise
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    const profileData = {
      name,
      location,
      bio,
      expertise: expertiseArray,
      fundingInterests: user.role === 'funder' ? fundingInterests : undefined
    };
    
    const success = await updateProfile(profileData);
    if (success) {
      navigate(`/profile/${user._id}`);
    } else {
      setFormError(error || 'Failed to update profile');
    }
  };
  
  return (
    <section className="container">
      <h1 className="large text-primary">Edit Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Update your information
      </p>
      
      {formError && <div className="alert alert-danger">{formError}</div>}
      
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={onChange}
          />
          <small className="form-text">
            City & state, country, etc.
          </small>
        </div>
        
        <div className="form-group">
          <textarea
            placeholder="A short bio about yourself"
            name="bio"
            value={bio}
            onChange={onChange}
          ></textarea>
          <small className="form-text">
            Tell us about yourself
          </small>
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Expertise (comma separated)"
            name="expertise"
            value={expertise}
            onChange={onChange}
          />
          <small className="form-text">
            e.g. Agriculture, Technology, Education
          </small>
        </div>
        
        {user && user.role === 'funder' && (
          <div className="form-group">
            <textarea
              placeholder="Funding Interests"
              name="fundingInterests"
              value={fundingInterests}
              onChange={onChange}
            ></textarea>
            <small className="form-text">
              Describe what types of projects you're interested in funding
            </small>
          </div>
        )}
        
        <input type="submit" className="btn btn-primary my-1" value="Update Profile" />
      </form>
    </section>
  );
};

export default EditProfile;
