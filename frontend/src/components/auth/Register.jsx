import { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const { register, isAuthenticated, error } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    mobile: '',
    role: 'viewer',
    location: '',
    expertise: '',
    fundingInterests: '',
    investmentRange: '',
    preferredCategories: []
  });

  const { name, email, password, password2, mobile, role, location, expertise, fundingInterests, investmentRange, preferredCategories } = formData;
  const [formError, setFormError] = useState('');

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (password !== password2) {
      setFormError('Passwords do not match');
      return;
    }
    
    // Convert expertise string to array
    const expertiseArray = expertise.split(',').map(item => item.trim()).filter(item => item !== '');
    
    const registerData = {
      name,
      email,
      password,
      mobile,
      role,
      ...(role === 'startuper' && {
        location,
        expertise: expertiseArray
      }),
      ...(role === 'funder' && {
        fundingInterests,
        investmentRange,
        preferredCategories
      })
    };
    
    try {
      const success = await register(registerData);
      
      if (!success) {
        setFormError(error || 'Registration failed');
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setFormError('Registration failed - please try again');
    }
  };
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <section className="container">
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
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
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="tel"
            placeholder="Mobile Number"
            name="mobile"
            value={mobile}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <select name="role" value={role} onChange={onChange} required>
            <option value="viewer">General User</option>
            <option value="startuper">Innovator/Startuper</option>
            <option value="funder">Funder/Investor</option>
          </select>
          <small className="form-text">
            Select your role on the platform
          </small>
        </div>
        
        {/* Startuper-specific fields */}
        {role === 'startuper' && (
          <>
            <div className="form-group">
              <input
                type="text"
                placeholder="Your Location"
                name="location"
                value={location}
                onChange={onChange}
                required
              />
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
          </>
        )}
        
        {/* Funder-specific fields */}
        {role === 'funder' && (
          <>
            <div className="form-group">
              <textarea
                placeholder="Describe your funding interests and criteria"
                name="fundingInterests"
                value={fundingInterests}
                onChange={onChange}
              ></textarea>
              <small className="form-text">
                What types of projects are you interested in funding?
              </small>
            </div>
            <div className="form-group">
              <select name="investmentRange" value={investmentRange} onChange={onChange}>
                <option value="">Select Investment Range</option>
                <option value="$1K-$10K">$1K - $10K</option>
                <option value="$10K-$50K">$10K - $50K</option>
                <option value="$50K-$100K">$50K - $100K</option>
                <option value="$100K+">$100K+</option>
              </select>
            </div>
            <div className="form-group">
              <label>Preferred Categories (select multiple)</label>
              <div className="checkbox-group">
                {['agriculture', 'education', 'healthcare', 'technology', 'infrastructure', 'other'].map(category => (
                  <label key={category} className="checkbox-item">
                    <input
                      type="checkbox"
                      name="preferredCategories"
                      value={category}
                      checked={preferredCategories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            preferredCategories: [...preferredCategories, category]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            preferredCategories: preferredCategories.filter(cat => cat !== category)
                          });
                        }
                      }}
                    />
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </>
        )}
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </section>
  );
};

export default Register;

