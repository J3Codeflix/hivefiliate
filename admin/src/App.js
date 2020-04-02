import React from 'react'
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router
} from 'react-router-dom'

import axios from 'axios'
import {LinkURL} from './component/config/settings'

import './assets/css/font-awesome.css'
import './assets/css/themify.css'
import './assets/css/flaticon/flaticon.css'
import 'semantic-ui-css/semantic.min.css'
import 'react-datepicker/dist/react-datepicker.css'
import './assets/css/bulma.css'
import './assets/css/style.css'


/* Admin Dashboard */
import RootAdmin from './component/admin/rootadmin'

/* Login */
import LoginAdmin from './component/admin/login/root'
import ResetAdmin from './component/admin/login/reset'
import NewPassword from './component/admin/login/newpassword'

//axios.defaults.baseURL = 'https://appdev.hivefiliate.com/api/hive/admin'
axios.defaults.baseURL = 'https://www.hivefiliate.com/api/hive/admin'

const NoMatch = ({ location }) => (
  <div>
    <h3>No match for <code>{location.pathname}</code></h3>
  </div>
)

function App() {
  return (
    <Router>
        <Switch>
          <Route exact path={LinkURL('/')} component={RootAdmin}/>
          <Route exact path={LinkURL('/reset')} component={ResetAdmin}/>
          <Route exact path={LinkURL('/login')} component={LoginAdmin}/>
          <Route exact path={LinkURL('/newpassword')} component={NewPassword}/>

          <Route exact path={LinkURL('/dashboard')} component={RootAdmin}/>
          <Route exact path={LinkURL('/merchant/list')} component={RootAdmin}/>

          <Route exact path={LinkURL('/merchant/affpayment')} component={RootAdmin}/>
          <Route exact path={LinkURL('/merchant/paymentapproval')} component={RootAdmin}/>
          <Route exact path={LinkURL('/merchant/invoice')} component={RootAdmin}/>
          <Route exact path={LinkURL('/merchant/affinvoice')} component={RootAdmin}/>

          <Route exact path={LinkURL('/affiliates')} component={RootAdmin}/>
          <Route exact path={LinkURL('/staff')} component={RootAdmin}/>
          <Route exact path={LinkURL('/orders')} component={RootAdmin}/>
          <Route exact path={LinkURL('/manager')} component={RootAdmin}/>
          <Route exact path={LinkURL('/bin/deletedstore')}  component={RootAdmin}/>
          <Route exact path={LinkURL('/bin/deletedaff')}  component={RootAdmin}/>
          <Route exact path={LinkURL('/settings/paypalapi')}  component={RootAdmin}/>
          <Route exact path={LinkURL('/settings/subscription')}  component={RootAdmin}/>
          <Route exact path={LinkURL('/settings/config')}  component={RootAdmin}/>
          <Route exact path={LinkURL('/account')}  component={RootAdmin}/>

          <Route component={NoMatch} />

        </Switch>
    </Router>
  );
}

export default App;
