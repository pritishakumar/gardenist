import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PlantTile from './PlantTile';
import SearchBox from './SearchBox';
import { searchPlantsActionThunk } from '../redux/actionCreators';
// Material UI Components
import Container from '@material-ui/core/Container';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
// Material UI Style Hook
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
	resultsArea: {
		display: 'flex',
		flexFlow: 'row wrap',
		justifyContent: 'space-around',
		width: '90%',
		borderRadius: '15px',
		border: '1px solid grey',
		padding: '20px',
		marginTop: '20px',
		backgroundColor: 'white'
	},
	search: {
		width: '50%',
		borderRadius: '15px',
		border: '1px solid grey',
		padding: '20px',
		marginTop: '20px',
		backgroundColor: 'white'
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff'
	}
}));

/** Displays a page to search for plants, and is also the redirect
 * page after a user registers, logs in or updates their user
 * information. Renders ./SearchBox and multiple ./PlantTile
 * Components
 * 
 * Authorization: none, accessible to all
 */
function Search() {
	const searchResults = useSelector((state) => state.searchResults);
	const [ searchQuery, setSearchQuery ] = useState('');
	const [ pageLoadingState, setPageLoadingState ] = useState(false);
	const dispatch = useDispatch();
	const classes = useStyles();

	async function handleSearch(formData) {
		const query = formData.replace(' ', '%20');
		setPageLoadingState(true);
		await dispatch(searchPlantsActionThunk(query));
		setSearchQuery(formData);
		setPageLoadingState(false);
	}

	if (pageLoadingState) {
		return (
			<div>
				"!!Loading!!"
				<Container className={classes.search} align="center">
					<Typography variant="h5">!!Loading!!</Typography>

					<Backdrop className={classes.backdrop} open="true">
						<CircularProgress color="inherit" />
					</Backdrop>
				</Container>
			</div>
		);
	}

	return (
		<div>
			<Container className={classes.search} align="center">
				<SearchBox setFxn={handleSearch} query={searchQuery} />
			</Container>

			<Container className={classes.resultsArea}>
				{!searchResults.length ? (
					<div>
						<Typography variant="h5">...No Search Results...</Typography>
					</div>
				) : (
					searchResults.map((each) => {
						return <PlantTile data={each} key={each.id}/>;
					})
				)}
			</Container>
		</div>
	);
}

export default Search;
