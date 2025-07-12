import { createContext, useReducer } from 'react';
import axios from '../utils/axiosConfig';

const IdeasContext = createContext();

const ideasReducer = (state, action) => {
  switch (action.type) {
    case 'GET_IDEAS':
      return {
        ...state,
        ideas: action.payload,
        loading: false
      };
    case 'GET_IDEA':
      return {
        ...state,
        idea: action.payload,
        loading: false
      };
    case 'ADD_IDEA':
      return {
        ...state,
        ideas: [action.payload, ...state.ideas],
        loading: false
      };
    case 'UPDATE_IDEA':
      return {
        ...state,
        ideas: state.ideas.map(idea =>
          idea._id === action.payload._id ? action.payload : idea
        ),
        idea: action.payload,
        loading: false
      };
    case 'DELETE_IDEA':
      return {
        ...state,
        ideas: state.ideas.filter(idea => idea._id !== action.payload),
        loading: false
      };
    case 'EXPRESS_INTEREST':
      return {
        ...state,
        ideas: state.ideas.map(idea =>
          idea._id === action.payload._id ? action.payload : idea
        ),
        idea: state.idea?._id === action.payload._id ? action.payload : state.idea,
        loading: false
      };
    case 'IDEA_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    case 'CLEAR_IDEA':
      return {
        ...state,
        idea: null
      };
    default:
      return state;
  }
};

const IdeasProvider = ({ children }) => {
  const initialState = {
    ideas: [],
    idea: null,
    loading: true,
    error: null
  };

  const [state, dispatch] = useReducer(ideasReducer, initialState);

  // Get all ideas
  const getIdeas = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get('/api/ideas');
      dispatch({
        type: 'GET_IDEAS',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'IDEA_ERROR',
        payload: err.response?.data.msg || 'Error fetching ideas'
      });
    }
  };

  // Get idea by ID
  const getIdeaById = async (id) => {
    try {
      console.log('IdeasContext: Fetching idea with ID:', id);
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get(`/api/ideas/${id}`);
      console.log('IdeasContext: Idea fetched successfully:', res.data);
      dispatch({
        type: 'GET_IDEA',
        payload: res.data
      });
    } catch (err) {
      console.error('IdeasContext: Error fetching idea:', err);
      dispatch({
        type: 'IDEA_ERROR',
        payload: err.response?.data.msg || 'Error fetching idea'
      });
    }
  };

  // Add idea
  const addIdea = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.post('/api/ideas', formData, config);
      dispatch({
        type: 'ADD_IDEA',
        payload: res.data
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'IDEA_ERROR',
        payload: err.response?.data.msg || 'Error creating idea'
      });
      throw err;
    }
  };

  // Update idea
  const updateIdea = async (id, formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.put(`/api/ideas/${id}`, formData, config);
      dispatch({
        type: 'UPDATE_IDEA',
        payload: res.data
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'IDEA_ERROR',
        payload: err.response?.data.msg || 'Error updating idea'
      });
      throw err;
    }
  };

  // Delete idea
  const deleteIdea = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await axios.delete(`/api/ideas/${id}`);
      dispatch({
        type: 'DELETE_IDEA',
        payload: id
      });
    } catch (err) {
      dispatch({
        type: 'IDEA_ERROR',
        payload: err.response?.data.msg || 'Error deleting idea'
      });
    }
  };

  // Express interest in idea
  const expressInterest = async (id) => {
    try {
      console.log('IdeasContext: Expressing interest in idea:', id);
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.put(`/api/ideas/${id}/interest`);
      console.log('IdeasContext: Interest expressed successfully:', res.data);
      console.log('IdeasContext: Updated interestedFunders count:', res.data.interestedFunders?.length);
      
      dispatch({
        type: 'EXPRESS_INTEREST',
        payload: res.data
      });
      
      // Also refresh the ideas list to ensure consistency
      setTimeout(() => {
        getIdeas();
      }, 100);
    } catch (err) {
      console.error('IdeasContext: Error expressing interest:', err);
      dispatch({
        type: 'IDEA_ERROR',
        payload: err.response?.data.msg || 'Error expressing interest'
      });
    }
  };

  // Clear current idea
  const clearIdea = () => {
    dispatch({ type: 'CLEAR_IDEA' });
  };

  return (
    <IdeasContext.Provider
      value={{
        ideas: state.ideas,
        idea: state.idea,
        loading: state.loading,
        error: state.error,
        getIdeas,
        getIdeaById,
        addIdea,
        updateIdea,
        deleteIdea,
        expressInterest,
        clearIdea
      }}
    >
      {children}
    </IdeasContext.Provider>
  );
};

export { IdeasContext, IdeasProvider };

