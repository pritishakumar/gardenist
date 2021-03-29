import React from 'react';
import { editUserActionThunk, deleteUserActionThunk } from '../redux/actionCreators';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// Components from within this project
import UserForm from './UserForm';
// Material UI Components
import Container from '@material-ui/core/Container';
// Material UI Style Hook
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

/** Component that is rendered by ./Home Component.
 * It is a wrapper Component, that renders and 
 * customizes ./UserForm Component to edit the 
 * user's information
 * 
 * Authorization: logged in with valid Bearer token
 */
function UserEdit() {
	const user = useSelector((state) => state.user);
	const token = useSelector((state) => state.token);
	const history = useHistory();
	const dispatch = useDispatch();
	const classes = useStyles();

	async function editHandler(data) {
		const email = user.email;
		const password = data.passwordConfirm;
		const formData = { ...data };
		if (!formData.password) {
			delete formData.password;
		}
		delete formData.passwordConfirm;
		const input = { email, password, formData };
		const result = await dispatch(editUserActionThunk(input, token));
		if (result) {
			return 'Edit successful!';
		}
	}

	async function handleDelete(password) {
		const email = user.email;
		const res = await dispatch(deleteUserActionThunk({ email, password }, token));
		if (res) {
			alert('User Deleted');
			history.push('/');
		} else {
			alert('Something went wrong!');
		}
	}

	return (
		<div className="UserEdit">
			<Container className={classes.container}>
				<h4>Edit your account information. You can change your first name or password in our system.</h4>
				<UserForm actionHandler={editHandler} mode="Edit" deleteFxn={handleDelete} />
			</Container>
		</div>
	);
}

export default UserEdit;
