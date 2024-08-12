import ComponentsDatatablesClubmember from "@/components/datatables/components-datatables-clubmember";
import IconBell from "@/components/icon/icon-bell";
import { Metadata } from "next";
import React from "react";
import DefaultLayout from "../layout";
export const metadata: Metadata = {
  
};

const Export = () => {
  return (
    <DefaultLayout>
      <ComponentsDatatablesClubmember />
    </DefaultLayout>

  )
};

export default Export;
