import ComponentsDatatablesTrainee from "@/components/datatables/components-datatables-trainee";
import IconBell from "@/components/icon/icon-bell";
import { Metadata } from "next";
import React from "react";
import DefaultLayout from "../layout";

import withAuth from "../components/hoc/withAuth";

export const metadata: Metadata = {};

const Export = () => {
  return (
    <DefaultLayout>
      <ComponentsDatatablesTrainee />
    </DefaultLayout>
  );
};

export default Export;
