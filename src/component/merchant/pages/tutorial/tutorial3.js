import React, {useState, useEffect,useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import {ProgramAffLink} from '../../../include/merchant_redirect'
import {UserContext} from '../../layout/userContext'
export default function Tutorial(props) {

  const usersContext = useContext(UserContext);
	let store_id 					= null;
	let merchant_id 			= null;
	let store_hash 				= null;

  if(usersContext){
			merchant_id 				= usersContext.merchant_id;
			store_id 						= usersContext.id;
			store_hash	 	  	  = usersContext.store_id;
	}

const [activeIndex, setactive] = useState(0);

	return (
		<React.Fragment>
	        <div className="tutorial pagecontent">
                <h2 className="titlewrapper">Hiveffiliate App Tutorial</h2>
                <div className="tutorial-accordion">
                    <Accordion fluid styled>
                        <Accordion.Title
                            active={activeIndex === 0}
                            index={0}
                            onClick={()=>setactive(0)}
                        >
                        <Icon name='dropdown' />Check the integration page
                        </Accordion.Title>
                        <Accordion.Content className="accontent" active={activeIndex === 0}>
                            <p>Welcome to your affiliate program! First things first: go to the Integration page of your panel and read carefully the information there. Add the tracking codes to your store, if needed.</p>
                            <Message warning visible>Note: If you are using only Shopify for your store (no pages are hosted on other platforms or servers), the integration is fully automatic and you do not need to do anything else.</Message>
                            {/*<p className="button-completed"><Button className="blue" icon labelPosition='left'>Complete this step<Icon name='thumbs up outline' /></Button></p>*/}
                        </Accordion.Content>

                        <Accordion.Title
                            active={activeIndex === 1}
                            index={1}
                            onClick={()=>setactive(1)}
                        >
                        <Icon name='dropdown' />Test the integration
                        </Accordion.Title>
                        <Accordion.Content className="accontent" active={activeIndex === 1}>
                            <p>To test your integration, open the link of your test affiliate in the private/incognito mode of your browser (you can find it in the Affiliates page, click the cogwheel in the table and look for "Affiliate's link").</p>
                            <p>If the integration is successful, the number in the Visitors column in the Affiliates page will increase by 1.</p>
                            <p>You can also make a test purchase to test the tracking of the orders.</p>
                            {/*<Message warning visible>Note: If you want to see what kind of information is available to your affiliates and what their panel looks</Message>*/}
                            {/*<p className="button-completed"><Button className="blue" icon labelPosition='left'>Complete this step<Icon name='thumbs up outline' /></Button></p>*/}
                        </Accordion.Content>

                        {/*<Accordion.Title
                            active={activeIndex === 2}
                            index={2}
                            onClick={()=>setactive(2)}
                        >
                        <Icon name='dropdown' />Block your IP/email
                        </Accordion.Title>
                        <Accordion.Content className="accontent" active={activeIndex === 2}>
                            <p>Sometimes, when testing your program, a cookie may be saved to your device and subsequent manual orders made by you or your staff can show up as referred and a commission may be attributed to an affiliate erroneously.</p>
                            <p>To make sure this does not happen, use the "Block certain user IP addresses" and/or "Block client's emails" options in the Settings > General. With the first option, you can block your IP address and those of your staff, and with the second – the email(s) you use when placing orders manually. Doing this will block all orders coming from those IPs/emails from being inserted into the Hiveffiliate database.

</p>
                            {/*<p className="button-completed"><Button className="blue" icon labelPosition='left'>Complete this step<Icon name='thumbs up outline' /></Button></p>*/}
                        {/*</Accordion.Content>*/}

                        <Accordion.Title
                            active={activeIndex === 3}
                            index={3}
                            onClick={()=>setactive(3)}
                        >
                        <Icon name='dropdown' />Choose and set up the tracking methods
                        </Accordion.Title>
                        <Accordion.Content className="accontent" active={activeIndex === 3}>
                            <p>Hiveffiliate offers a variety of tracking methods for your affiliate program. You can enable or disable a particular method from Settings > Tracking > "Methods for tracking affiliated users". After choosing the methods you will use, do not forget to save the changes.</p>

                            <div className="link-tracking">
                                <div className="segment-title">
                                    <h3>Link tracking</h3>
                                    <p className="text-blur">Using this method, you can provide your affiliates with a unique link which they can use to promote your store. Hiveffiliate will track the visits made from that link and the order(s) of the referred client.</p>
                                </div>
                                <Message
                                    warning
                                    icon='info circle'
                                    header='Here are the main settings for link tracking (they can be found in Settings > Tracking):'
                                    list={[
                                        'Default cookie duration – When a customer clicks a tracking link, a cookie is saved to their device. While the cookie is active, any purchase they make will be attributed to the affiliate. Using this option, you can specify the duration of the cookie (it can be from 1 to 365 days).',
                                        'Commission type for link tracking – This option allows you to choose whether the commission will be calculated as a percentage of the price of the product ("Percent from purchase"), as a flat rate ("Flat rate per purchase"), or you can decide to give a commission for each visit coming from a tracking link ("By visit").',
                                        'Default commission for link tracking – If you choose "Percent from purchase", here you can specify the commission percentage (e.g. 10%).',
                                        'Amount per purchase – If you choose “Flat rate per purchase”, here you can set the amount an affiliate will receive for each purchase (e.g. 10$).',
                                        'The pay that affiliates gets, when someone visits your site – If you choose “By visit”, here you can set the amount an affiliate will receive for each visit (e.g. 0.25$).',
                                    ]}
                                />
                                <p>In Settings > Tracking > "Link tracking settings" you can find additional options to customize the link code for each affiliate and set custom commissions per affiliate, among others.</p>
                            </div>

                            <div className="link-tracking">
                                <div className="segment-title">
                                    <h3>QR code tracking</h3>
                                    <p>You can provide your affiliates with their own QR code. When a customer scans the code, the visit and the subsequent order(s) made by the client are tracked by Hiveffiliate.</p>
                                    <p>Go to Settings > Tracking > "QR codes page" to generate QR codes for your affiliates.</p>
                                    <p>The commission will be calculated based on the settings specified for Link tracking.</p>
                                </div>
                            </div>

                            <div className="link-tracking">
                                <div className="segment-title">
                                    <h3>Coupon code tracking</h3>
                                    <p className="text-blur">Use this method if you want to provide your affiliates with their personal coupon codes. When a customer uses an affiliate’s code at checkout, the affiliate will receive a commission for the purchase.</p>
                                    <Message
                                        warning
                                        icon='info circle'
                                        header='Here are the main settings for coupon code tracking (you can find them in Settings > Tracking > "Coupon code settings"):'
                                        list={[
                                            "Default coupon code affiliate's commission – The default commission an affiliate will receive for each purchase.",
                                            'Coupon code earning type – The way the commission is calculated. Can be a percent of the price or a flat rate.',
                                        ]}
                                    />
                                    <p>Under "List of Affiliates", you can set each affiliate's code (it must be created in your store first!) and custom commissions for specific affiliates.

</p>
                                </div>
                            </div>


                            <div className="link-tracking">
                                <div className="segment-title">
                                    <h3>SKU tracking</h3>
                                    <p className="text-blur">Tracking by SKU is a versatile tracking method which allows you to set specific rules for tracking particular products such as allowing or disabling certain products, paying royalties to your affiliates, and setting per product commissions. It is an addition to the other tracking methods and cannot be used on its own.</p>
                                    <Message
                                        warning
                                        icon='info circle'
                                        header='These are the main settings for SKU tracking (they are located in Settings > Tracking > "SKU settings"):'
                                        list={[
                                            "Allow or disable commission for selected SKU only – You can choose to allow or disable commissions for specific products. List the products in the corresponding field, separated by commas. If you use only the “Allowed SKU” field, all the other SKUs will be disabled and vice versa.",
                                            "Set different commission for specific SKU – Use this option to set a specific commission for particular products. You can enter multiple SKUs per row, separated by commas.",
                                            "Associate SKU with affiliates – If you need to pay an affiliate for each sale of an item, regardless whether it is referred or not, you can use this option. It can be especially useful to calculate royalties for the designers of the products or the copyright holders, for example. You can enter multiple SKUs and IDs in each row, separated by commas.",
                                        ]}
                                    />
                                </div>
                            </div>

                            <div className="link-tracking">
                                <div className="segment-title">
                                    <h3>Email tracking</h3>
                                    <p className="text-blur">Email tracking is used to associate the email of a customer with a particular affiliate, so the affiliate receives a commission for each order of the client (as long as the same email is used) even after the cookie has expired or if the coupon code was not used.</p>
                                    <Message
                                        warning
                                        icon='info circle'
                                        header='Here are the main options for Email tracking (they can be found in Settings > Tracking > "E-mail tracking settings"):'
                                        list={[
                                           "Default email tracking commission – The default commission an affiliate will receive for each purchase from an associated client.",
                                           "Email tracking earning type – The way the commission is calculated. Can be a percent of the price or a flat rate.",
                                           "Auto associate emails with affiliate – If you enable this option, the email of each new referred customer (through another tracking method) will be associated with the referring affiliate and the affiliate will receive a commission for every purchase of the client (as long as they use the same email).",
                                        ]}
                                    />
                                    <p>Under "List of Affiliates", you can set custom commissions for specific affiliates and manually associate clients' emails.</p>
                                </div>
                            </div>

                            {/*<p className="button-completed"><Button className="blue" icon labelPosition='left'>Complete this step<Icon name='thumbs up outline' /></Button></p>*/}
                        </Accordion.Content>

                        <Accordion.Title
                            active={activeIndex === 4}
                            index={4}
                            onClick={()=>setactive(4)}
                        >
                        <Icon name='dropdown' />Registration and login pages
                        </Accordion.Title>
                        <Accordion.Content className="accontent" active={activeIndex === 4}>
                            <p>In order for your affiliates to register, you need to provide them with a link to the login or registration page of your program:</p>
                            <p>Login page: <Button as="a" href={ProgramAffLink('login/?merchant='+merchant_id)} target="_blank" size='tiny' className="green" icon labelPosition='right'>Hivefiliate Link<Icon name='arrow alternate circle right' /></Button></p>
                            <p>Registration page: <Button as="a" target="_blank" href={ProgramAffLink('register/?merchant='+merchant_id)} size='tiny' className="green" icon labelPosition='right'>Hivefiliate Link<Icon name='arrow alternate circle right' /></Button></p>


                            {/*<p>You, the admin, and the affiliates log in from the same page, but different panels are loaded.</p>
                            <p>If you like, you can add various fields for the registration page from Settings > Customization > "Additional fields for affiliates". You can also add text to the login and registration pages from the options "Text for the affiliate's login page" and "Text for the affiliate's register page".</p>
                            <p>In case you want to add the registration form to your site, just paste the following HTML code in a page of your choice:</p>
                            <p>&lt;iframe src="#" width="100%" height="800" frameborder="0" &gt;&lt;/iframe&gt;(to show only the form)</p>
                            <p>or</p>

                            <p>Тhe registration pages are public by default and the URLs differ only by the affiliate program ID, so someone can manually change the URL in their address bar to find the registration pages of many affiliate programs. That is why you have the option to make your registration page private. You can enable this option in Settings > "Make the affiliate's sign up page private". The URL of the private sign up page will appear below and you can share it with potential affiliates, but no one else will be able to find it. The registration link will be removed from the login page.</p>
                            {/*<p className="button-completed"><Button className="blue" icon labelPosition='left'>Complete this step<Icon name='thumbs up outline' /></Button></p>*/}
                        </Accordion.Content>



                        <Accordion.Title
                            active={activeIndex === 5}
                            index={5}
                            onClick={()=>setactive(5)}
                        >
                        <Icon name='dropdown' />Set up payments
                        </Accordion.Title>
                        <Accordion.Content className="accontent" active={activeIndex === 5}>
                            <p>We use paypal payment for now.</p>
                            {/*<p><Button size='tiny' className="green" icon labelPosition='right'>Hivefiliate Link<Icon name='arrow alternate circle right' /></Button></p>*/}
                            {/*<p className="button-completed"><Button className="blue" icon labelPosition='left'>Complete this step<Icon name='thumbs up outline' /></Button></p>*/}
                        </Accordion.Content>

                        {/*<Accordion.Title
                            active={activeIndex === 6}
                            index={6}
                            onClick={()=>setactive(6)}
                        >
                        <Icon name='dropdown' />Customize the look of your program
                        </Accordion.Title>
                        <Accordion.Content className="accontent" active={activeIndex === 6}>
                            <p>You can use the "Design Customization" option in the Settings > Customization to make the appearance of the affiliate's panel (and also the login and registration pages) match the theme of your website. From there you can change the colors, add your logo, add custom text, etc.</p>
                            <p>Here you can read about each available option: </p>
                            {/*<p><Button size='tiny' className="green" icon labelPosition='right'>Hivefiliate Link<Icon name='arrow alternate circle right' /></Button></p>*}
                            {/*<p className="button-completed"><Button className="blue" icon labelPosition='left'>Complete this step<Icon name='thumbs up outline' /></Button></p>*/}
                        {/*</Accordion.Content>*/}

                        <Accordion.Title
                            active={activeIndex === 7}
                            index={7}
                            onClick={()=>setactive(7)}
                        >
                        <Icon name='dropdown' />Other important options
                        </Accordion.Title>
                        <Accordion.Content className="accontent" active={activeIndex === 7}>
                            <Message
                                warning
                                icon='info circle'
                                list={[
                                    "The currency that we use is $US Dollar and it should be the same in your store.",
                                    'Affiliate earnings will automatically generated when the payment status of order is paid.'
                                ]}
                            />
                            {/*<p>In this FAQ entry, we have explained more of the options in the Settings page: </p>
                            <p><Button size='tiny' className="green" icon labelPosition='right'>Hivefiliate Link<Icon name='arrow alternate circle right' /></Button></p>
                            {/*<p className="button-completed"><Button className="blue" icon labelPosition='left'>Complete this step<Icon name='thumbs up outline' /></Button></p>*/}
                        </Accordion.Content>

                        <Accordion.Title
                            active={activeIndex === 8}
                            index={8}
                            onClick={()=>setactive(8)}
                        >
                        <Icon name='dropdown' />Affiliates, Orders, Banners
                        </Accordion.Title>
                        <Accordion.Content className="accontent" active={activeIndex === 8}>
                            <p>The Affiliates page is where you can see all the information about your affiliates. You can also change the tracking settings for a particular affiliate in their details window by clicking the cogwheel to the right. You can filter the data in the table by different criteria, add affiliates manually and export the stats.</p>
                            <p>The Orders page is where you can find all the referred orders. You can set a date range and filter by affiliate and order ID, etc. You can edit some of the details of an order and change its status by clicking the cogwheel to the right. As with the affiliates, you can also add orders manually.</p>
                            <p>In the Banners page you can create banners, which your affiliates can use to promote your store.</p>
                            {/*<p><Button size='tiny' className="green" icon labelPosition='right'>Hivefiliate Link<Icon name='arrow alternate circle right' /></Button></p>*}
                            {/*<p className="button-completed"><Button className="blue" icon labelPosition='left'>Complete this step<Icon name='thumbs up outline' /></Button></p>*/}
                        </Accordion.Content>

                        {/*<Accordion.Title
                            active={activeIndex === 9}
                            index={9}
                            onClick={()=>setactive(9)}
                        >
                        <Icon name='dropdown' />Video tutorials
                        </Accordion.Title>
                        <Accordion.Content className="accontent" active={activeIndex === 9}>
                            <p>We have started creating video tutorials for the app. You can find them here: </p>
                            {/*<p><Button size='tiny' className="green" icon labelPosition='right'>Hivefiliate Link<Icon name='arrow alternate circle right' /></Button></p>*}
                            <p>For the moment there are only few videos available, answering some of the most frequently asked questions, but in time we will add more.</p>
                            {/*<p className="button-completed"><Button className="blue" icon labelPosition='left'>Complete this step<Icon name='thumbs up outline' /></Button></p>*/}
                        {/*</Accordion.Content>*/}


                    </Accordion>
                </div>
            </div>
		</React.Fragment>
	)
}
