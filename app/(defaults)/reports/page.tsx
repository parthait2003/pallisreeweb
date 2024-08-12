import ComponentsDatatablesReports from "@/components/datatables/components-datatables-repors";
import IconBell from "@/components/icon/icon-bell";
import { Metadata } from "next";
import React from "react";
import DefaultLayout from "../layout";
export const metadata: Metadata = {};

const Export = () => {
  return (
    <DefaultLayout>
      <ComponentsDatatablesReports />
    </DefaultLayout>
  );
};

export default Export;
