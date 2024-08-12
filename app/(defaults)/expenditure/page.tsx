'use client';
import React from 'react'
import ComponentsDatatablesExpenditure from "@/components/datatables/components-datatables-expenditure";
import DefaultLayout from '../layout';
import withAuth from '../components/hoc/withAuth';


const Dashboard = () => {
  return (
    <DefaultLayout>
        <ComponentsDatatablesExpenditure/>
    </DefaultLayout>
  )
}

export default withAuth(Dashboard);