import ComponentsDatatablesSubscription from '@/components/datatables/components-datatables-subscription';
import IconBell from '@/components/icon/icon-bell';
import { Metadata } from 'next';
import React from 'react';
import DefaultLayout from '../layout';
export const metadata: Metadata = {
   
};

const Export = () => {
    return (
       
        <DefaultLayout>
            <ComponentsDatatablesSubscription />
        </DefaultLayout>
     
    );
};

export default Export;