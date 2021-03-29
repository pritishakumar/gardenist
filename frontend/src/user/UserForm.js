import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';
import { useSelector } from 'react-redux';
import { registerSchema, loginSchema, editSchema } from '../helpers/schemas';
import { useHistory } from 'react-router-dom';
// Components from within this project
import MyTextInput from './MyTextInput';
// Material UI Components
import Button from '@material-ui/core/Button';
// Material UI Style Hook
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
	input: {
		margin: '5px'
	}
}));

/** Component rendered by ./Login, ./Register and ./UserEdit
 * Components to create customizable forms using the Formik
 * library and renders the ./MyTextInput Component.
 * 
 * Authorization: depends on use-case
 */
function UserForm({ actionHandler, mode, deleteFxn = null }) {
	const [ INITIAL_STATE, setINITIAL_STATE ] = useState({});
	const [ yupSchema, setYupSchema ] = useState('');
	const [ deletingUser, setDeletingUser ] = useState(false);
	const user = useSelector((state) => state.user);
	const history = useHistory();
	const formRef = useRef();
	const classes = useStyles();

	useEffect(() => {
		switch (mode) {
			case 'Register':
				setINITIAL_STATE({
					email: '',
					name: '',
					password: ''
				});
				setYupSchema(registerSchema);
				break;
			case 'Login':
				setINITIAL_STATE({
					email: '',
					password: ''
				});
				setYupSchema(loginSchema);
				break;
			case 'Edit':
				setINITIAL_STATE({
					name: user.name,
					password: '',
					passwordConfirm: ''
				});
				setYupSchema(editSchema);
				break;
			default:
				throw Error('INITIAL_STATE incorrectly set');
		}
	}, []);

	if (INITIAL_STATE.password === undefined) {
		return <p>... loading ...</p>;
	}

	async function genericSubmit(values) {
		if (deletingUser) {
			return;
		}
		const res = await actionHandler(values);
		if (res) {
			alert(res);
			history.push('/search');
		} else {
			alert('something went wrong');
		}
	}

	async function handleDelete() {
		setDeletingUser(true);
		const password = formRef.current.values.passwordConfirm;
		if (!password) {
			alert('Please confirm your password before deleting');
			return;
		}
		await deleteFxn(password);
	}

	let passwordLabel = 'Password: ';
	if (mode === 'Edit') {
		passwordLabel = 'New Password: ';
	}

	return (
		<div className="UserForm">
			<Formik
				initialValues={INITIAL_STATE}
				validationSchema={yupSchema}
				onSubmit={(values) => {
					genericSubmit(values);
				}}
				innerRef={formRef}
			>
				<Form>
					{INITIAL_STATE.hasOwnProperty('email') 
					? (
						<MyTextInput className={classes.input} label="Email Address: " name="email" type="text" />
					) : null}

					{INITIAL_STATE.hasOwnProperty('name') 
					? (<MyTextInput className={classes.input} label="First Name: " name="name" type="text" />) 
					: null}

					{INITIAL_STATE.hasOwnProperty('password') 
					? (<MyTextInput className={classes.input} label={passwordLabel} name="password" type="password" />) 
					: null}

					{INITIAL_STATE.hasOwnProperty('passwordConfirm') 
					? (<MyTextInput
							className={classes.input}
							label="Confirm Existing Password: "
							name="passwordConfirm"
							type="password"
						/>) 
					: null}
					<br />
					<Button className={classes.input} type="submit" variant="contained" color="primary">
						{mode}
					</Button>
					{INITIAL_STATE.hasOwnProperty('passwordConfirm') ? (
						<Button
							variant="contained"
							color="secondary"
							onClick={() => {
								handleDelete();
							}}
						>
							Delete Account
						</Button>
					) : null}
				</Form>
			</Formik>
		</div>
	);
}

export default UserForm;
