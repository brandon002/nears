import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = (props:any) => {
    const token = localStorage.getItem('access_token');
    return <Navigate to="login" replace = {true} /> ;
};

export default PrivateRoute;