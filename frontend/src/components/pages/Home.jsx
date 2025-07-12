import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { IdeasContext } from '../../context/IdeasContext';
import IdeaItem from '../ideas/IdeaItem';
import Spinner from '../layout/Spinner';

const Home = () => {
  const { isAuthenticated, loadUser } = useContext(AuthContext);
  const { ideas, getIdeas, loading } = useContext(IdeasContext);

  useEffect(() => {
    if (localStorage.token) {
      loadUser();
    }
    getIdeas();
    // eslint-disable-next-line
  }, []);

  const recentIdeas = ideas.slice(0, 3);

  return (
    <div>
      <section className="landing">
        <div className="dark-overlay">
          <div className="landing-inner">
            <h1>Rural Innovation Platform</h1>
            <p className="lead">
              Empowering rural communities through innovative ideas and sustainable funding
            </p>
            <div className="buttons">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary">
                  <i className="fas fa-tachometer-alt"></i> Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary">
                    <i className="fas fa-user-plus"></i> Sign Up
                  </Link>
                  <Link to="/login" className="btn btn-light">
                    <i className="fas fa-sign-in-alt"></i> Login
                  </Link>
                </>
              )}
              <Link to="/ideas" className="btn btn-success">
                <i className="fas fa-lightbulb"></i> Browse Ideas
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="section-header">
          <h1>How It Works</h1>
          <p>Join our platform to connect, innovate, and grow rural communities</p>
        </div>

        <div className="grid-3">
          <div className="card text-center">
            <div className="feature-icon">
              <i className="fas fa-lightbulb fa-3x text-primary"></i>
            </div>
            <h3>Share Your Ideas</h3>
            <p>Rural entrepreneurs can share innovative ideas for community development and sustainability.</p>
          </div>

          <div className="card text-center">
            <div className="feature-icon">
              <i className="fas fa-handshake fa-3x text-success"></i>
            </div>
            <h3>Connect with Funders</h3>
            <p>Investors and funders can discover promising projects and express interest in funding them.</p>
          </div>

          <div className="card text-center">
            <div className="feature-icon">
              <i className="fas fa-chart-line fa-3x text-accent"></i>
            </div>
            <h3>Grow Together</h3>
            <p>Build sustainable partnerships that benefit both rural communities and investors.</p>
          </div>
        </div>

        {!loading && recentIdeas.length > 0 && (
          <div className="section-header">
            <h1>Recent Ideas</h1>
            <p>Discover the latest innovative projects from our community</p>
          </div>
        )}

        {loading ? (
          <Spinner />
        ) : (
          recentIdeas.length > 0 && (
            <div className="ideas">
              {recentIdeas.map(idea => (
                <IdeaItem key={idea._id} idea={idea} showActions={false} />
              ))}
            </div>
          )
        )}

        {!loading && recentIdeas.length > 0 && (
          <div className="text-center my-3">
            <Link to="/ideas" className="btn btn-primary">
              <i className="fas fa-arrow-right"></i> View All Ideas
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
