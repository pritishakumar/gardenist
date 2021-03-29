import { loginActionThunk } from '../redux/actionCreators';
import { useDispatch } from 'react-redux';
// Components from within this project
import UserForm from './UserForm';
// Material UI Components
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

/** Component that is rendered by ./Home Component.
 * It is a wrapper Component, that renders and 
 * customizes ./UserForm Component to log in the 
 * user
 * 
 * Authorization: none, accessible for all
 */
function Login() {
	const dispatch = useDispatch();

	async function loginHandler(data) {
		const result = await dispatch(loginActionThunk(data));
		if (result) {
			return 'Login successful!';
		}
	}

	return (
		<Card className="Login">
			<CardContent align="center">
				<Typography variant="h3">Log In As An Existing User</Typography>
				<UserForm actionHandler={loginHandler} mode="Login" />
			</CardContent>
		</Card>
	);
}

export default Login;
