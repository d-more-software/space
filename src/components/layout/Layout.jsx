import { Outlet } from "react-router-dom";
import Header from "./Header"
import Navbar from "./Navbar"
import Footer from "./Footer"

export default function Layout() {
	return (
		<>
			<Header />
			<Navbar />
			<Outlet />
			<Footer />
		</>
	);
}
