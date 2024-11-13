import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { useAuthContext } from '../context/AuthContextInfo';

function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const { auth, setAuth } = useAuthContext();

  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/auth/user-auth`,
        { headers: { Authorization: auth?.token } }
      );
      if (res.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);


  


  return (ok ? <Outlet /> : <Spinner path='' />);
}

export default PrivateRoute;

// import React, { useState, useEffect } from 'react';
// import { Outlet } from 'react-router-dom';
// import axios from 'axios';
// import { useAuthContext } from '../context/AuthContextInfo';  // Ensure you're importing the context hook correctly
// import SpinnerSecond from '../components/SpinnerSecond';

// function PrivateRoute() {
//   const { auth } = useAuthContext();
//   const [ok, setOk] = useState(false);

//   useEffect(() => {
//     const authCheck = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:8000/api/v1/auth/user-auth`,
//           { headers: { Authorization: auth?.token } }
//         );
//         setOk(res.data.ok);
//       } catch (error) {
//         console.error('Authentication check failed:', error);
//         setOk(false);
//       }
//     };
//     if (auth?.token) authCheck();
//   }, [auth?.token]);

//   return ok ? <Outlet /> : <SpinnerSecond />;
// }

// export default PrivateRoute;
