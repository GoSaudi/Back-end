/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AnErrorOccurred } from '@strapi/helper-plugin';
import pluginId from '../../pluginId';
import HomePage from '../HomePage';
import Bookings from '../Bookings';
import { Layout, Box } from '@strapi/design-system';
import BookingDetails from '../Bookings/BookingDetails';



const App = () => {

  return (
    <Box background="neutral100" padding={8} >
      <Layout >

        <Switch>
          <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
          <Route path={`/plugins/${pluginId}/bookings`} component={Bookings} exact />
          <Route path={`/plugins/${pluginId}/bookings/:id`} component={BookingDetails} exact />
          <Route component={AnErrorOccurred} />
        </Switch>
      </Layout >
    </Box>

  );
};

export default App;
