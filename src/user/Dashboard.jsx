import React from 'react'
import Layout from '../components/Layout'
import { useAuthContext } from '../context/AuthContextInfo'
import UserMenu from '../layout/UserMenu'

function Dashboard() {
    const {auth } = useAuthContext()
  return (
<Layout title={"DashBoard - Ecommerce App"}>
      <div className="container-fluid pt-5 mt-5">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3> {auth?.user?.name}</h3>
              <h3> {auth?.user?.email}</h3>
              <h3> {auth?.user?.phone}</h3>
              <h3> {auth?.user?.address}</h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
