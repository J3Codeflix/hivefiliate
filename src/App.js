import React from 'react'
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router
} from 'react-router-dom'

import axios from 'axios'

import './assets/css/font-awesome.css'
import './assets/css/themify.css'
import './assets/css/flaticon/flaticon.css'
import 'semantic-ui-css/semantic.min.css'
import './assets/css/bulma.css'
import 'react-datepicker/dist/react-datepicker.css'


/* Merchant Dashboard */
//import Register from './component/merchant/register/register'


import RegisterHome from './component/merchant/signup/register'
import ShopifyRegister from './component/merchant/signup/shopify'
import ShopifyAccount from './component/merchant/signup/shopifyaccount'

import WoocomerceRegister from './component/merchant/signup/woocommerce'
import CustomApiRegister from './component/merchant/signup/hivecustomapi'


import Login from './component/merchant/login/login'
import ResetPassword from './component/merchant/login/reset'
import NewPassword from './component/merchant/login/newpassword'
import StaffReset from './component/merchant/login/staffreset'
import StaffNew from './component/merchant/login/staffnew'


import Merchant from './component/merchant/merchant'

/* Affiliate Dashboard */

import AffLogin from './component/affpartners/login/index'
import AffRegister from './component/affpartners/register/index'
import AffReset from './component/affpartners/login/reset'
import AffNewpass from './component/affpartners/login/newpassword'

import AffiliatePartners from './component/affpartners/affindex'


/* Website */
import Website from './component/website/index'
import WebsitePrivacy from './component/website/page_privacy'
import WebsiteTerms from './component/website/page_terms'
import {RootLink} from './component/include/merchant_redirect'

//axios.defaults.baseURL = 'https://appdev.hivefiliate.com/api/hive'
axios.defaults.baseURL = 'https://hivefiliate.com/api/hive'

const NoMatch = ({ location }) => (
  <div>
    <h3>No match for <code>{location.pathname}</code></h3>
  </div>
)

function App() {
  return (
    <Router>
        <Switch>
          <Route exact path={process.env.PUBLIC_URL+'/'} component={Website}/>
          <Route exact path={process.env.PUBLIC_URL+'/privacy'} component={WebsitePrivacy}/>
          <Route exact path={process.env.PUBLIC_URL+'/terms'} component={WebsiteTerms}/>


          <Route exact path={process.env.PUBLIC_URL+'/app/public/cgi-bin'} component={Website}/>
          <Route exact path={process.env.PUBLIC_URL+'/password/reset'} component={ResetPassword}/>


          {/*------------- Affiliate URL-------------------------- */}
          <Route exact path={process.env.PUBLIC_URL+'/affiliates/login'} component={AffLogin}/>
          <Route exact path={process.env.PUBLIC_URL+'/affiliates/register'} component={AffRegister}/>


          <Route exact path={process.env.PUBLIC_URL+'/affiliates/reset'} component={AffReset}/>
          <Route exact path={process.env.PUBLIC_URL+'/affiliates/newpassword'} component={AffNewpass}/>

          <Route exact path={process.env.PUBLIC_URL+'/affiliates/dashboard'} component={AffiliatePartners}/>
          <Route exact path={process.env.PUBLIC_URL+'/affiliates/account'} component={AffiliatePartners}/>
          <Route exact path={process.env.PUBLIC_URL+'/affiliates/infopage'} component={AffiliatePartners}/>
          <Route exact path={process.env.PUBLIC_URL+'/affiliates/linkgenerator'} component={AffiliatePartners}/>
          <Route exact path={process.env.PUBLIC_URL+'/affiliates/orders/approved'} component={AffiliatePartners}/>
          <Route exact path={process.env.PUBLIC_URL+'/affiliates/orders/pending'} component={AffiliatePartners}/>
          <Route exact path={process.env.PUBLIC_URL+'/affiliates/orders/denied'} component={AffiliatePartners}/>
          <Route exact path={process.env.PUBLIC_URL+'/affiliates/payment'} component={AffiliatePartners}/>
          <Route exact path={process.env.PUBLIC_URL+'/affiliates/banners'} component={AffiliatePartners}/>
          <Route exact path={process.env.PUBLIC_URL+'/affiliates/faq'} component={AffiliatePartners}/>

          {/*------------- Merchant URL--------------------------  */}
          <Route exact path={process.env.PUBLIC_URL+'/signup'} component={RegisterHome}/>
          <Route exact path={process.env.PUBLIC_URL+'/register'} component={RegisterHome}/>
          <Route exact path={process.env.PUBLIC_URL+'/signup/shopify'} component={ShopifyRegister}/>
          <Route exact path={process.env.PUBLIC_URL+'/signup/shopify/account'} component={ShopifyAccount}/>


          <Route exact path={process.env.PUBLIC_URL+'/signup/woocommerce'} component={WoocomerceRegister}/>


          <Route exact path={process.env.PUBLIC_URL+'/signup/customapi'} component={CustomApiRegister}/>



          {/*<Route exact path={process.env.PUBLIC_URL+'/register'} component={Register}/>*/}
          <Route exact path={process.env.PUBLIC_URL+'/login'} component={Login}/>
          <Route exact path={process.env.PUBLIC_URL+'/reset'} component={ResetPassword}/>
          <Route exact path={process.env.PUBLIC_URL+'/newpassword'} component={NewPassword}/>
          <Route exact path={process.env.PUBLIC_URL+'/staffreset'} component={StaffReset}/>
          <Route exact path={process.env.PUBLIC_URL+'/staffnewpassword'} component={StaffNew}/>

          <Route exact path={process.env.PUBLIC_URL+'/dashboard'} component={Merchant}/>
          <Route exact path={process.env.PUBLIC_URL+'/mrcaffiliates/active'} component={Merchant}/>
          <Route exact path={process.env.PUBLIC_URL+'/mrcaffiliates/pending'} component={Merchant}/>
          <Route exact path={process.env.PUBLIC_URL+'/mrcaffiliates/denied'} component={Merchant}/>
          <Route exact path={process.env.PUBLIC_URL+'/mrcaffiliates/block'} component={Merchant}/>
          <Route exact path={process.env.PUBLIC_URL+'/mrcaffiliates/deleted'} component={Merchant}/>


          {/*<Route exact path={process.env.PUBLIC_URL+'/mrcaffiliates/payment'} component={Merchant}/>
          <Route exact path={process.env.PUBLIC_URL+'/mrcaffiliates/payhistory'} component={Merchant}/>
          <Route exact path={process.env.PUBLIC_URL+'/mrcaffiliates/invoice'} component={Merchant}/>*/}

          <Route exact path={process.env.PUBLIC_URL+'/mrcaffiliates/affpayment'} component={Merchant}/>
          <Route exact path={process.env.PUBLIC_URL+'/mrcaffiliates/formonth'} component={Merchant}/>
          <Route exact path={process.env.PUBLIC_URL+'/mrcaffiliates/payhistory'} component={Merchant}/>
          <Route exact path={process.env.PUBLIC_URL+'/mrcaffiliates/invoice'} component={Merchant}/>
          <Route exact path={process.env.PUBLIC_URL+'/mrcaffiliates/affinvoice'} component={Merchant}/>


          <Route exact path={process.env.PUBLIC_URL+'/orders/approved'} component={Merchant}/>
          <Route exact path={process.env.PUBLIC_URL+'/orders/pending'} component={Merchant}/>
          <Route exact path={process.env.PUBLIC_URL+'/orders/denied'} component={Merchant}/>

          <Route exact path={process.env.PUBLIC_URL+'/banners'} component={Merchant}/>

          <Route exact path={process.env.PUBLIC_URL+'/settings/general'} component={Merchant}/>
          <Route exact path={process.env.PUBLIC_URL+'/settings/tracking'} component={Merchant}/>
          <Route exact path={process.env.PUBLIC_URL+'/settings/payment'} component={Merchant}/>

          <Route exact path={process.env.PUBLIC_URL+'/account'} component={Merchant}/>
          <Route exact path={process.env.PUBLIC_URL+'/payment'} component={Merchant}/>

          <Route exact path={process.env.PUBLIC_URL+'/integration'} component={Merchant}/>
          <Route exact path={process.env.PUBLIC_URL+'/tutorial'} component={Merchant}/>
          <Route exact path={process.env.PUBLIC_URL+'/staff'} component={Merchant}/>

          {/*<Redirect to={process.env.PUBLIC_URL+'/'}/>*/}
          <Route component={NoMatch} />


        </Switch>
    </Router>
  );
}

export default App;
