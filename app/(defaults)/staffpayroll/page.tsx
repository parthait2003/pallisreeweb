"use client";
import React from "react";
import ComponentsDatatablesStaff from "@/components/datatables/components-datatables-staff";
import DefaultLayout from "../layout";
import withAuth from "../components/hoc/withAuth";

const Dashboard = () => {
  return (
    <DefaultLayout>
      <ComponentsDatatablesStaff />
    </DefaultLayout>
  );
};

export default withAuth(Dashboard);
