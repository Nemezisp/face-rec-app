import {useReducer, createContext} from 'react';

export const StoreContext = createContext();

export const ACTION_TYPES = {
  SET_USER: 'SET_USER',
  SET_MODE: 'SET_MODE',
  SET_ROUTE: 'SET_ROUTE',
  SET_CURRENT_FACE: 'SET_CURRENT_FACE'
}

const storeReducer = (state, action) => {
  switch(action.type) {
    case ACTION_TYPES.SET_USER: {
      return {...state, user: action.payload}
    }
    case ACTION_TYPES.SET_MODE: {
      return {...state, mode: action.payload}
    }
    case ACTION_TYPES.SET_ROUTE: {
      return {...state, route: action.payload}
    }
    case ACTION_TYPES.SET_CURRENT_FACE: {
      return {...state, currentFaceIndex: action.payload}
    }
    default: {
      return state
    }
  }
} 

const StoreProvider = ({children}) => {
  const initialState = {
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: '',
      profile_picture_url: ''
    },
    mode: 'face',
    route: 'signin',
    currentFaceIndex: null
  }

  const [state, dispatch] = useReducer(storeReducer, initialState)

  return (
    <StoreContext.Provider value = {{state, dispatch}}>
      {children}
    </StoreContext.Provider>
  )
}

export default StoreProvider;