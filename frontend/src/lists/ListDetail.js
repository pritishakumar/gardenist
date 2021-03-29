import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, useHistory } from 'react-router-dom';
import { removePlantActionThunk, deleteListActionThunk } from '../redux/actionCreators';
// Material UI Components
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
// Material UI Icons and Style Hook
import RemoveCircleTwoToneIcon from '@material-ui/icons/RemoveCircleTwoTone';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
	container: {
		width: '50%',
		borderRadius: '15px',
		border: '1px solid grey',
		padding: '20px',
		marginTop: '20px',
		backgroundColor: 'white'
	}
}));

/** Displays a page showing a specific list of plants,
 * with the option of deleting the existing plants
 * or deleting the specific list.
 * 
 * Authorization: logged in with valid Bearer token
 */
function ListDetail() {
	const lists = useSelector((state) => state.lists);
	const token = useSelector((state) => state.token);
	const { listId: currListId } = useParams();
	const dispatch = useDispatch();
	const history = useHistory();
	const currList = lists[currListId];
	const classes = useStyles();

	if (!currList) {
		history.push('/lists');
		return <p>!!Loading!!</p>;
	}

	async function handlePlantRemove(plantAddId, commonAdd) {
		await dispatch(removePlantActionThunk(plantAddId, commonAdd, token));
	}

	async function handleListDelete(listDeleteId) {
		await dispatch(deleteListActionThunk(listDeleteId, token));
	}

	const dynamicContent = [];
	if (!Object.entries(currList.plants).length) {
		dynamicContent.push(<p>{`No Plants Currently :( Go add some plants!`}</p>);
	} else {
		for (let [ eachPlantId, eachPlantCommon ] of Object.entries(currList.plants)) {
			dynamicContent.push(
				<div key={eachPlantId} data-plantid={eachPlantId}>
					<Button
						onClick={() => {
							handlePlantRemove(currListId, eachPlantId);
						}}
						color="transparent"
					>
						<RemoveCircleTwoToneIcon color="primary" />
						<Typography variant="srOnly">Remove this plant from the list</Typography>
					</Button>
					<Link to={`/search/${eachPlantId}`}>
						<span>{eachPlantCommon}</span>
					</Link>
				</div>
			);
		}
	}

	return (
		<div className="ListDetail" data-listid={currListId}>
			<Container className={classes.container}>
				<h2>List: {currList.listName}</h2>
				<p>Plants currently in this list</p>
				{dynamicContent}
				<br />
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						handleListDelete(currListId);
					}}
				>
					Delete This List
				</Button>
			</Container>
		</div>
	);
}

export default ListDetail;
