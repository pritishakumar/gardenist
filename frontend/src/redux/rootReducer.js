import { REGISTER, LOGIN, REMOVE_USER, EDIT_USER } from './actionTypes'; 
import { ADD_LIST, ADD_PLANT, REMOVE_PLANT, DELETE_LIST } from './actionTypes'; 
import { SEARCH_PLANTS } from './actionTypes';
    
const INITIAL_STATE = { user: {}, token: "", lists: {}, searchResults: [] };
const rootReducer = (state = INITIAL_STATE, action) => {
  let user, token, lists, list;

  switch (action.type) {
    
    /** Registers a new user */
		case REGISTER:
      user = action.payload.user;
      token = action.payload.token
			return {...state, user, token};

    /** Login as user */
    case LOGIN:
      user = action.payload.user;
      token = action.payload.token
      lists = action.payload.lists
			return {...state, user, token, lists};

    /** Remove user account from store */
    case REMOVE_USER:
			return {...state, ...INITIAL_STATE};

    /** Edit the logged in user */
		case EDIT_USER:
      user = action.payload.user;
      token = action.payload.token
			return {...state, user, token};


    // LIST ACTION CREATORS ////////////////

    /** Updates list in store */
		case ADD_LIST:
      list = action.payload.list
      lists = JSON.parse(JSON.stringify(state.lists))
      lists[list.list_id] = {
        listName: list.list_name,
        plants: {}
      }
			return {...state, lists};

    /** Add specific plant to a list */
		case ADD_PLANT:
      list = action.payload.list
      lists = JSON.parse(JSON.stringify(state.lists))
      lists[list.list_id].plants[list.plant_id] = list.common;
			return { ...state, lists };

    /** Remove specific plant from a list */
		case REMOVE_PLANT:
      list = action.payload.list
      lists = JSON.parse(JSON.stringify(state.lists))
      delete lists[list.list_id].plants[list.plant_id];
			return { ...state, lists };

    /** Delete a specific list */
		case DELETE_LIST:
      let listId = action.payload.list.list_id
      lists = JSON.parse(JSON.stringify(state.lists))
      delete lists[listId];
			return { ...state, lists };


    // GENERAL ACTION CREATORS ////////////////
  
    /** Update plant search results */
		case SEARCH_PLANTS:
      const searchResults = action.payload
			return { ...state, searchResults };

    default:
      return {...state};
	}
};

export default rootReducer;
