import React from 'react';
import { Link } from 'react-router-dom';
// Components within this project
import ListWidget from '../lists/ListWidget';
// Material UI Components
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
// Material UI Style Hook
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
	card: {
		width: '300px',
		margin: '10px',
		padding: '10px',
		borderRadius: '15px',
		backgroundColor: 'orange'
	},
	content: {
		border: '1px solid grey',
		borderRadius: '15px',
		margin: '10px'
	},
	actionArea: {
		border: '1px solid grey',
		borderRadius: '15px',
		backgroundColor: 'white'
	}
}));

/** Displays a Component rendered in ./Search Component
 * which shows very brief information about each plant
 * that the search query matched. Renders a single 
 * ../lists/ListWidget Component if user is logged in
 * 
 * Authorization: none, accessible to all
 */
function PlantTile({ data }) {
	const classes = useStyles();
	const { id, common, imgs, 
      category, height, location } = data;

	return (
		<div className="PlantTile" data-plantid={id}>
			<Card variant="outlined" className={classes.card}>
				<CardActionArea className={classes.actionArea}>
					<Link to={`/search/${id}`}>
						<Typography variant="h5">{common}</Typography>
					</Link>

					<CardMedia align="center">
						{imgs && imgs.length 
            ? <img src={imgs[0]} width="150px" 
                  height="150px" alt={common} /> 
            : null}
					</CardMedia>
					<CardContent align="center" className={classes.content}>
						{category ? (
							<div>
								<Typography variant="h5">Category</Typography>
								<p>{category}</p>
							</div>
						) : null}
						{height ? (
							<div>
								<Typography variant="h5">Height</Typography>
								<p>{height}</p>
							</div>
						) : null}
						{location ? (
							<div>
								<Typography variant="h5">Location</Typography>
								<p>{location}</p>
							</div>
						) : null}
						<ListWidget data={{ id, common }} />
					</CardContent>
				</CardActionArea>
			</Card>
		</div>
	);
}

export default PlantTile;
