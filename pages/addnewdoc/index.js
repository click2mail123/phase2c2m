import { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import qs from 'qs';
import APIService from '../../helper/APIService';
import { NavContext } from '../../components/Context/NavContextProvider'
import FromDrive from '../../components/Docupload/FromDrive';
import FromDevice from '../../components/Docupload/FromDevice';
// import FromDevice from './FromDevice';
// import ChangeSize from '../ChangeSize/ChangeSize';
import Modal from '../../components/Modal/Modal';
import {useRouter} from 'next/router';


const UploadFile = () => {
  const router = useRouter();
  const [auth, setAuth] = useState();
  const [drive, setDrive] = useState();
  const [mode, setMode] = useState(null);
  const [size, setSize] = useState();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [file, setFile] = useState();


  const { state, setState } = useContext(NavContext);
  const { googleAuthObject, documentUpload, documentSize, sessionId } = state;
  

   // Upload the downloded pdf extracted from Google drive
   const uploadDocumentData = async(fileData) => {
    const url = '/documents';
    const headers = {
      'Content-Type': 'multipart/form-data',
      'X-Auth-UserId': '5da047eb6bd23d481e5ebbbc80a301c4'
    }
    const payload = {
      'documentFormat':'PDF',
      'documentClass':documentUpload,
      'documentName': 'shashank',
      'file' : fileData,
      // 'file' : test,
    }
    const body = qs.stringify(payload)
    console.log('8888888888888', body)
    const res = await APIService.post(url, body, headers);
    if (res.status === 200) {
      console.log('Document uploaded successfully');
    } else {
      console.log('Document upload failed');
    }
  }

const changeMode = () => {
  mode ? setMode(null) : setMode('Device')
 }

 const changeSize = () => {
  setMode("Letter 8.5 x 11")
 }

const handleModalClose = () => {
  setIsModalOpen(false);
  router.push('/');
}

const getDocument = () => {
  return(
    <div className="modal-body">
    <div className="d-flex justify-content-center align-content-center">
      <div className="btn-group">
        <button type="button" className= {mode ?'btn btn-outline-primary' : "btn btn-primary"} onClick={changeMode}>From Drive</button>
        <button type="button" className={mode ? "btn btn-primary" :'btn btn-outline-primary' }  onClick={changeMode}>From Device</button>
      </div>
    </div>
    {mode ? 
    <div className="container">
      <div className="d-flex justify-content-between align-items-center row border py-1 border-bottom-0">
        <div className="col-lg-12 col-12 ">
        <FromDevice />
        </div>
      </div>
    </div>
    :
    <div className="container">
      <div className="d-flex justify-content-between align-items-center row border py-1 border-bottom-0">
        <div className="col-lg-12 col-12 ">
          <FromDrive />
        </div>
      </div>
    </div>
    }
  </div>
  )
}

const handleSubmit = async () => {
  // if (jobId && jobId !== "") {
  //   await updateJob(jobId);
  // } else {
  //   await createJob();
  // }
  // handleModalClose();
  uploadDocumentData(documentUpload);
}


const getSize = () => {
  return(
   <div>
   <ChangeSize />
   <button
        className={
          `btn btn-primary ${!(documentSize && documentSize.length > 0) && 'disable_Btn'}`} onClick={handleSubmit}>Continue</button>
   </div>
  )
}

  console.log('fillllllllles', file);
  return (
    <Modal isOpen={isModalOpen} closeBtn={handleModalClose} >
      <>
        {documentUpload ? getSize() : getDocument()}
      </>        
  </Modal>
  // <h1> I am drive  getDriveFiles </h1>
    // <button onClick={() => getDriveFiles()}>Open Picker</button>

 
  )
}

export default UploadFile