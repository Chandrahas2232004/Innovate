import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import IdeaItem from '../ideas/IdeaItem';
import Spinner from '../layout/Spinner';
import axios from '../../utils/axiosConfig';

const Profile = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [profile, setProfile] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await axios.get(`/api/users/${id}`);
        setProfile(profileRes.data);
        
        const ideasRes = await axios.get(`/api/users/${id}/ideas`);
        setIdeas(ideasRes.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile');
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [id]);
  
  if (loading) {
    return <Spinner />;
  }
  
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  
  if (!profile) {
    return <div className="alert alert-danger">Profile not found</div>;
  }
  
  return (
    <section className="container">
      <Link to="/dashboard" className="btn btn-light">
        Back to Dashboard
      </Link>
      
      {user && user._id === profile._id && (
        <Link to="/edit-profile" className="btn btn-dark">
          Edit Profile
        </Link>
      )}
      
      <div className="profile-grid my-1">
        <div className="profile-top bg-primary p-2">
          <h1 className="large">{profile.name}</h1>
          <p className="lead">
            {profile.role === 'startuper' && 'Innovator'}
            {profile.role === 'funder' && 'Funder/Investor'}
            {profile.role === 'viewer' && 'Community Member'}
            {profile.location && ` from ${profile.location}`}
          </p>
          <p><i className="fas fa-phone"></i> {profile.mobile}</p>
          <p><i className="fas fa-envelope"></i> {profile.email}</p>
        </div>
        
        {profile.expertise && profile.expertise.length > 0 && (
          <div className="profile-expertise bg-light p-2">
            <h2 className="text-primary">Expertise</h2>
            <div className="skills">
              {profile.expertise.map((exp, index) => (
                <div key={index} className="p-1">
                  <i className="fas fa-check"></i> {exp}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {profile.role === 'startuper' && (
          <div className="profile-ideas bg-white p-2">
            <h2 className="text-primary">Ideas</h2>
            {ideas.length > 0 ? (
              ideas.map(idea => (
                <IdeaItem key={idea._id} idea={idea} showActions={false} />
              ))
            ) : (
              <p>No ideas submitted yet</p>
            )}
          </div>
        )}
        
        {profile.role === 'funder' && (
          <div className="profile-funder bg-white p-2">
            <h2 className="text-primary">Funder Information</h2>
            {profile.fundingInterests && (
              <div className="mb-2">
                <h3>Funding Interests</h3>
                <p>{profile.fundingInterests}</p>
              </div>
            )}
            {profile.investmentRange && (
              <div className="mb-2">
                <h3>Investment Range</h3>
                <p>{profile.investmentRange}</p>
              </div>
            )}
            {profile.preferredCategories && profile.preferredCategories.length > 0 && (
              <div className="mb-2">
                <h3>Preferred Categories</h3>
                <div className="skills">
                  {profile.preferredCategories.map((category, index) => (
                    <div key={index} className="p-1">
                      <i className="fas fa-check"></i> {category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;

