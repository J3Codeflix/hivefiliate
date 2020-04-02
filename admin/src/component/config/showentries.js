import React, {useState, useEffect} from 'react'
import { Form, Select} from 'semantic-ui-react'
import axios from 'axios'

export default function EntryList(props) {

	const [entries, setentries]  = useState(props.entrycallback);
    const selectOptions = [
	    { key: '1', text: '10', value: '10'},
	    { key: '2', text: '20', value: '20',  disabled:props.lengthCallback<20?true:false},
	    { key: '3', text: '50', value: '50',  disabled:props.lengthCallback<50?true:false},
	    { key: '4', text: '100', value: '100', disabled:props.lengthCallback<100?true:false},
	]

	function ChangeEntries(val){
    setentries(val);
    let formData = new FormData();
    formData.append('type','change_entries');
    formData.append('val',val);
    formData.append('entries',props.entryType);
    axios.post('/admin/entries/request.php',formData)
    .then(function (response) {
         let obj = response.data;
         if(obj==1){reloadEntries()}
    })
    .catch(function (error) {
        console.log(error);
    });
  }

   function reloadEntries(){
   	props.callbackreload();
   }

	return (
		<React.Fragment>
			<Form>
			    <Form.Group>
			      <Form.Field><label>Show</label></Form.Field>
			      <Form.Field>
			        <Select name="val" closeOnChange fluid options={selectOptions} value={entries} onChange={(e, { value }) => ChangeEntries(value)}/>
			      </Form.Field>
			      <Form.Field><label>Entries</label></Form.Field>
			    </Form.Group>
			</Form>
		</React.Fragment>
	)
}
