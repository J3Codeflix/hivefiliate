import React, {useState} from 'react'
import { Modal,Button,Message,Grid ,Icon} from 'semantic-ui-react'
import {Spinning} from '../../../../config/spinner'
import axios from 'axios'
export default function DeleteComponent(props) {

  const [spinner,setspinner] = useState(false);

  function closeModal(data){
		props.close(data);
	}
	function reloadList(){
		props.reload(true);
	}
  function callalert(open,data){
    props.alert(open,data);
  }

  function deleteConfirmProcess(){
    setspinner(true);
    let formData = new FormData();
    formData.append('type','admin_deleteuser');
    formData.append('id',props.id);
    axios.post('/users/request.php',formData)
    .then(function (response) {
      let obj = response.data;
      setspinner(false);
      reloadList();
      closeModal(false);
      if(obj==1){
        callalert(true,{text:'User successfully deleted',type:'success',size:'full',open:true});
      }else{
        callalert(true,{text:'User not successfully deleted',type:'error',size:'full',open:true});
      }
    })
    .catch(function (error) {
        console.log(error);
    });
  }


  return (
      <Modal open={true} size='mini' onClose={()=>closeModal()}>
        {spinner&&<Spinning/>}
        <Modal.Content className="deletemessage">
          <Message
            negative
            icon='question circle outline'
            header='Delete Confirmation'
            content="Are you sure you want to delete this record? You can't revert this proccess."
          />
        </Modal.Content>
        <Modal.Actions className="positioncenter">
          <Button color='red' onClick={()=> closeModal()}>Cancel</Button>
          <Button
            color='green'
            icon='checkmark'
            labelPosition='right'
            content='Yes, Confirm'
            onClick={()=>deleteConfirmProcess()}
          />
        </Modal.Actions>
      </Modal>
  );
}
