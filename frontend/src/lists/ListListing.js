import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addListActionThunk, deleteListActionThunk } from '../redux/actionCreators';
// Material UI Components
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FilledInput from '@material-ui/core/FilledInput';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
// Material UI Icons and Style Hook
import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone';
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

/** Displays a page showing all of the lists from
 * the user with the option to create a new list or
 * delete any of the existing lists.
 * 
 * Authorization: logged in with valid Bearer token
 */
function ListListing() {
	const [ newListName, setNewListName ] = useState('');
	const lists = useSelector((state) => state.lists);
	const token = useSelector((state) => state.token);
	const dispatch = useDispatch();
	const classes = useStyles();

	async function handleListAdd() {
		if (!newListName) {
			return;
		}
		const newId = await dispatch(addListActionThunk(newListName, token));
		setNewListName('');
	}

	async function handleListDelete(listDeleteId) {
		await dispatch(deleteListActionThunk(listDeleteId, token));
		setNewListName('');
	}

	const dynamicContent = [];
	for (let [ eachListId, contents ] of Object.entries(lists)) {
		dynamicContent.push(
			<div key={eachListId}>
				<Button
					className={classes.menuButton}
					onClick={() => {
						handleListDelete(eachListId);
					}}
					color="transparent"
				>
					<DeleteForeverTwoToneIcon />
				</Button>

				<Link to={`/lists/${eachListId}`}>
					<span>{contents.listName}</span>
				</Link>
			</div>
		);
	}

	return (
		<div className="ListListing">
			<Container className={classes.container}>
				<FormControl variant="filled">
					<InputLabel htmlFor="new-list">Add a New List: </InputLabel>
					<FilledInput
						name="new-list"
						id="new-list"
						value={newListName}
						onChange={(evt) => setNewListName(evt.target.value)}
						placeholder="Name of List"
					/>
				</FormControl>
				<Button variant="contained" color="primary" onClick={handleListAdd}>
					Add New List
				</Button>
				<br />
				<p> Your Lists: </p>
				{dynamicContent}
			</Container>
		</div>
	);
}

export default ListListing;
