import React, {useState, useEffect, useRef,useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Checkbox, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import { Formik, Field } from 'formik'
import {getvalidations} from './validate'
import {UserContext} from '../../layout/userContext'

export default function LinkGenerator(props) {

    const usersContext = useContext(UserContext);
    let context_affiliateparam     	= null;
	if(usersContext){
        context_affiliateparam      = usersContext.affiliate_param;
	}


    const [spinner, setspinner] = useState(false);
    const [shows, setshows] = useState(false);
    const [state, setstate] = useState({
        link_url:'',
    });

    const [affiliatedlink, setaffiliatedlink] = useState('');
    const [htmlcode, sethtmlcode] = useState('');

    function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
        setaffiliatedlink(values.link_url+context_affiliateparam);
        sethtmlcode('<a href="'+values.link_url+context_affiliateparam+'" rel="nofollow">Click here</a>');
        setshows(true);
    }

	return (
		<React.Fragment>
	        <div className="affaccount pagecontent">

                    <Formik
                        initialValues={state}
                        validationSchema={getvalidations}
                        onSubmit={handleSubmitForm}
                        render={formProps => {
                        const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
                        return(
                            <div className="segment-wrapper">

                              <Message
                                positive
                                icon='info circle'
                                header='Enter the correct url to avoid tracking problem. Below are the correct sample when entering url to generate.'
                                list={[
                                  'https://hivefiliate.com',
                                  'https://hivefiliate.com/subname',
                                  'https://hivefiliate.com/subname/anothersubname'
                                ]}
                              />

                              <Message
                                negative
                                icon='hand paper outline'
                                header='Avoid these following sample when generating a link'
                                list={[
                                  'https://hivefiliate.com/. Avoid slash on last link url',
                                  'https://hivefiliate.com/subname?param=123. Avoid parameter. Remove parameter before generating link',
                                ]}
                              />

                                <div className="columns iscolumns is-mobile">
                                    <div className="column is-one-third">
                                        <h2>Link Generator</h2>
                                        <h3>This page will generate your unique affiliate link, just paste the link you wish to refer to and hit the "Generate" button.</h3>
                                    </div>
                                    <div className="column iscontent text-blue">
                                        <Form>
                                            <Form.Group widths='equal'>
                                                <Field name="link_url">
                                                    {({ field, form }) => (
                                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                                        <label>Link</label>
                                                        <Input fluid {...field} onChange={handleChange} placeholder="Enter the page url of the store"/>
                                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                                    </Form.Field>
                                                    )}
                                                </Field>
                                            </Form.Group>
                                        </Form>
                                        {shows&&<div className="generated_link">
                                            <Form>
                                                <Form.Group widths='equal'>
                                                    <Form.Field>
                                                        <label>Affiliated Link</label>
                                                        <Input fluid value={affiliatedlink} />
                                                    </Form.Field>
                                                </Form.Group>
                                                <Form.Group widths='equal'>
                                                    <Form.Field>
                                                        <label>HTML Code</label>
                                                        <TextArea fluid value={htmlcode} />
                                                    </Form.Field>
                                                </Form.Group>
                                            </Form>
                                        </div>}
                                    </div>
                                </div>


                                <div className="columns iscolumns is-mobile">
                                    <div className="column is-one-third"></div>
                                    <div className="column iscontent text-blue">
                                       <Button
                                            loading={spinner}
                                            color='blue'
                                            icon='check circle'
                                            labelPosition='right'
                                            content="Generate"
                                            onClick={handleSubmit}
                                        />
                                    </div>
                                </div>
                            </div>
                     )}}/>


            </div>
		</React.Fragment>
	)
}
