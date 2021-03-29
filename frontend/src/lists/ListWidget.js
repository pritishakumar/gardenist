import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addListActionThunk, addPlantActionThunk, removePlantActionThunk } from '../redux/actionCreators';
// Material UI Components
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FilledInput from '@material-ui/core/FilledInput';
import Button from '@material-ui/core/Button';
// Material UI Icons and Style Hook
import RemoveCircleTwoToneIcon from '@material-ui/icons/RemoveCircleTwoTone';
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
	input: {
		margin: '5px'
	}
}));

/** Displays a Component that is rendered within the
 * ../plants/PlantDetail or ../plants/PlantTile Components. It will only
 * render if the user is logged in. Widget allows user
 * access to their lists, so they can add plants to 
 * any of their lists.
 * 
 * Authorization: logged in with valid Bearer token
 */
function ListWidget({ data }) {
	const { id: currPlantId, common: currCommon } = data;
	const [ newListName, setNewListName ] = useState('');
	const lists = useSelector((state) => state.lists);
	const token = useSelector((state) => state.token);
	const dispatch = useDispatch();
	const classes = useStyles();

	if (!token) {
		return null;
	}

	async function handleListAdd(plantAddId, commonAdd) {
		if (!newListName) {
			return;
		}
		const newId = await dispatch(addListActionThunk(newListName, token));
		await handlePlantAdd(newId, plantAddId, commonAdd, token);
		setNewListName('');
	}

	async function handlePlantAdd(listAddId, plantAddId, commonAdd) {
		await dispatch(addPlantActionThunk(listAddId, plantAddId, commonAdd, token));
	}

	async function handlePlantRemove(listRemoveId, plantRemoveId) {
		await dispatch(removePlantActionThunk(listRemoveId, plantRemoveId, token));
	}

	const dynamicContent = [];
	for (let [ listId, contents ] of Object.entries(lists)) {
		let listName = contents.listName;
		let icon = '';
		if (contents.plants[currPlantId]) {
			icon = (
				<Button
					onClick={() => {
						handlePlantRemove(listId, currPlantId);
					}}
					color="transparent"
				>
					<RemoveCircleTwoToneIcon color="primary" />
					<Typography variant="srOnly">Remove this plant from the list</Typography>
				</Button>
			);
		} else {
			icon = (
				<Button
					onClick={() => {
						handlePlantAdd(listId, currPlantId, currCommon);
					}}
					color="transparent"
				>
					<AddCircleTwoToneIcon color="primary" />
					<Typography variant="srOnly">Add this plant to the list</Typography>
				</Button>
			);
		}
		dynamicContent.push(
			<div data-listid={listId}>
				{icon}
				<Link to={`/lists/${listId}`}>
					<span>{listName}</span>
				</Link>
			</div>
		);
	}

	return (
		<div className="ListWidget" data-plantid={currPlantId}>
			<hr />
			<Typography variant="h6">Your Lists:</Typography>
			{dynamicContent}
			<br />
			<FormControl variant="filled">
				<InputLabel className={classes.input} htmlFor="new-list">
					Add this to a New List:
				</InputLabel>
				<FilledInput
					name="new-list"
					id="new-list"
					value={newListName}
					onChange={(evt) => setNewListName(evt.target.value)}
					placeholder="Name of List"
				/>
			</FormControl>
			<br />
			<Button
				variant="contained"
				color="primary"
				onClick={() => {
					handleListAdd(currPlantId, currCommon);
				}}
			>
				Add Plant to New List
			</Button>
		</div>
	);
}

export default ListWidget;
