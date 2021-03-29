import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

/** Creating middleware to ensure protected
 * routes, so only logged in users may access
 * specific routes or be redirected to the
 * home/landing page
 */
function PrivateRoute({ exact, path, children }) {
	const user = useSelector((state) => state.user);
	const token = useSelector((state) => state.token);

	console.debug('PrivateRoute', 'exact=', exact, 'path=', path, 'currentUser=', user);

	if (!user.email || !token) {
		return <Redirect to="/" />;
	}

	return (
		<Route exact={exact} path={path}>
			{children}
		</Route>
	);
}

export default PrivateRoute;
