import React, {useState, useEffect, useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Menu, Segment, Message, Modal, Header, Icon, Image, Table } from 'semantic-ui-react'
import AddBanner from './action/add'
import UpdateBanner from './action/update'
import Categories from './action/categories'
import Settings from './action/settings'
import Delete from './action/delete'


import Paginations from '../../../include/paginations'
import {Spinning} from '../../../include/circlespin'
import EntryList from '../../../include/showentries'
import {windowReload,Public_URL} from '../../../include/merchant_redirect'

import AlertSuccess from '../../../include/alertsuccess'
import AlertError from '../../../include/alerterror'

import {UserContext} from '../../layout/userContext'
import axios from 'axios'
export default function Banners(props) {

    /* User Context */
   const usersContext = useContext(UserContext);
   let stafflog	 		         = 0;
   let edit_banner 		       = true;
   let delete_banner 		     = true;

   if(usersContext){
       stafflog	 				     = usersContext.stafflog;
       if(stafflog!=0){
         edit_banner  		   = usersContext.staff_permission.banner.edit;
         delete_banner  		 = usersContext.staff_permission.banner.delete;
       }
  }

	/* List with paginations
    ---------------------------------------------*/
    const [spinner,setspinner] = useState(false);
    const [search, setsearch]  = useState({
        order_id:'',
        affiliate_id:'',
        tracking_method:'',
        order_status:'',
        date_from:'',
        date_to:'',
        is_order:'is_pending',
    });

    const [list, setlist] = useState([]);
    const [pagenumber, setpagenumber] = useState(1);
    const [totaldata, settotaldata] = useState(0);
    const [entry, setentry] = useState(0);
    const [entrytype, setentrytype] = useState('');

    const [paginations, setpaginations] = useState({
        paginations:[{
        listnav:[],
        pageinfo:'',
        limit_page:'',
        total_page:'',
        total_records:'',
        current_page:'',
        startPage:'',
        endPage:'',
        ellipseLeft:'',
        ellipseRight:'',
        }]
    });

	function pagenumberfunction(page){
        TableList(page,search);
    }

    function TableList(page,searchstr){
        /*setspinner(true);
        let formData = new FormData();
        formData.append('type','merchant_listorders');
        formData.append('search',JSON.stringify(searchstr));
        formData.append('page',page);
        axios.post('/merchant/orders/request.php',formData)
        .then(function (response) {
            let obj = response.data;
            setentry(obj.entries.val);
            setentrytype(obj.entries.type);
            setlist(obj.listtable);
            setpaginations(obj.paginations);
            settotaldata(obj.paginations.paginations.total_records);
            setspinner(false);
        })
        .catch(function (error) {
            console.log(error);
        });*/
    }


    const [listofbann, setlistofbann] = useState([]);
    function Listbanner(){
        setspinner(true);
        let formData = new FormData();
        formData.append('type','merchant_listbanners');
        axios.post('/merchant/banners/request.php',formData)
        .then(function (response) {
            let obj = response.data;
            setlistofbann(obj);
        })
        .catch(function (error) {
            console.log(error);
        });
    }


	/* Setup modal Component */
    const [isoff, setisoff] = useState('off');
	const [successmsg, setsuccess] = useState(false);
    const [errormsg, seterror] = useState(false);

    const [add, setadd] = useState(false);

    const [update, setupdate] = useState(false);
    const [arraydata, setarraydata] = useState({});

    const [isettings, setisettings] = useState(false);
    const [iscategories, setiscategories] = useState(false);

    const [isdelete, setisdelete] = useState(false);



    const [id, setid] = useState(false);
	const [alertmessage, setalertmessage] = useState(null);
	function CloseAlert(data){
		setsuccess(data);
        seterror(data);
        Listbanner();
	}
	function ReloadList(data){
        if(data==true){
            //TableList(pagenumber,search);
            Listbanner();
        }
    }

    function reloadEntries(){
        TableList(pagenumber,search);
    }
	function CloseModal(data){
        setadd(data);
        setupdate(data);
        setisettings(data);
        setiscategories(data);
        setisdelete(data);
	}
	function showtheAlert(data){
        if(data==true){  setsuccess(true);}
        if(data==false){ seterror(true);}
	}
    function showtextMessage(data){
        setalertmessage(data);
    }

	function AddFunction(){
		setadd(true);
    }

    function UpdateFunction(id){
        setupdate(true);
        setid(id);
    }

    function settingsFunction(){
        setisettings(true);
    }
    function categoriesFunction(){
        setiscategories(true);
    }

    function updateBanner(id){
        setupdate(true);
        setid(id);
    }



    useEffect(()=>{
        Listbanner();
    },[]);


	return (
		<React.Fragment>
	        <div className="banners pagecontent">

                {successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert={alertmessage}/>}
				        {errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert={alertmessage}/>}

        				<div className="table-buttons">
        					<div className="columns is-mobile is-vcentered">
        						<div className="column"><h2 className="titlewrapper">Banners</h2></div>
        						<div className="column">
        							<div className="position-right">
                        <Button className='black' icon onClick={()=>settingsFunction()}><Icon name='cog' /> Settings</Button>
                        <Button className='black' icon onClick={()=>categoriesFunction()}><Icon name='plus' /> Add Categories</Button>
        								<Button className='black' icon onClick={()=>AddFunction()}><Icon name='plus' /> Add Banner</Button>
        								<Button className='black' icon onClick={()=>windowReload()}><Icon name='refresh' /> Refresh</Button>
        							</div>
        						</div>
        					</div>
        				</div>


                <div className="bannerslist-wrapper">

                    <Message
                        icon='images outline'
                        warning
                        header='What are banners?'
                        list={[
                            'A banner is an image you can upload for your affiliates to use when promoting your program. When it is clicked, it will lead to your site and the visit will be tracked the same way visits from affiliated links are tracked.'
                        ]}
                    />

                    <Message
                        warning
                        header='Creating Banner'
                        list={[
                            'Click the button "Add Categories" if you have not added categories. Categories are for permission if you want your banner to be visible for specific affiliate.',
                            'Click the button "Add Banner" and enter the banner information.'
                        ]}
                    />

                    <Message
                        warning
                        header='Information'
                        list={[
                            "If you don't see your banners, please check your browser for active adBlocker plugins.",
                            'Common banners sizes: https://en.wikipedia.org/wiki/Web_banner#Standard_sizes'
                        ]}
                    />

                    {listofbann.length==0&&<div className="nobanners">
                        <h1>No banner has been added</h1>
                        <Button className='green' icon onClick={()=>AddFunction()}><Icon name='plus' /> Add Banner</Button>
                    </div>}

                    {listofbann.map(function(data, key){
                        return<div className="banners-list">
                            <div className="columns">
                                <div className="column is-one-third"><div className="banner-image"><img src={data.image}/></div></div>
                                <div className="column">
                                    <div className="banner-description">
                                        <div className="columns is-mobile">
                                            <div className="column is-one-fifth"><h2>Name</h2></div>
                                            <div className="column">{data.name}</div>
                                        </div>
                                        <div className="columns is-mobile">
                                            <div className="column is-one-fifth"><h2>Dimension</h2></div>
                                            <div className="column">{data.dimension}</div>
                                        </div>
                                        <div className="columns is-mobile">
                                            <div className="column is-one-fifth"><h2>Category</h2></div>
                                            <div className="column">{data.bann_catname}</div>
                                        </div>
                                        <div className="columns is-mobile">
                                            <div className="column is-one-fifth"><h2>Set URL</h2></div>
                                            <div className="column">{data.url_banner}</div>
                                        </div>
                                        <div className="columns is-mobile">
                                            <div className="column is-one-fifth"><h2>Notes</h2></div>
                                            <div className="column">{data.note_banner}</div>
                                        </div>
                                        <div className="columns is-mobile">
                                            <div className="column is-one-fifth"><h2>Uploaded on</h2></div>
                                            <div className="column">{data.dateadded}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bannersbutton">
                                {delete_banner==true&&<Button className="red" icon labelPosition='left' onClick={()=>{
                                    setarraydata({
                                        id:data.id,
                                        file_name:data.name
                                    });
                                    setisdelete(true);
                                }}>Delete<Icon name='trash alternate' /></Button>}
                                {edit_banner==true&&<Button className="blue" icon labelPosition='left' onClick={()=>{
                                    setid(id);
                                    setupdate(true);
                                    setarraydata({
                                        id:data.id,
                                        is_show:data.is_show,
                                        bann_category:data.bann_category,
                                        url_banner:data.url_banner,
                                        banner_width:data.banner_width,
                                        banner_height:data.banner_height,
                                        note_banner:data.note_banner,
                                        file_name:data.name
                                    });
                                }}>Edit<Icon name='pencil' /></Button>}
                            </div>
                        </div>
                    })}

                </div>


                {add&&<AddBanner
                        reloadTrigger={ReloadList}
                        closeTrigger={CloseModal}
                        showAlertMessage={showtheAlert}
                        textalertMessage={showtextMessage}
                        edit={edit_banner}
                />}
                {update&&<UpdateBanner
                        reloadTrigger={ReloadList}
                        closeTrigger={CloseModal}
                        showAlertMessage={showtheAlert}
                        textalertMessage={showtextMessage}
                        idCallback={id}
                        arrayCallback={arraydata}
                        edit={edit_banner}
                />}

                {isettings&&<Settings
                        reloadTrigger={ReloadList}
                        closeTrigger={CloseModal}
                        showAlertMessage={showtheAlert}
                        textalertMessage={showtextMessage}
                        edit={edit_banner}
                />}
                {iscategories&&<Categories
                        reloadTrigger={ReloadList}
                        closeTrigger={CloseModal}
                        showAlertMessage={showtheAlert}
                        textalertMessage={showtextMessage}
                        edit={edit_banner}
                        delete={delete_banner}
                />}
                {isdelete&&<Delete
                    reloadTrigger={ReloadList}
                    closeTrigger={CloseModal}
                    showAlertMessage={showtheAlert}
                    textalertMessage={showtextMessage}
                    idCallback={arraydata}
                    delete={delete_banner}
                />}

            </div>
		</React.Fragment>
	)
}
