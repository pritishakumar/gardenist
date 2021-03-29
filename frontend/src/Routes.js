import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
// Components that render from within this project
import PlantDetail from './plants/PlantDetail';
import Search from './plants/Search';
import ListDetail from './lists/ListDetail';
import ListListing from './lists/ListListing';
import UserEdit from './user/UserEdit';
import Home from './user/Home';

/** Creating standard routes as well as
 * private or protected routes for users who
 * are logged in
 */
function Routes() {
	return (
		<div className="Routes">
			<Switch>
				<Route exact path="/search/:plantId">
					<PlantDetail />
				</Route>
				<Route exact path="/search">
					<Search />
				</Route>
				<PrivateRoute exact path="/lists/:listId">
					<ListDetail />
				</PrivateRoute>
				<PrivateRoute exact path="/lists">
					<ListListing />
				</PrivateRoute>
				<PrivateRoute exact path="/user">
					<UserEdit />
				</PrivateRoute>
				<Route exact path="/">
					<Home />
				</Route>
				<Redirect to="/" />
			</Switch>
		</div>
	);
}

export default Routes;
