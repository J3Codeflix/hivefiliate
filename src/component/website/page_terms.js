import React, {useState, useEffect, useContext, useRef} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, Modal, Popup, Icon, Step, Checkbox, List } from 'semantic-ui-react'

import jquery from '../include/jquery'

import Logo from '../../assets/image/hivelogo.jpg'
import Logo2 from '../../assets/image/hivelogo2.jpg'
import Logoblack from '../../assets/image/logoblack.jpg'

import DashboardLogo from '../../assets/image/macbook.png'
import BgLogo from '../../assets/image/bg-home-1.svg'
import Landing2 from '../../assets/image/landing2.png'
import Landing3 from '../../assets/image/landing3.png'




export default function WebsiteTerms(props) {

	function backgroundColor(){
		document.body.style.backgroundColor = "white";
		document.body.style.color="#55595c";
	}


	useEffect(()=>{
		backgroundColor();
		jquery();
	},[]);

	return (
		<React.Fragment>
	      <div className="hivefiliate-wrapper">

				<div className="hivetop">

					<div className="hivenavigation fixnav">
						<div className="hive-grid">
							<div className="columns is-mobile is-vcentered is-clearfix">
								<div className="column is-one-quarter hivelogo">
									<a href={process.env.PUBLIC_URL+'/'} className="hdlogo">
										<img className="hivelogotop1" src={Logo} alt="Hivefiliate"/>
										<img className="hivelogotop2 tlogo2" src={Logo} alt="Hivefiliate"/>
									</a>
									<a href={process.env.PUBLIC_URL+'/'} className="mobilelogo">
										<img src={Logoblack} alt="Hivefiliate"/>
									</a>
								</div>
								<div className="column">

									<div className="hivemenu">
										<ul>
											<li><a href={process.env.PUBLIC_URL+'/'}>Home</a></li>
											<li><a href={process.env.PUBLIC_URL+'/'}>Feature</a></li>
											<li><a href={process.env.PUBLIC_URL+'/'}>Price</a></li>
											<li><a href={process.env.PUBLIC_URL+'/login'}>Login</a></li>
											<li><Button as="a" href={process.env.PUBLIC_URL+'/signup'} className="black" size="large">TRY FREE FOR 14 DAYS</Button></li>
										</ul>
									</div>

									<div className="mobilemenu position-right">
											<Popup
												trigger={
													<span className="iconhamburger"><i className="ti-menu"></i></span>
												}
												content={
													<Menu className="menupop" vertical>
														<Menu.Item as="a" href={process.env.PUBLIC_URL+'/'}>Home</Menu.Item>
														<Menu.Item as="a" href={process.env.PUBLIC_URL+'/'}>Feature</Menu.Item>
														<Menu.Item as="a" href={process.env.PUBLIC_URL+'/'}>Price</Menu.Item>
														<Menu.Item as='a' href={process.env.PUBLIC_URL+'/login'}>Login</Menu.Item>
														<Menu.Item><Button style={{'white-space':'nowrap'}} as="a" href={process.env.PUBLIC_URL+'/signup'} className="blue" size="teal">TRY FREE FOR 14 DAYS</Button></Menu.Item>
													</Menu>
												}
												on='click'
												position='top right'
											/>
									</div>

								</div>
							</div>
						</div>
					</div>

				</div>

				<div className="terms_privacy textprivacy">

				  <div className="hive-grid">
					    <h2>Terms of Service</h2>

							<div>
			          <p>Hivefiliate is a company that enables advertisers (“Advertisers”) to market their products online with the help of publishers (“Affiliates”). Hivefiliate contracts only with Advertisers and has no responsibility in the relationship between Advertisers and Affiliates. Hivefiliate offers tools to improve, register and facilitate online marketing through Affiliates (the “Service”). The payment of Affiliates shall always be the sole responsibility of the Advertisers and Hivefiliate shall therefore never be held liable for any damages resulting from any failure of the Advertiser to pay an Affiliate in a complete and timely manner. By accepting these Terms, any Advertiser using our Service warrants that he will pay the relevant Affiliate in a complete and timely manner.</p>
			        </div>

			        <div>
			          <p>By using Hivefiliate, you agree to be bound by the following terms and conditions (“Terms”). Hivefiliate reserves the right to update and change these Terms from time to time without notice. Any new updates, features or options that will be added to the Service, including the release of new tools and resources, shall be subject to these Terms. Please note that these Terms may be amended from time to time. In continuing to use the Service you confirm that you accept the then current terms and conditions in full at the time you use the Service.</p>
			        </div>

			        <div>
			          <h4>1. REGISTRATION</h4>
			          <p>To make use of the Service, it is necessary to create an account (“Account”).
			The Service is intended solely for persons who are 18 or older. Any access to or use of the Service by anyone under 18 is expressly prohibited. By accessing or using the Service you represent and warrant that you are 18 or older.
			To create your Account you will have to provide your full name a current email-address and you credit card details (only Advertisers).
			Anyone who registers, agrees that all information supplied on registration is true and accurate and will be kept up to date at all times. If the information provided is not true and/or accurate, we reserve the right to block, cancel or remove your Account.
			You are responsible for the security of your username and password. Hivefiliate shall not be held liable for any damage resulting from your failure to comply with this security obligation.
			Your Account is strictly personal and may not be used by anyone else. You may not impersonate any other person in any registration whether or not that other person is a user of the Service.
			If you manage more than one business entity, you must create a new Account for each and every different business entity. If you fail to do so, we reserve the right at our discretion to block, cancel or remove an Account of any person who in our opinion possesses more than one Account at any time.
			You are the only responsible party for the personal information provided on registration.
			We reserve the right to terminate your registration immediately without notice if in our opinion you have breached these Terms.
			You may not use the Service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).</p>
			        </div>

			        <div>
			          <h4>2. PAYMENT</h4>
			          <p>A valid, chargeable credit card or chargeable paypal account and billing agreement is required for paying accounts. If neither of these is present on the account, the account may be closed
			The Service is billed in advance on a monthly or yearly basis and is non-refundable. There will be no refunds or credits for partial months of service, upgrade/downgrade refunds, or refunds for months unused with an open account.
			All fees are exclusive of all taxes, levies, or duties imposed by taxing authorities, and you shall be responsible for payment of all such taxes, levies, or duties.
			Hivefiliate has no responsibility or legal power to ensure the payment of the Advertiser and accepts no responsibility or liability in the event that the Affiliate fails to arrange or collect payment from the Advertiser.
			3. UPGRADING, DOWNGRADING AND TRACKING EVENTS
			Hivefiliate offers different Services levels. Every Service level includes a different number of tracking events (“Tracking Events”). You may upgrade or downgrade your Service at any time during the subscription period (the “Subscription Period”).
			If you choose to upgrade your Service during the Subscription Period, your Service will be immediately upgraded. In case of an upgrade, you will be charged with the monthly fee of the higher Service minus the difference between the old and the new monthly fee for the days that have passed (pro rata).
			If you choose to downgrade your Service during the Subscription Period, your Service will be downgraded immediately. However, the monthly fee will only be adjusted in the next month of the Subscription Period. No refunds will be made in relation to any downgrade during the Subscription Period.
			If you choose to upgrade or downgrade your Service, your credit card will automatically be charged the new rate on your next billing cycle.
			Downgrading your Service may cause the loss of content, features, or capacity of your Account. Hivefiliate does not accept any liability for such loss.
			Downgrading your Service to a non white label level will cause all Affiliates who registered while the white label Service was activated, to be deactivated
			Every Service level has its own number of tracking events (“Tracking Events”). Whenever the number of Tracking Events, as agreed upon and limited in the relevant Service level, is exceeded during the Subscription Period, we will calculate the price for the surplus Tracking Events in accordance with the overage fees listed on the pricing page as part of Service level. In such a case, the extra costs of the surplus Tracking Events will be added to the relevant monthly fee.
			</p>
			        </div>

			        <div>
			          <h4>4. CANCELLATION AND TERMINATION</h4>
			          <p>We may, in our discretion and without liability to you, with or without cause, with or without prior notice and at any time, decide to limit, suspend, deactivate or cancel your Account.
			If we exercise our discretion under these Terms to do so, any or all of the following can occur with or without prior notice or explanation to you: (a) your Account will be deactivated or suspended, your password will be disabled, and you will not be able to access the Service, or receive assistance from our customer service.
			You may cancel your Account at any time from the Subscription & Billing page > Plan page. You are solely responsible for properly canceling your account. Please note that if your Account is cancelled, we do not have an obligation to delete or return to you any content.
			All of your content (text and files) may be immediately deleted from the Service upon cancellation. This information cannot be recovered once your account is canceled.
			If you cancel the Service before the end of your current Service Period, your cancellation will take effect immediately and you will not be charged again.
			Hivefiliate, in its sole discretion, has the right to suspend or terminate your account and refuse any and all current or future use of the Service, or any other service from Hivefiliate, for any reason at any time. Such termination of the Service will result in the deactivation or deletion of your Account or your access to your Account, and the forfeiture and relinquishment of all content in your Account. Hivefiliate reserves the right to refuse service to anyone for any reason at any time.</p>
			        </div>

			        <div>
			          <h4>5. MODIFICATION TO THE SERVICE AND PRICES</h4>
			          <p>Hivefiliate reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
			Prices of all Services, including but not limited to monthly subscription Service fees, are subject to change upon 30 days notice from us. Such notice may be provided at any time by posting the changes to the Hivefiliate Site (www.Hivefiliate.com).
			Hivefiliate shall not be liable to you or to any third party for any modification, price change, suspension or discontinuance of the Service.</p>
			        </div>

			        <div>
			          <h4>6. INTELLECTUAL PROPERTY</h4>
			          <p>We reserve all rights in relation to our copyright whether owned or licensed to us and all rights are reserved to any of our registered and unregistered trademarks (whether owned or licensed to us) which appear on this website.
			We do not screen user-generated content or information on the Service and we cannot give any assurance as to its accuracy or completeness. Users of the Service are expressly asked not to publish any defamatory, misleading or offensive content or any content which infringes any other persons intellectual property rights (eg. copyright). Any such content is contrary to our policy we do not accept liability in respect of such content, and the user responsible will be personally liable for any damages or other liability arising and you agree to indemnify us in relation to any liability we may suffer as a result of any such content.
			Hivefiliate has the right in its sole discretion to refuse or remove any Content that is available via the Service.
			The Service and this website or any portion of the Service or the website may not be reproduced, duplicated, copied, sold, resold, visited, or otherwise exploited for any commercial purpose without our express written consent. You may not systematically extract and/or re-utilise parts of the contents of the Service without our express written consent. In particular, you may not utilise any data mining, robots, or similar data gathering and extraction tools to extract (whether once or many times) for re-utilisation of any substantial parts of the Service without our express written consent.
			All content posted on the Service must comply with the relevant copyright law.
			We claim no intellectual property rights over the material you provide to the Service. Your profile and materials uploaded remain yours. However, if you or anyone else with access to your account makes any content public, you agree to allow others to view and share your content.</p>
			        </div>

			        <div>
			          <h4>7. LIABILITY</h4>
			          <p>We will not be responsible for any breach of these Terms caused by circumstances beyond our reasonable control.
			Although we aim to offer you the best service possible, we make no promise that the Service will meet your requirements. We cannot guarantee that the Service will be fault-free.
			Your access to the Service may be occasionally restricted to allow for repairs, maintenance or the introduction of new facilities or services. We will attempt to restore the Service as soon as we reasonably can.
			From time to time it may be necessary to suspend access to the Service for a period of time and any such interruptions shall not constitute a breach by us of these Terms.
			We will not be liable for any business, financial, or economic loss nor for any consequential or indirect loss (such as lost reputation, lost profit or lost opportunity) arising as a result of your use of the Service whether such loss is incurred or suffered as a result of our negligence or otherwise.
			In no event will Hivefiliate be liable for any consequential, special, indirect, or exemplary damages whatsoever arising out of (i) errors, mistakes, or inaccuracies of the Service, (ii) any unauthorized access to or use of our secure servers and/or any and all personal, institutional, technical or other information stored therein, (iii) any interruption or cessation of transmission to or from the Service, (iv) any bugs, viruses, Trojan horses, or the like, which may be transmitted to or through the Service by any third party, or for any loss or damage of any kind incurred as a result of the use of the Service, however caused and under any theory of liability (including negligence), even if advised of the possibility of such damages. Users acknowledge that the amounts payable under these Terms are based in part on these limitations, and further agree that these limitations will apply notwithstanding any failure of essential purpose of any limited remedy. The foregoing limitation of liability shall apply to the fullest extent permitted by law in the applicable jurisdiction.
			The User agrees that the above exclusions of liability are reasonable in all the circumstances, especially in light of the fact that our Service includes only the provision of the Service and responsibility for any payment to Affiliates lies solely with the Advertisers.</p>
			        </div>

			        <div>
			          <h4>8. GENERAL</h4>
			          <p>Your use of the Service is at your sole risk. The Service is provided on an “as is” and “as available” basis.
			You understand that Hivefiliate uses third party vendors and hosting partners to provide the necessary hardware, software, networking, storage, and related technology required to run the Service.
			You must not modify, adapt or hack the Service or modify another website so as to falsely imply that it is associated with the Service or Hivefiliate.
			You may not reverse engineer or reuse source code that is in public view. This includes any and all javascript.
			Verbal, physical, written or other abuse (including threats of abuse or retribution) of any Hivefiliate customer, employee, member, or officer will result in immediate Account termination.
			You understand that the technical processing and transmission of the Service, including your content, may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.
			You must not upload, post, host, or transmit unsolicited email or “spam” messages.
			You must not transmit any worms or viruses or any code of a destructive nature.
			If your bandwidth usage exceeds monthly limit, or significantly exceeds the average bandwidth usage, we reserve the right to immediately suspend your account or throttle your file hosting until you can reduce your bandwidth consumption or upgrade your account.
			We do not warrant that (i) the Service will meet your specific requirements, (ii) the Service will be uninterrupted, timely, secure, or error-free, (iii) the results that may be obtained from the use of the Service will be accurate or reliable, (iv) the quality of any products, the Service, information, or other material purchased or obtained by you through the Service will meet your expectations.
			The failure of Hivefiliate to exercise or enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. These Terms constitute the entire agreement between you and Hivefiliate and govern your use of the Service, superseding any prior agreements between you and Hivefiliate (including, but not limited to, any prior versions of these Terms).
			Neither party will be liable to the other or be deemed to be in breach of these Terms by reason of any delay in performing, or any failure to perform, any of their obligations, if the delay or failure was due to any event of force majeure beyond their reasonable control such as severe weather, subsidence, power or other utility cut-off, burglary, natural disaster, strikes, governmental action, terrorism, war or civil unrest.
			The parties agree that these Terms are fair and reasonable in all the circumstances. However, if any provision of these Terms is held not to be valid by a court of competent jurisdiction but would be valid if part of the wording were deleted, then such provision shall apply with such deletions as may be necessary to make it valid. If any of the provisions in these terms are held not to be valid the remaining provisions of these terms shall remain in full force and effect.
			If you breach these terms and conditions and we decide to take no action or neglect to do so, then we will still be entitled to take action and enforce our rights and remedies for any other breach.
			We may make changes to the format of the Service or the content of the Service at any time without notice.
			Advertisers will be solely responsible for the registration of Affiliates. Such registration can be executed for instance through a branded registration page, as a result of which Affiliates might receive transactional emails from Hivefiliate.
			The Advertiser will impose these general terms and conditions unconditionally upon all its Affliates and is and will be on all cricumstaces liable for any infringement on these terms by any Affiliate and/or any claim brought forward by one or more Affiliates.
			Affiliates who registered before a white label was activated by the Advertiser, will not be able to use the custom sub domain or the domain alias to login on the affiliate portal. As a result of this they will not be able to see the custom branding. They will be able however to promote the programs of the Advertiser and all Affiliate links will remain active
			Once a domain alias has been created, without any costs this alias can be changed during the first 7 days. After this term of 7 days, Hivefiliate will be entitled to charge extra costs for such change.</p>
			        </div>

			        <div>
			          <h4>9. GOVERNING LAW AND JURISDICTION</h4>
			          <p>These terms will be interpreted in accordance with the laws of the Netherlands, without regard to its conflict-of-law provisions. You and we agree to submit to the personal jurisdiction of the court of Amsterdam.</p>
			        </div>

			        <div>
			          <p>Further questions? If at any time you would like to contact us with your views about our terms of use, you can do so by emailing us at contact@hivefiliate.com</p>
			        </div>

					</div>
				</div>

				<div className="hive-footer">
					<div className="hive-grid">
						<div className="hive-contact">
							<div className="columns">
								<div className="column"><a href={process.env.PUBLIC_URL+'/'}><img src={Logo2} alt="Hivefiliate"/></a></div>
								<div className="column">
									<h4>Resources</h4>
									<p><a href={process.env.PUBLIC_URL+'/privacy'}>Privacy</a></p>
									<p><a href={process.env.PUBLIC_URL+'/terms'}>Terms of Service</a></p>
								</div>
								<div className="column">
									<h4>Address</h4>
									<p>201 King St London, Ontario N6A 1C9 Canada</p>
								</div>
								<div className="column">
									<h4>Contact</h4>
									<p>415-941-5199</p>
									<p>contact@hivefiliate.com</p>
								</div>
							</div>
						</div>
						<div className="copyright"><p>Hivefiliate All © Copyright by . All Rights Reserved.</p></div>
					</div>
				</div>


      </div>
		</React.Fragment>
	)
}
