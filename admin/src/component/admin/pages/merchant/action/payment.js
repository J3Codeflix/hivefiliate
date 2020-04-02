import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Dimmer, Loader, Icon, Message, Modal, Checkbox,Radio, Item, Table } from 'semantic-ui-react'
import axios from 'axios'
import {getvalidations} from './validate'
import renderHTML from 'react-render-html'
import {Spinning, Success, Error} from '../../../../config/spinner'

export default function PaymentComponent(props) {

  /* For Modal */
  function closeModal(data){
      props.close(data);
  }
  function callalert(open,data){
      props.alert(open,data);
  }
  function reloadlist(){
      props.reload();
  }

  /* Form Submit */
  const [seen, setseen] = useState(false);
  const buttonEl = useRef(null);
  const [buttonclick, setbuttonClick] = useState(0);
  function buttonSubmit(arg){
      setbuttonClick(arg);
      buttonEl.current.click();
	}

  const [isucess,setisucess] = useState(false);
  const [iserror,setiserror] = useState(false);
  const [spinner, setspinner] = useState(false);
  const [state, setstate] = useState({
      id:props.data.id,
      currency:props.data.currency,
      currentplan:props.data.currentplan,
      plan:2,
      sub_professional:1,
      sub_enterprise:1,
      price_professional:props.data.priceplan.price_professional,
      price_enterprise:props.data.priceplan.price_enterprise,
      remdays:props.data.days_remaining,
      description:'',
      plan_expire:props.data.plan_expire,
      is_confirm:false,
  });

  console.log(props.data.priceplan);

  function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','admin_merchantpayment');
		formData.append('info',JSON.stringify(values));
		axios.post('/merchant/request.php',formData)
		.then(function (response) {
			let obj = response.data;
      setspinner(false);
			if(obj==1){
				resetForm();
				if(buttonclick==1){callalert(true,{text:'Pay subscription successfully process',type:'success',size:'full',open:true});reloadlist();closeModal(false);}
				if(buttonclick==2){setisucess(true);reloadlist();setTimeout(function() {setisucess(false);},2000);}
				return false;
			}
			if(obj==0){resetForm();setiserror(true);setTimeout(function() {setiserror(false);},2000);return false;}
			Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {resetForm();setiserror(true);setspinner(false);return false;});
   }

   /* Calculate Pricing */
   const [ispaying, setpaying] = useState(true);
   const [plan2, setplan2] = useState({
     month:'Professional plan - 1 month subscription',
     one_year:'Professional plan - 1 year subscription',
     two_year:'Professional plan - 2 years subscription',
   });
   const [plan3, setplan3] = useState({
     month:'Enterprise plan - 1 month subscription',
     one_year:'Enterprise plan - 1 year subscription',
     two_year:'Enterprise plan - 2 years subscription',
   });

   const [datadescription, setdatadescription] = useState('Professional plan - 1 month subscription');
   const [datasubtotal, setdatasubtotal] = useState(props.data.priceplan.pro_price);
   const [datatotal, setdatatotal] = useState(props.data.priceplan.pro_price);

   function calculatepricingplan(plan,price_professional,sub_professional,price_enterprise,sub_enterprise){

       if(plan==2){
         if(sub_professional==1){var plano  = plan2.month;}
         if(sub_professional==12){var plano = plan2.one_year;}
         if(sub_professional==24){var plano = plan2.two_year;}

         var price          = price_professional;
         var subtotal       = price*sub_professional;
         var total          = subtotal;

       }
       if(plan==3){
         if(sub_enterprise==1){var plano  = plan3.month;}
         if(sub_enterprise==12){var plano = plan3.one_year;}
         if(sub_enterprise==24){var plano = plan3.two_year;}
         var price        = price_enterprise;
         var subtotal     = price*sub_enterprise;
         var total        = subtotal;

       }
       var totalall       = props.data.currency+total.toFixed(2);

       setdatadescription(plano);
       setdatasubtotal(totalall);
       setdatatotal(totalall);
   }



	return (
		<div className="modalwrapper">
		     <Formik
	            initialValues={state}
	            onSubmit={handleSubmitForm}
	            render={formProps => {
	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
		          return(
						      <Modal open={true} size='fullscreen' onClose={()=>closeModal(false)}>
					        <Modal.Header>Payment: Choose Pricing Plan<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
						      <Modal.Content className="modalcontent">

                  <Message
                    warning
                    icon='info circle'
                    header='Manually Pay Merchant Subscription'
                    list={[
                      'This payment does not transfer money to any bank or account.',
                      'Use this payment processing if the merchant store is having problem on paying subscription.',
                      'This feature allow also if merchant manually transfered the payment to any bank account or via paypal and ask to pay their subscription plan.',
                      'Always verified if the manual transfered payment has been made to bank otherwise do not manually pay their subscription.',
                    ]}
                  />

                  {isucess&&Success()}
                  {iserror&&Error()}

                  <Form>
                      <div className="columns">

                       {/*---------------- Current Plan--------------------------------- */}
                       <div className="column is-one-third">
                           <div className="package-currentplan">
                              <Table celled striped>
                                 <Table.Header>
                                   <Table.Row>
                                     <Table.HeaderCell colSpan='3' className="currentplan">Account Current Plan</Table.HeaderCell>
                                   </Table.Row>
                                 </Table.Header>
                                 <Table.Body>
                                   <Table.Row>
                                     <Table.Cell collapsing><Icon name='bullseye' /> ID</Table.Cell>
                                     <Table.Cell>{props.data.id}</Table.Cell>
                                   </Table.Row>
                                   <Table.Row>
                                     <Table.Cell collapsing><Icon name='bullseye' /> Email</Table.Cell>
                                     <Table.Cell>{props.data.email}</Table.Cell>
                                   </Table.Row>
                                   <Table.Row>
                                     <Table.Cell collapsing><Icon name='bullseye' /> Store Name</Table.Cell>
                                     <Table.Cell>{props.data.store_name}</Table.Cell>
                                   </Table.Row>
                                   <Table.Row>
                                     <Table.Cell collapsing><Icon name='bullseye' /> Date Registered</Table.Cell>
                                     <Table.Cell>{props.data.dateadded}</Table.Cell>
                                   </Table.Row>
                                   <Table.Row>
                                     <Table.Cell collapsing><Icon name='bullseye' /> Type Plan</Table.Cell>
                                     <Table.Cell>{renderHTML(props.data.type_plan)}</Table.Cell>
                                   </Table.Row>
                                   <Table.Row>
                                     <Table.Cell collapsing><Icon name='bullseye' /> Price Plan</Table.Cell>
                                     <Table.Cell>{props.data.price_plan}</Table.Cell>
                                   </Table.Row>
                                   <Table.Row>
                                     <Table.Cell collapsing><Icon name='bullseye' /> Status</Table.Cell>
                                     <Table.Cell>{renderHTML(props.data.status)}</Table.Cell>
                                   </Table.Row>
                                   <Table.Row>
                                     <Table.Cell collapsing><Icon name='bullseye' /> Date Expiration</Table.Cell>
                                     <Table.Cell>{props.data.plan_expire}</Table.Cell>
                                   </Table.Row>
                                   <Table.Row>
                                     <Table.Cell collapsing><Icon name='bullseye' /> Rem. Days</Table.Cell>
                                     <Table.Cell>{props.data.days_remaining}</Table.Cell>
                                   </Table.Row>
                                 </Table.Body>
                              </Table>
                           </div>
                       </div>


                        <div className="column">
                            {/*---------------- Professional Plan--------------------------------- */}
                            <div className={values.plan==2?'package-plan professional active_professional':'package-plan professional'}>
                              <div className="columns is-mobile is-vcentered">
                                <div className="column">
                                  <div className="columns is-mobile">
                                    <div className="column is-1">
                                        <Form.Group inline className="planradio">
                                          <Field name="plan">
                                              {({ field, form }) => (
                                                <Form.Field>
                                                    <Radio className="labelagree" id="plan_professional" value='2' checked={values.plan==2}
                                                        onChange={(e)=>{

                                                          calculatepricingplan(
                                                            e.target.value,
                                                            values.price_professional,
                                                            '1',
                                                            values.price_enterprise,
                                                            '1',
                                                          );

                                                          setFieldValue(field.name,e.target.value);
                                                          setFieldValue('sub_enterprise',1);
                                                          setFieldValue('sub_professional',1);
                                                        }}
                                                    />
                                                </Form.Field>
                                              )}
                                          </Field>
                                        </Form.Group>
                                    </div>
                                    <div className="column">
                                      <h3>Professional Plan</h3>
                                      <p>Unlimited Activities Track, Unlimited Activities Track, Extensive Settings</p>
                                      <div className="package-subscription">
                                        <ul>
                                          <li>
                                              <Form.Group inline>
                                                <Field name="sub_professional">
                                                    {({ field, form }) => (
                                                      <Form.Field>
                                                          <Radio className="labelagree" id="subscription_1" label='1 month subscription' value='1' checked={values.sub_professional==1}
                                                              onChange={(e)=>{

                                                                  calculatepricingplan(
                                                                    values.plan,
                                                                    values.price_professional,
                                                                    e.target.value,
                                                                    values.price_enterprise,
                                                                    values.sub_enterprise
                                                                  );


                                                                  setFieldValue(field.name,e.target.value);
                                                              }}
                                                          />
                                                      </Form.Field>
                                                    )}
                                                </Field>
                                              </Form.Group>
                                          </li>
                                          <li>
                                              <Form.Group inline>
                                                <Field name="sub_professional">
                                                    {({ field, form }) => (
                                                      <Form.Field>
                                                          <Radio className="labelagree" id="subscription_2" label='1 year subscription' value='12' checked={values.sub_professional==12}
                                                              onChange={(e)=>{

                                                                  calculatepricingplan(
                                                                    values.plan,
                                                                    values.price_professional,
                                                                    e.target.value,
                                                                    values.price_enterprise,
                                                                    values.sub_enterprise
                                                                  );

                                                                  setFieldValue(field.name,e.target.value);
                                                              }}
                                                          />
                                                      </Form.Field>
                                                    )}
                                                </Field>
                                              </Form.Group>
                                          </li>
                                          <li>
                                              <Form.Group inline>
                                                <Field name="sub_professional">
                                                    {({ field, form }) => (
                                                      <Form.Field>
                                                          <Radio className="labelagree" id="subscription_3" label='2 years subscription' value='24' checked={values.sub_professional==24}
                                                              onChange={(e)=>{

                                                                  calculatepricingplan(
                                                                    values.plan,
                                                                    values.price_professional,
                                                                    e.target.value,
                                                                    values.price_enterprise,
                                                                    values.sub_enterprise
                                                                  );
                                                                  setFieldValue(field.name,e.target.value);
                                                              }}
                                                          />
                                                      </Form.Field>
                                                    )}
                                                </Field>
                                              </Form.Group>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="column is-two-fifths"><h4>{props.data.priceplan.pro_price}<span>/monthly</span></h4></div>
                              </div>
                            </div>
                            {/*---------------- Professional Plan End--------------------------------- */}

                            {/*---------------- Enterprise Plan--------------------------------------- */}
                            <div className={values.plan==3?'package-plan enterprise active_enterprise':'package-plan enterprise'}>
                              <div className="columns is-mobile is-vcentered">
                                <div className="column">
                                  <div className="columns is-mobile">
                                    <div className="column is-1">
                                        <Form.Group inline className="planradio">
                                          <Field name="plan">
                                              {({ field, form }) => (
                                                <Form.Field>
                                                    <Radio className="labelagree" id="plan_enterprise" value='3' checked={values.plan==3}
                                                        onChange={(e)=>{
                                                            setFieldValue(field.name,e.target.value);
                                                            setFieldValue('sub_enterprise',1);
                                                            setFieldValue('sub_professional',1);
                                                            calculatepricingplan(
                                                              e.target.value,
                                                              values.price_professional,
                                                              '1',
                                                              values.price_enterprise,
                                                              '1',
                                                            );
                                                        }}
                                                    />
                                                </Form.Field>
                                              )}
                                          </Field>
                                        </Form.Group>
                                    </div>
                                    <div className="column">
                                      <h3>Enterprise Plan</h3>
                                      <p>Best for businesses who need customized tracking and functionality to support large partner channels and referral networks.</p>
                                      <div className="package-subscription">
                                      <ul>
                                        <li>
                                            <Form.Group inline>
                                              <Field name="sub_enterprise">
                                                  {({ field, form }) => (
                                                    <Form.Field>
                                                        <Radio className="labelagree" id="subscription_4" label='1 month subscription' value='1' checked={values.sub_enterprise==1}
                                                            onChange={(e)=>{

                                                                calculatepricingplan(
                                                                  values.plan,
                                                                  values.price_professional,
                                                                  values.sub_professional,
                                                                  values.price_enterprise,
                                                                  e.target.value
                                                                );
                                                                setFieldValue(field.name,e.target.value);
                                                            }}
                                                        />
                                                    </Form.Field>
                                                  )}
                                              </Field>
                                            </Form.Group>
                                        </li>
                                        <li>
                                            <Form.Group inline>
                                              <Field name="sub_enterprise">
                                                  {({ field, form }) => (
                                                    <Form.Field>
                                                        <Radio className="labelagree" id="subscription_5" label='1 year subscription' value='12' checked={values.sub_enterprise==12}
                                                            onChange={(e)=>{
                                                                calculatepricingplan(
                                                                  values.plan,
                                                                  values.price_professional,
                                                                  values.sub_professional,
                                                                  values.price_enterprise,
                                                                  e.target.value
                                                                );
                                                                setFieldValue(field.name,e.target.value);
                                                            }}
                                                        />
                                                    </Form.Field>
                                                  )}
                                              </Field>
                                            </Form.Group>
                                        </li>
                                        <li>
                                            <Form.Group inline>
                                              <Field name="sub_enterprise">
                                                  {({ field, form }) => (
                                                    <Form.Field>
                                                        <Radio className="labelagree" id="subscription_6" label='2 years subscription' value='24' checked={values.sub_enterprise==24}
                                                            onChange={(e)=>{

                                                                calculatepricingplan(
                                                                  values.plan,
                                                                  values.price_professional,
                                                                  values.sub_professional,
                                                                  values.price_enterprise,
                                                                  e.target.value
                                                                );
                                                                setFieldValue(field.name,e.target.value);
                                                            }}
                                                        />
                                                    </Form.Field>
                                                  )}
                                              </Field>
                                            </Form.Group>
                                        </li>
                                      </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="column is-two-fifths"><h4>{props.data.priceplan.enter_price}<span>/monthly</span></h4></div>
                              </div>
                            </div>
                            {/*------------------------------------- Enterprise Plan End--------------------------------- */}

                        </div>
                        <div className="column is-one-quarter">

                          <div className="pricing-panel">
                            <div className="pricing-panel-header"><h3>Subscription Summary</h3></div>
                            <div className="pricing-panel-body description">
                              <div className="columns is-mobile">
                                <div className="column"><h3>{datadescription}</h3></div>
                                <div className="column is-one-third"><h4>{datasubtotal}</h4></div>
                              </div>
                            </div>
                            <div className="pricing-panel-body subtotal">
                              <div className="columns is-mobile">
                                <div className="column text-right"><h3>Subtotal</h3></div>
                                <div className="column is-one-third"><h4>{datasubtotal}</h4></div>
                              </div>
                            </div>
                            <div className="pricing-panel-body total">
                              <div className="columns is-mobile">
                                <div className="column text-right"><h3>Total</h3></div>
                                <div className="column is-one-third"><h4>{datatotal}</h4></div>
                              </div>
                            </div>
                          </div>

                          <div className="formdescription">
                              <Message visible warning>You can add notes, description or message below for this specific payment</Message>
                              <Form.Group widths='equal'>
                                <Field name="description">
                                  {({ field, form }) => (
                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                      <TextArea fluid {...field} onChange={handleChange} placeholder="Enter your notes here"/>
                                      { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                    </Form.Field>
                                 )}
                              </Field>
                              </Form.Group>
                              <Form.Group inline>
                                  <Field name="is_confirm">
                                      {({ field, form }) => (
                                          <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                              <Checkbox className="labelagree" toggle id="is_confirm" label="I am fully understand the manual payment subscription" checked={values.is_confirm}
                                                  onChange={(e)=>{
                                                      setFieldValue(field.name,e.target.checked);
                                                      if(e.target.checked==true){
                                                        setpaying(false);
                                                      }else{
                                                        setpaying(true);
                                                      }

                                                  }}
                                              />
                                          </Form.Field>
                                      )}
                                  </Field>
                              </Form.Group>
                          </div>


                        </div>
                    </div>
						      </Form>

						    </Modal.Content>
  						    <Modal.Actions>
  						        <div className="positionright">
                            <Button
                                color='red'
                                icon='close'
                                labelPosition='right'
                                content="Cancel"
                                onClick={() => closeModal(false)}
                            />
  	                        <Button
    									        loading={spinner}
                              disabled={ispaying}
    						              color='green'
    						              icon='check circle'
    						              labelPosition='right'
    						              content="Confirm Pay Subscription"
  						                onClick={() => buttonSubmit(1)}
  						            />
  									   <button type="button" className="display-none" type="button" ref={buttonEl} onClick={handleSubmit}></button>
  								    </div>
  						    </Modal.Actions>
					     </Modal>
				 )}}/>
		</div>
	)
}
