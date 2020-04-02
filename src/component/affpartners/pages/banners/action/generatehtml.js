import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Checkbox, Loader, Icon, Message, Modal } from 'semantic-ui-react'
export default function GenerateHTML(props) {

  const [spinner, setspinner] = useState(false);
	const [iswidth, setiswidth] = useState(props.data.banner_width);
	const [isheight, setisheight] = useState(props.data.banner_height);

	function closeModal(data){
		 props.close(data);
	}

	const [htmlcode, sethtmlcode] = useState('');
	function GenerationHtml(){
    	sethtmlcode('<a href="'+props.data.image+'" rel="nofollow"><img src="'+props.data.image+'" width="'+iswidth+'" height="'+isheight+'" alt="" /></a>');
	}

	return (
		<div className="modalwrapper">
						<Modal open={true} size='small'>
					      <Modal.Header>Generate HTML code<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
						    <Modal.Content className="modalcontent">

									<Form>
								    <Form.Group widths='equal'>
								      <Form.Field>
								        <label>Choosen Banner</label>
								        <div className="bannerwidth"><img src={props.data.image}/></div>
								      </Form.Field>
								    </Form.Group>
										<Form.Group widths='equal'>
								      <Form.Field>
								        <label>Link</label>
								        <Input fluid value={props.data.image} readOnly={true}/>
								      </Form.Field>
								    </Form.Group>
										<Form.Group widths='equal'>
								      <Form.Field>
								        <label>Set Width</label>
								        <Input fluid name="width" value={iswidth} onChange={(e)=>setiswidth(e.target.value)}/>
								      </Form.Field>
											<Form.Field>
								        <label>Set Height</label>
								        <Input fluid name="height" value={isheight} onChange={(e)=>setisheight(e.target.value)}/>
								      </Form.Field>
								    </Form.Group>
										<Form.Group widths='equal'>
								      <Form.Field>
								        <label>HTML Code</label>
								        <TextArea fluid value={htmlcode} style={{ minHeight: 100 }}/>
								      </Form.Field>
								    </Form.Group>
								  </Form>

						    </Modal.Content>
						    <Modal.Actions>
						        <div className="positionright">
	                       <Button
									  		 	loading={spinner}
						              color='blue'
						              icon='check circle'
						              labelPosition='right'
						              content="Generate"
						              onClick={() => GenerationHtml()}
						            />
								</div>
						    </Modal.Actions>
					     </Modal>
				 )}}/>
		</div>
	)
}
