import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { IdeasContext } from '../../context/IdeasContext';
import IdeaItem from '../ideas/IdeaItem';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { getIdeas, loading } = useContext(IdeasContext);
  const [userIdeas, setUserIdeas] = useState([]);
  const [interestedIdeas, setInterestedIdeas] = useState([]);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getIdeas();
        
        if (user && user._id) {
          try {
            // If user is a startuper, get their ideas
            if (user.role === 'startuper') {
              const res = await axios.get(`/api/users/${user._id}/ideas`);
              setUserIdeas(res.data);
            }
            
            // If user is a funder, get ideas they're interested in
            if (user.role === 'funder') {
              const res = await axios.get('/api/ideas');
              const interested = res.data.filter(idea => 
                idea.interestedFunders && idea.interestedFunders.includes(user._id)
              );
              setInterestedIdeas(interested);
            }
          } catch (err) {
            console.error('Error fetching user data', err);
            setError('Failed to load user data. Please try again later.');
          }
        } else {
          console.log('User data not available yet');
        }
      } catch (err) {
        console.error('Error in dashboard data fetch', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoadingUserData(false);
      }
    };
    
    fetchData();
  }, [ user]);

  if (loading || loadingUserData) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <section className="container">
      <div className="section-header">
        <h1>Dashboard</h1>
        <p>
          <i className="fas fa-user"></i> Welcome back, {user && user.name}
        </p>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {user && user.role === 'startuper' && (
        <div className="dashboard-startuper">
          <div className="card">
            <div className="text-center">
              <h2>Share Your Innovation</h2>
              <p>Submit your rural development ideas and connect with potential funders</p>
              <Link to="/create-idea" className="btn btn-primary">
                <i className="fas fa-plus"></i> Submit New Idea
              </Link>
            </div>
          </div>
          
          <h2>Your Ideas</h2>
          {userIdeas.length > 0 ? (
            <div className="ideas">
              {userIdeas.map(idea => (
                <IdeaItem key={idea._id} idea={idea} showActions={true} />
              ))}
            </div>
          ) : (
            <p>You haven't submitted any ideas yet</p>
          )}
        </div>
      )}
      
      {user && user.role === 'funder' && (
        <div className="dashboard-funder">
          <div className="card">
            <div className="text-center">
              <h2>Investment Opportunities</h2>
              <p>Discover and support innovative rural development projects</p>
              <Link to="/ideas" className="btn btn-primary">
                <i className="fas fa-search"></i> Browse All Ideas
              </Link>
            </div>
          </div>
          
          <h2>Ideas You're Interested In</h2>
          {interestedIdeas.length > 0 ? (
            <div className="ideas">
              {interestedIdeas.map(idea => (
                <IdeaItem key={idea._id} idea={idea} showActions={true} />
              ))}
            </div>
          ) : (
            <p>You haven't expressed interest in any ideas yet</p>
          )}
        </div>
      )}
      
      {user && user.role === 'viewer' && (
        <div className="dashboard-viewer">
          <div className="card">
            <div className="text-center">
              <h2>Welcome to Rural Innovation</h2>
              <p>Explore innovative ideas and connect with the rural development community</p>
              <Link to="/ideas" className="btn btn-primary">
                <i className="fas fa-lightbulb"></i> Explore Ideas
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Dashboard;


