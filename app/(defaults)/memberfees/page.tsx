import ComponentsDatatablesMemberfees from '@/components/datatables/components-datatables-memberfees';
import IconBell from '@/components/icon/icon-bell';
import { Metadata } from 'next';
import React from 'react';
import DefaultLayout from '../layout';
export const metadata: Metadata = {
   
};

const Export = () => {
    return (
       
        <DefaultLayout>
            <ComponentsDatatablesMemberfees />
        </DefaultLayout>
     
    );
};

export default Export;