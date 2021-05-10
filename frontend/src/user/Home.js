import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Components within this project
import Register from './Register';
import Login from './Login';
// Material UI Components
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
// Material UI Style Hook
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
	welcome: {
		padding: '10px;',
	},
	link: {
		textDecoration: 'none',
	},
	paper: {
		margin: "10px",
	},
}));

/** Home/landing page where use sees a welcome 
 * message and offers to either start search, make
 * a new user account or sign into their existing
 * account. Renders ./Login and ./Register Components
 * 
 * Authorization: none, accessible for all
 */
function Home() {
	const user = useSelector((state) => state.user);
	const classes = useStyles();

	return (
		<div>
			<br />
			<Grid container spacing={4} direction="row" justify="space-around" alignItems="center">
				<Grid item align="center" item xs={10} p={2}>
					<Paper className={classes.welcome}>
						<Typography variant="h3" color="inherit">
							Welcome!
						</Typography>
						<p>Go ahead and start researching for your dream garden!</p>
						<Link className={classes.link} to="/search">
							<Button type="submit" variant="contained" color="primary">
								Start Searching!
							</Button>
						</Link>
					</Paper>
				</Grid>

				{!user || !user.email 
        ? (<div>
						<Grid item xs={12}>
							<Paper className={classes.paper}>
								<Register />
							</Paper>
						</Grid>

						<Grid item xs={12}>
							<Paper className={classes.paper}>
								<Login />
							</Paper>
						</Grid>
					</div>) 
        : (null)
        }
			</Grid>
		</div>
	);
}

export default Home;
