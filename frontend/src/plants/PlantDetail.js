import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import plantLoader from '../helpers/plantLoader';
// Components within this project
import ListWidget from '../lists/ListWidget';
// Material UI Components
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
// Material UI Style Hook
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
	container: {
		width: '50%',
		borderRadius: '15px',
		border: '1px solid grey',
		padding: '20px',
		marginTop: '20px',
		'& img': {
			margin: '10px',
			maxWidth: '400px',
			maxHeight: '200px'
		},
		backgroundColor: 'white'
	},
	imgArea: {
		overflow: 'hidden'
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff'
	},
	link: {
		textDecoration: 'none'
	}
}));

/** Display a page showing more pictures and 
 * details on a specific plant. The user, if 
 * logged in, can also add this plant to any 
 * of their lists at the bottom of the page.
 * Renders a single ../lists/ListWidget
 * Component if user is logged in
 * 
 * Authorization: none, accessible to all
 */
function PlantDetail() {
	const [ rawData, setRawData ] = useState({});
	const { plantId } = useParams();
	const classes = useStyles();

	useEffect(() => {
		async function loadPlantData() {
			const result = await plantLoader(plantId);
			if (!result) {
				console.log('Invalid plant ID used');
				return;
			}
			setRawData(result.plant);
		}
		loadPlantData();
	}, []);

	if (!rawData.id) {
		return (
			<Container className={classes.container} align="center">
				<Typography variant="h5">!!Loading!!</Typography>

				<Backdrop className={classes.backdrop} open="true">
					<CircularProgress color="inherit" />
				</Backdrop>
			</Container>
		);
	}
	const { id, common, imgs, expiry, ...plantData } = rawData;

	const dynamicContent = [];
	for (let [ heading, contents ] of Object.entries(plantData)) {
		dynamicContent.push(
			<section key={`${id}${heading}`}>
				<h3>{heading}</h3>
				{contents.map((each) => <p>{each}</p>)}
			</section>
		);
	}
	return (
		<div className="PlantDetail" data-plantid={plantId}>
			<Container className={classes.container}>
				<h2>{common}</h2>
				<div className={classes.imgArea}>
					{imgs ? (
						imgs.map((eachImg) => {
							return <img margin="10px" 
                    src={eachImg} alt={common} />;
						})
					) : (
						''
					)}
				</div>
				{dynamicContent}
				<ListWidget data={{ id: plantId, common }} />
				<br />
				<br />
				<Link className={classes.link} to="/search">
					<Button variant="contained" color="primary">
						Back to Search
					</Button>
				</Link>
			</Container>
		</div>
	);
}

export default PlantDetail;
