import { useState, useEffect, useContext } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import useDrivePicker from 'react-google-drive-picker';
import axios from 'axios';
import qs from 'qs';
import APIService from '../../helper/APIService';
import { NavContext } from '../Context/NavContextProvider';
// import Table from '../Table/Table';
// import { DataGrid } from '@mui/x-data-grid';
import TableDrive from '../Table/TableDrive';
import dynamic from 'next/dynamic';
const Loader = dynamic(() => import('../Shared/Loader'))
const ErrorMessage = dynamic(() => import('../Shared/ErrorMessage'))
import { convertXmltoJson } from '../../helper/helper'
import {useRouter} from 'next/router';




const FromDrive = () => {
//   const navigate = useNavigate(); 
  const router = useRouter();
  const { state, setState } = useContext(NavContext);
  const { googleAuthObject, sessionId } = state;

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [file, setFile] = useState();
  const [files, setFiles] = useState();
  const [filename, setFileName] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);


//   let accessToken = googleAuthObject.accessToken;
  

  useEffect(() => {
    getDriveFiles()
  }, [googleAuthObject])
  

  const b64toBlob = (binary) => {
    //     let l = binary.length
    //       let array = new Uint8Array(l);
    //       for (var i = 0; i<l; i++){
    //         array[i] = binary.charCodeAt(i);
    //       }
          let blob = new Blob([binary], {type: 'application/octet-stream'});
          return blob
      }

  // Upload the downloded pdf extracted from Google drive
  const uploadDocumentData = async (fileData, fileName) => {
    setLoading(true);
    setLoadingMessage("Uploading document");
    const documentName = fileName.split(".")[0];
    const url = '/documents';
    var formdata = new FormData();
    
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");

    
    formdata.append("documentFormat", "PDF");
    formdata.append("documentClass", "Letter 8.5 x 11");
    formdata.append("file",  b64toBlob(fileData), fileName);
    formdata.append("documentName", documentName);
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    const res = await APIService.post( url, formdata, myHeaders, requestOptions);
    if (res.status === 200 || res.status === 201) {
      console.log('Document uploaded successfully');
      const {document} = convertXmltoJson(res.data);
      setState({...state, documentId: document.id.text, documentName: documentName});
      selectSize()
    }
     else if(res.data.status === 400){ 
      setError(true);
      setErrorMessage({ heading: "File size is too big, Max number of supported pages are 47" })
      console.log('Document upload File size is too big, Max number of supported pages are 47');
    }
    else {
      setError(true);
      setErrorMessage({ heading: "Please wait 5 minutes and try again. One of our APIs has not responded in time." })
      console.log('Document upload failed');
    }
    setLoading(false);
  }





 // Get the file data and meta data in this function
 const downloadDocAsBlob = async (file) => {
  console.log('downloadDocAsBlobdownloadDocAsBlob', file)
  let token = googleAuthObject.accessToken
  const headers = {
    'Authorization': `Bearer ${token}`
  };

  let fileId = file[0];
  let documentData = await axios.get(`https://www.googleapis.com/drive/v3/files/${fileId}`, { headers })
  let { name: fileName } = documentData.data;
  setFileName(fileName);
  let response = await axios.get(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, { headers, 'responseType' : 'blob' })
  // call the document upload api
  if (response.status === 200) {
      let fileData = response.data;
      await uploadDocumentData(fileData, fileName);
    }
  else {
    setError(true);
    setErrorMessage({ heading: "Error in getting file from drive" })
    console.log('Something went wrong to get the file from google drive');
    }
 }

  // Get all the files from the Drive
  //this will get all the pdf files from the drive 
  const getDriveFiles = async () => {
    let token = googleAuthObject.accessToken;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json' 
    }
    let api = 'AIzaSyCqoJQI7ekQeQQe_IpjZiu2z7r6sUfAASo'; // define in the env
    let url = `https://www.googleapis.com/drive/v3/files?q=mimeType%3D%27application%2Fpdf%27&fields=*&key=${api}`
    // let url = https://www.googleapis.com/drive/v3/files?includeItemsFromAllDrives=true&fields=*&supportsAllDrives=true&key=${api}`
    // let url = `https://www.googleapis.com/drive/v3/files?includeItemsFromAllDrives=true&fields=*&supportsAllDrives=true&key=${api}`
    let response = await axios.get(url, {headers})
    if(response.status == 200){
      //call the api for downloading a particular file from the drive
      // store this data into state 
      setFiles(response.data)
    } else {
      console.log('error in getting file from the drive') // show the error here
    }
  } 
      // Show all the files got from Drive in this pop up
    // <button onClick={() => getDriveFiles()}>Get all the files</button>

  console.log('files00000000000000000000', files)

  const renderRows = () => {
    const rows = files.files.map(list => {
      return {
        id: list.id,
        name: list.name,
        modifiedTime: list.modifiedTime,
      }
    });
    return rows;
  }

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'modifiedTime', headerName: 'Last Modified', flex: 0.5 }
  ];
  const rowSelectionHandler = (rows) => {
    let currentRows = [...selectedRows];
    let newRows = rows.filter(x => !currentRows.includes(x))
    setSelectedRows(newRows);
    // call the google api for downloading file metadata
    // downloadDocAsBlob(rows)
  }


  const selectSize = () => {
    setIsModalOpen(false);
    // router.push('/', undefined, {scroll: false});
    router.push('/changesize', undefined, {scroll: false});
  }

  const handleSubmit = async () => {
    // if (jobId && jobId !== "") {
    //   await updateJob(jobId);
    // } else {
    //   await createJob();
    // }
    setUploading(true)
    downloadDocAsBlob(selectedRows)
    // setState({...state,  documentUpload:file})
  }
    
  return (
    <div className="col-lg-12" style={{height:'65vh', width:'100%'}}> 
      {/* <h1> Files got from drive</h1> */}
      {/* <button onClick={() => getDriveFiles()}>Get all the files</button> */}
      
      <div className="col-lg-12" style={{height:'50vh', width:'100%'}}>
      {uploading ?
        <h4> uploading file.............</h4>
        :
        <div>
        {files ?  
          <TableDrive
          rows={renderRows()}
          columns={columns}
          rowSelectionHandler={rowSelectionHandler}
          hideSelectAll
          /> 
        : 
          <h4> fetching drive... </h4>
        }
      </div>
      }

      <div className="col-md-12 d-flex justify-content-end pe-0 mt-2 text-end">
      {/* <button className="btn btn-outline-primary me-2" onClick={handleModalClose}>Cancel</button> */}
      <button
        className={
          `btn btn-primary ${!(selectedRows && selectedRows.length > 0) && 'disable_Btn'}`} onClick={handleSubmit}>Continue</button>
    </div>
    </div>
    </div>

      
  )
}

export default FromDrive