import React, {useState, useEffect} from 'react'
import {
  Route,
  Switch,
  BrowserRouter as Router
} from 'react-router-dom'
import axios from 'axios'
import {UserContext} from '../config/usercontent'
import {windowLocation} from '../config/settings'
import {SpinningAbove} from '../config/spinner'
import {LinkURL} from '../config/settings'

import Sidebar from './layout/sidebar'
import Header from './layout/header'

import Dashboard from './pages/dashboard/index'
import Merchant from './pages/merchant/index'

import Invoice from './pages/merchant/payment/invoice'

import MerchantInvoicePayment from './pages/merchant/payment/payment'
import PaymentApproval from './pages/merchant/payment/approval'
import AffInvoice from './pages/merchant/payment/affinvoice'



import Affiliates from './pages/affiliates/index'
import Staff from './pages/staff/index'
import Orders from './pages/orders/index'
import Administrator from './pages/administrator/index'

import AdminAccount from './pages/account/index'

/* Deleted */
import DeletedMerchant from './pages/recyclebin/deletedmerchant/index'
import DeletedAffiliates from './pages/recyclebin/deletedaffiliates/index'

/* Settings */
import PaypalAPI from './pages/settings/paypalapi'
import Subscription from './pages/settings/subscription'
import Settings from './pages/settings/settings'


export default function RootAdmin(props) {

  const [isheader, setisheader] = useState('side-layout');
  function setLayout(data){
    setisheader(data);
  }

  const [spinner, setspinner] = useState(true);
  const [userContext, setmanager] = useState(null);
  function isManagerLogin(){
  		let formData = new FormData();
  		formData.append('type','admin_islogin');
  		axios.post('/login/request.php',formData)
  		.then(function (response) {
  			let obj = response.data;
  			if(obj=='0'){windowLocation('/login');
          return false;
        }
  			setmanager(obj);
        setTimeout(function(){ setspinner(false); }, 2000);
  		})
  		.catch(function (error) {setspinner(false);return false;});
	}

  function callSpinner(data){
    setspinner(true);
  }
  useEffect(()=>{
      isManagerLogin();
  },[]);

	return (
    <UserContext.Provider value={userContext}>
  		<div className={'admin-wrapper is-clearfix ' +isheader}>
          {spinner&&SpinningAbove()}
  		    <div className="admin-sidebar"><Sidebar/></div>
  		    <div className="admin-content">
            <Header layoutCallback={setLayout} dataLayoutCallback={isheader} callbackSpinner={callSpinner}/>
  		    	<div className="admin-pages">
  		    		<Router>
  							<Switch>
                  <Route exact path={LinkURL('/')}  component={Dashboard}/>
  								<Route path={LinkURL('/dashboard')}  component={Dashboard}/>
                  <Route path={LinkURL('/merchant/list')}  component={Merchant}/>

                  <Route path={LinkURL('/merchant/affpayment')}  component={MerchantInvoicePayment}/>
                  <Route path={LinkURL('/merchant/paymentapproval')}  component={PaymentApproval}/>
                  <Route path={LinkURL('/merchant/invoice')}  component={Invoice}/>
                  <Route path={LinkURL('/merchant/affinvoice')}  component={AffInvoice}/>


                  <Route path={LinkURL('/affiliates')}  component={Affiliates}/>
                  <Route path={LinkURL('/staff')}  component={Staff}/>
                  <Route path={LinkURL('/orders')}  component={Orders}/>
                  <Route path={LinkURL('/manager')}  component={Administrator}/>
                  <Route path={LinkURL('/bin/deletedstore')}  component={DeletedMerchant}/>
                  <Route path={LinkURL('/bin/deletedaff')}  component={DeletedAffiliates}/>
                  <Route path={LinkURL('/settings/paypalapi')}  component={PaypalAPI}/>
                  <Route path={LinkURL('/settings/subscription')}  component={Subscription}/>
                  <Route path={LinkURL('/settings/config')}  component={Settings}/>
                  <Route path={LinkURL('/account')}  component={AdminAccount}/>

  							</Switch>
  						</Router>
  		    	</div>
  		    </div>
  		</div>
    </UserContext.Provider>
	)
}
