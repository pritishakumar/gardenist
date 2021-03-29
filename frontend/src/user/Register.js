import React from 'react';
import { registerActionThunk } from '../redux/actionCreators';
import { useDispatch } from 'react-redux';
// Components from within this project
import UserForm from './UserForm';
// Material UI Components
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

/** Component that is rendered by ./Home Component.
 * It is a wrapper Component, that renders and 
 * customizes ./UserForm Component to register the 
 * user
 * 
 * Authorization: none, accessible for all
 */
function Register() {
	const dispatch = useDispatch();

	async function registerHandler(data) {
		const result = await dispatch(registerActionThunk(data));
		if (result) {
			return 'Registration successful!';
		}
	}

	return (
		<Card className="Register">
			<CardContent align="center">
				<Typography variant="h3">Register for an Account!</Typography>
				<UserForm actionHandler={registerHandler} mode="Register" />
			</CardContent>
		</Card>
	);
}

export default Register;
