import React from 'react';
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import App from '../App';
import LookRoute from "./look";
import Authorize from "./shopify/Authorize";
import { ClientRouter, useClientRouting, useRoutePropagation, RoutePropagator } from '@shopify/app-bridge-react';
const AppRoutes = (props) => {

  const { history, location } = props;
	// console.log(history, location)
	// if (history) {
	// 	useClientRouting(history);
	// }
	// if (location) {
	// 	useRoutePropagation(location)
	// }
	return (
		<>
		<Routes>
			{/* <Route path="/shopify" element={<Authorize />} />
			<Route path="/shopify/callback" element={<Authorize />} />
			<Route
					path="/install"
					element={<Navigate to={{
						pathname: "/shopify/authorize",
						search: window.location.search,
					}} replace={true} />}
				/>
			<Route path="/shopify/authorize" element={<Authorize />} /> */}
			<Route path="/looks/:id" element={<LookRoute />} />
			<Route path="/looks/create" element={<LookRoute />} />
			<Route path="/shopify" element={<App />} />
			<Route path="/shopify/callback" element={<App />} />
			<Route path="/" element={<App />} />
		</Routes>
		</>
	)
}

export default AppRoutes