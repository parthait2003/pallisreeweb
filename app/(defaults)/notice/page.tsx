"use client";
import React from "react";
import ComponentsDatatablesNotice from "@/components/datatables/components-datatables-notice";
import DefaultLayout from "../layout";
import withAuth from "../components/hoc/withAuth";

const Dashboard = () => {
  return (
    <DefaultLayout>
      <ComponentsDatatablesNotice />
    </DefaultLayout>
  );
};

export default withAuth(Dashboard);
