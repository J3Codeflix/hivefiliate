import React, {useState, useEffect} from 'react'
import {
  Route,
  Switch,
  BrowserRouter as Router
} from 'react-router-dom'
import { Message,Button,Icon } from 'semantic-ui-react'
import {windowReload,returnUrl} from '../include/merchant_redirect'
import axios from 'axios'

import TopHeader from './layout/topheader'

import {Spinning,SpinningAbove} from '../include/circlespin'


/*------ Pages------ */
import Dashboard from './pages/dashboard/dashboard'

import ActiveAffiliates from './pages/affiliates/active'
import PendingAffiliates from './pages/affiliates/pending'
import DeniedAffiliates from './pages/affiliates/denied'
import BlockAffiliates from './pages/affiliates/block'
import DeletedAffiliates from './pages/affiliates/deleted'


import PaymentAffiliate from './pages/affiliates/invoice/payment'
import AffPaymentTotal from './pages/affiliates/invoice/affpay'
import PaymentHistory from './pages/affiliates/invoice/history'
import PaymentInvoice from './pages/affiliates/invoice/invoice'
import AffPaymentInvoice from './pages/affiliates/invoice/affinvoice'


import OrdersApproved from './pages/orders/approved'
import OrdersPending from './pages/orders/pending'
import OrdersDenied from './pages/orders/denied'

import Banners from './pages/banners/banners'

import Settings from './pages/settings/general'
import Tracking from './pages/settings/tracking'
import Payment from './pages/settings/payment'

import Account from './pages/account/account'
import AccountStaff from './pages/account/account_staff'
import AccountPlan from './pages/account/payment'
import AccountPlanV2 from './pages/account/payment_v2'

import Integration from './pages/integration/integration'
import Staff from './pages/staff/list'
import Tutorial from './pages/tutorial/tutorial'


import NoPermission from './404permission'


import CancelRemovalAccount from './pages/account/removal'

import {UserContext} from './layout/userContext'

import '../../assets/css/merchant.css'

export default function Merchant(props) {

	const [spinner, setspinner] = useState(true);
  const [iswait,setiswait] = useState(true);

	/* Check Login Merchant */
  const [site, setsite] = useState('0');
	const [userContext, setuser] = useState(null);
  const [istaff,setistaff] = useState(0);

  const [website_url,setwebsite_url] = useState(null);
  const [type_platform,settype_platform] = useState(null);
  const [storestatus, setstorestatus] = useState(null);

  const [is_deleted, setis_deleted] = useState(null);

	function isMerchantLogin(){
  		let formData = new FormData();
  		formData.append('type','merchant_islogin');
  		axios.post('/merchant/login/request.php',formData)
  		.then(function (response) {
  			let obj = response.data;
          console.log("isMerchantLogin -> obj", obj)
        setsite(obj.site_address);
  			if(obj!==0){
          returnUrl('login');
          return false;
        }
  			setuser(obj);
        setistaff(obj.stafflog);
        setTimeout(function(){
          setspinner(false);
          setiswait(false);
        }, 2000);
        setwebsite_url(obj.website_url);
        settype_platform(obj.type_platform);
        setstorestatus(obj.store_status);
        setis_deleted(obj.is_deleted);
  		})
  		.catch(function (error) {setiswait(false);return false;});
	}

	function Setspin(data){
		setspinner(data);
	}

  const [cancelremove, setcancelremove] = useState(false);
  function cancelRemoval(){
    setcancelremove(true);
  }


	useEffect(()=>{
		isMerchantLogin();
	},[]);

	return (
		<div className="merchant-wrapper">

			{spinner&&SpinningAbove()}

			<UserContext.Provider value={userContext}>
				<TopHeader callbackSpinner={Setspin}/>
				<div className="merchant-body">
					<div className="pagegrid">

          {type_platform=='shopify'&&storestatus=='closed'&&<div className="setupguide">
              <Message
                negative
                icon='info circle'
                header='Program is closed'
                content={'The shopify store '+website_url+'  is no longer connected to this account.'}
              />
          </div>}

          {is_deleted=='1'&&<div className="setupguide">
              <Message
                negative
                icon='info circle'
                header='Pending Removal'
                list={[
                  'This hivefiliate account program is pending removal!',
                  'If you wish to cancel the removal process, please click the cancel removal button.'
                ]}
              />
              <Button onClick={()=>cancelRemoval()} color='red' icon labelPosition='left'><Icon name='user cancel' /> Cancel Removal</Button>
          </div>}

          {cancelremove&&<CancelRemovalAccount />}

          {<Router>
							<Switch>
							<Route path={process.env.PUBLIC_URL+'/dashboard'}  component={Dashboard}/>

							<Route path={process.env.PUBLIC_URL+'/mrcaffiliates/active'} component={ActiveAffiliates}/>
							<Route path={process.env.PUBLIC_URL+'/mrcaffiliates/pending'} component={PendingAffiliates}/>
							<Route path={process.env.PUBLIC_URL+'/mrcaffiliates/denied'} component={DeniedAffiliates}/>
							<Route path={process.env.PUBLIC_URL+'/mrcaffiliates/block'} component={BlockAffiliates}/>
							<Route path={process.env.PUBLIC_URL+'/mrcaffiliates/deleted'} component={DeletedAffiliates}/>

              <Route path={process.env.PUBLIC_URL+'/mrcaffiliates/affpayment'} component={PaymentAffiliate}/>
              <Route path={process.env.PUBLIC_URL+'/mrcaffiliates/formonth'} component={AffPaymentTotal}/>
              <Route path={process.env.PUBLIC_URL+'/mrcaffiliates/payhistory'} component={PaymentHistory}/>
              <Route path={process.env.PUBLIC_URL+'/mrcaffiliates/invoice'} component={PaymentInvoice}/>
              <Route path={process.env.PUBLIC_URL+'/mrcaffiliates/affinvoice'} component={AffPaymentInvoice}/>


							<Route path={process.env.PUBLIC_URL+'/orders/approved'}  component={OrdersApproved}/>
							<Route path={process.env.PUBLIC_URL+'/orders/pending'}  component={OrdersPending}/>
							<Route path={process.env.PUBLIC_URL+'/orders/denied'}  component={OrdersDenied}/>

							<Route path={process.env.PUBLIC_URL+'/banners'}  component={Banners}/>

							<Route path={process.env.PUBLIC_URL+'/settings/general'}  component={istaff==0?Settings:NoPermission}/>
							<Route path={process.env.PUBLIC_URL+'/settings/tracking'}  component={istaff==0?Tracking:NoPermission}/>
							<Route path={process.env.PUBLIC_URL+'/settings/payment'}  component={istaff==0?Payment:NoPermission}/>

							<Route path={process.env.PUBLIC_URL+'/account'}  component={Account}/>
              <Route path={process.env.PUBLIC_URL+'/payment'}  component={AccountPlan}/>
              <Route path={process.env.PUBLIC_URL+'/payment-v2'} component={AccountPlanV2}/>

							<Route path={process.env.PUBLIC_URL+'/integration'}  component={Integration}/>
							<Route path={process.env.PUBLIC_URL+'/staff'}  component={istaff==0?Staff:NoPermission}/>
							<Route path={process.env.PUBLIC_URL+'/tutorial'}  component={Tutorial}/>
							</Switch>
						</Router>}

					</div>
				</div>
				<div className="merchant-footer"><p className="text-blur">Hivefiliate All © Copyright by . All Rights Reserved.</p></div>
			</UserContext.Provider>
		</div>
	)
}
