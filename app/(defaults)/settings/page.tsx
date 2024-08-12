'use client';
import React from 'react'
import ComponentsDatatablesSettings from "@/components/datatables/components-datatables-settings";
import DefaultLayout from '../layout';
import withAuth from '../components/hoc/withAuth';


const Dashboard = () => {
  return (
    <DefaultLayout>
        <ComponentsDatatablesSettings/>
    </DefaultLayout>
  )
}

export default Dashboard;