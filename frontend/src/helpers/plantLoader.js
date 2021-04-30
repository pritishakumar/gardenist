import axios from 'axios';

/** Makes an axios call to the backend API to load a specific
 * plant, without involvement with the Redux store. 
 * Input: plantId
 * Output: {plant: {plantObj}} or null if invalid id (id not
 * found or id not an integer)
 * */

async function plantLoader(plantId) {
	if (Number(plantId) !== Math.round(plantId)) {
		return null;
	}
	const url = `http://localhost:3001/api/plants/${plantId}`;
	const res = await axios.get(url);
	if (!res) {
		return null;
	}
	return res.data;
}

export default plantLoader;
