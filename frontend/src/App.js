import React from 'react';
import { BrowserRouter } from 'react-router-dom';
// Components from within this project
import Header from './Header';
import Routes from './Routes';
// Image stored locally in src/assets
import yansiKeimUnsplash from './assets/yansiKeimUnsplash.jpg';
// Material UI Style Hook
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
	appRoot: {
		top: '0',
		right: '0',
		bottom: '0',
		left: '0',
		background: `url(${yansiKeimUnsplash}) no-repeat center center fixed`,
		height: '99%',
		minHeight: '98vh',
		width: '99%'
	}
}));

/** Overall application with a common header and routes */
function App() {
	const classes = useStyles();
	return (
		<div className={classes.appRoot}>
			<BrowserRouter>
				<Header />
				<Routes />
			</BrowserRouter>
		</div>
	);
}

export default App;
