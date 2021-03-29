import axios from 'axios';
import {
	REGISTER,
	LOGIN,
	REMOVE_USER,
	EDIT_USER,
	ADD_LIST,
	ADD_PLANT,
	REMOVE_PLANT,
	DELETE_LIST,
	SEARCH_PLANTS
} from './actionTypes';

const API_URL = `http://localhost:3001/api`;

// USER ACTION CREATORS ////////////////////////////////////////////////////////////////////

/** Registers a new user */
const registerAction = (data) => ({
	type: REGISTER,
	payload: data //{user:{email, name}, token}
});
const registerActionThunk = (data) => {
	return async (dispatch) => {
		try {
			const url = `${API_URL}/user/register`;
			let res = await axios.post(url, data);
			dispatch(registerAction(res.data));
			return true;
		} catch (err) {
			alert(err);
			return false;
		}
	};
};

/** Login as user */
const loginAction = (data) => ({
	type: LOGIN,
	payload: data //{user:{email, name}, token, lists}
});
const loginActionThunk = (data) => {
	return async (dispatch) => {
		try {
			const url = `${API_URL}/user/login`;
			let res = await axios.post(url, data);
			dispatch(loginAction(res.data));
			return true;
		} catch (err) {
			alert(err);
			return false;
		}
	};
};

/** Logout of user account
 * Used for both logging out and deleting user
 */
const removeUserAction = () => ({
	type: REMOVE_USER
});

/** Delete user account */
const deleteUserActionThunk = (data, token) => {
	return async (dispatch) => {
		try {
			const config = {
				data,
				headers: { Authorization: `Bearer ${token}` }
			};
			const url = `${API_URL}/user/delete`;
			let res = await axios.delete(url, config);
			dispatch(removeUserAction());
			return true;
		} catch (err) {
			alert(err);
			return false;
		}
	};
};

/** Edit the logged in user */
const editUserAction = (data) => ({
	type: EDIT_USER,
	payload: data //{user:{email, name}, token}
});
const editUserActionThunk = (data, token) => {
	return async (dispatch) => {
		try {
			const config = {
				headers: { Authorization: `Bearer ${token}` }
			};
			const url = `${API_URL}/user/edit`;
			let res = await axios.patch(url, data, config);
			dispatch(editUserAction(res.data));
			return true;
		} catch (err) {
			alert(err);
			return false;
		}
	};
};

// LIST ACTION CREATORS ////////////////////////////////////////////////////////////////////

/** Creates a new list */
const addListAction = (data) => ({
	type: ADD_LIST,
	payload: data //{list: {list_id, list_name}}
});
const addListActionThunk = (listName, token) => {
	return async (dispatch) => {
		try {
			const config = {
				headers: { Authorization: `Bearer ${token}` }
			};
			const url = `${API_URL}/lists/new`;
			let res = await axios.post(url, { listName }, config);
			dispatch(addListAction(res.data));
			return res.data.list.list_id;
		} catch (err) {
			alert(err);
			return false;
		}
	};
};

/** Add specific plant to a list */
const addPlantAction = (data) => ({
	type: ADD_PLANT,
	payload: data //{list: {list_id, plant_id, common}
});
const addPlantActionThunk = (listId, plantId, common, token) => {
	return async (dispatch) => {
		try {
			const config = {
				headers: { Authorization: `Bearer ${token}` }
			};
			const url = `${API_URL}/lists/${listId}/${plantId}`;
			let res = await axios.post(url, { common }, config);
			dispatch(addPlantAction(res.data));
			return true;
		} catch (err) {
			alert(err);
			return false;
		}
	};
};

/** Remove specific plant from a list */
const removePlantAction = (data) => ({
	type: REMOVE_PLANT,
	payload: data //{list: {list_id, plant_id}}
});
const removePlantActionThunk = (listId, plantId, token) => {
	return async (dispatch) => {
		try {
			const config = {
				headers: { Authorization: `Bearer ${token}` }
			};
			const url = `${API_URL}/lists/${listId}/${plantId}`;
			let res = await axios.delete(url, config);
			dispatch(removePlantAction(res.data));
			return true;
		} catch (err) {
			alert(err);
			return false;
		}
	};
};

/** Delete a list */
const deleteListAction = (data) => ({
	type: DELETE_LIST,
	payload: data //{list : {list_id}}
});
const deleteListActionThunk = (listId, token) => {
	return async (dispatch) => {
		try {
			const config = {
				headers: { Authorization: `Bearer ${token}` }
			};
			const url = `${API_URL}/lists/${listId}`;
			let res = await axios.delete(url, config);
			dispatch(deleteListAction(res.data));
			return true;
		} catch (err) {
			alert(err);
			return false;
		}
	};
};

/** Search for plants with keyword */
const searchPlantsAction = (data) => ({
	type: SEARCH_PLANTS,
	payload: data //[plantObj,...,plantObj]
});
const searchPlantsActionThunk = (keyword) => {
	return async (dispatch) => {
		try {
			const url = `${API_URL}/plants/search?q=${keyword}`;
			const res = await axios.get(url);
			dispatch(searchPlantsAction(res.data.plants));
			return true;
		} catch (err) {
			alert(err);
			return false;
		}
	};
};

export {
	registerActionThunk,
	loginActionThunk,
	removeUserAction,
	editUserActionThunk,
	deleteUserActionThunk,
	addListActionThunk,
	addPlantActionThunk,
	removePlantActionThunk,
	deleteListActionThunk,
	searchPlantsActionThunk
};
