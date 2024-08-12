import ComponentsDatatablesSubscriptionsReports from "@/components/datatables/components-datatables-subscriptionsreports";
import IconBell from "@/components/icon/icon-bell";
import { Metadata } from "next";
import React from "react";
import DefaultLayout from "../layout";
export const metadata: Metadata = {};

const Export = () => {
  return (
    <DefaultLayout>
      <ComponentsDatatablesSubscriptionsReports />
    </DefaultLayout>
  );
};

export default Export;