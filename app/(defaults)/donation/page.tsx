import ComponentsDatatablesDonation from '@/components/datatables/components-datatables-donation';
import IconBell from '@/components/icon/icon-bell';
import { Metadata } from 'next';
import React from 'react';
import DefaultLayout from '../layout';
export const metadata: Metadata = {
   
};

const Export = () => {
    return (
       
        <DefaultLayout>
            <ComponentsDatatablesDonation />
        </DefaultLayout>
     
    );
};

export default Export;