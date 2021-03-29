import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeUserAction } from './redux/actionCreators';
// Material UI Components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
// Material UI Icons and Style Hook
import HomeTwoTone from '@material-ui/icons/HomeTwoTone';
import AccountBoxTwoTone from '@material-ui/icons/AccountBoxTwoTone';
import Search from '@material-ui/icons/Search';
import ExitToAppTwoToneIcon from '@material-ui/icons/ExitToAppTwoTone';
import BookTwoToneIcon from '@material-ui/icons/BookTwoTone';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		top: 0,
		width: '99%'
	},
	li: {
		display: 'inline'
	},
	title: {
		flexGrow: 1
	},
	link: {
		textDecoration: 'none'
	}
}));

/** Common header component rendered on all routes 
 * Differs based on if user is logged in or not
*/
function Header() {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const history = useHistory();
	const classes = useStyles();

	async function logout() {
		const result = await dispatch(removeUserAction());
		if (result) {
			history.push('/');
		}
	}

	return (
		<AppBar className={`Header ${classes.root}`} position="static">
			<Toolbar>
				<Typography variant="h3" color="inherit">
					Gardenist
				</Typography>
				<List className="">
					<ListItem className={classes.li}>
						<NavLink className={classes.link} to="/">
							<Button color="transparent">
								<HomeTwoTone className="" /> Home
							</Button>
						</NavLink>
					</ListItem>

					<ListItem className={classes.li}>
						<NavLink className={classes.link} to="/search">
							<Button color="transparent">
								<Search className="" /> Search
							</Button>
						</NavLink>
					</ListItem>

					{user && user.email ? (
						<div>
							<ListItem className={classes.li}>
								<NavLink className={classes.link} to="/lists">
									<Button color="transparent">
										<BookTwoToneIcon className="" /> Bookmark Lists
									</Button>
								</NavLink>
							</ListItem>

							<ListItem className={classes.li}>
								<NavLink className={classes.link} to="/user">
									<Button color="transparent">
										<AccountBoxTwoTone className="" /> Edit Profile
									</Button>
								</NavLink>
							</ListItem>

							<ListItem className={classes.li}>
								<Button
									onClick={(e) => {
										e.preventDefault();
										logout();
									}}
									color="transparent"
								>
									<ExitToAppTwoToneIcon className="" /> Logout
								</Button>
							</ListItem>
						</div>
					) : (
						<ListItem className={classes.li}>
							<NavLink className={classes.link} to="/">
								<Button color="transparent">
									<AccountBoxTwoTone className="" /> Sign Up/Login
								</Button>
							</NavLink>
						</ListItem>
					)}
				</List>
			</Toolbar>
		</AppBar>
	);
}

export default Header;
