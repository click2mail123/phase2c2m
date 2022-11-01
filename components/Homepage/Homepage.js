import { useState, useEffect, useContext } from 'react'
import qs from 'qs';
import axios from 'axios';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import { NavContext } from '../Context/NavContextProvider';
import { convertXmltoJson, getCookies, removeCookies, setCookies, base64toBlob } from '../../helper/helper'
import APIService from '../../helper/APIService'
import HomepageOrderHistory from './HomepageOrderHistory'
const CurrentFund = dynamic(() => import('../Fund/CurrentFund'))
const Loader = dynamic(() => import('../Shared/Loader'))
const ErrorMessage = dynamic(() => import('../Shared/ErrorMessage'))
const HomepageDocument = dynamic(() => import('./HomepageDocument'))
const JobSettings = dynamic(() => import('./JobSetting'))

const Homepage = (props) => {
  const router = useRouter();
  const { state, setState } = useContext(NavContext);
  const { sessionId, googleAuthObject, isMobile, jobId } = state;
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [viewDoc, setViewDoc] = useState(true);
  let accessToken = googleAuthObject && googleAuthObject.accessToken;


  useEffect(() => {
    if(sessionId == null) {
      let params = router.query.state;
      if(params){ 
        // setFromGoogle(true)
        router.push('/googlelogin', undefined, {scroll: false});
      } else {
        router.push('/login', undefined, {scroll: false});
      }
    } 
  }, [sessionId])
  

  useEffect(() => {
    if(accessToken){
      extractDocParams()
    }
  }, [sessionId])


  //Extract all the parameters passed by google in the URl params
  const extractDocParams = async () => {
    setLoading(true);
    // let Url = window.location;
    let Url = new URL('https://script.google.com/macros/s/AKfycbzwVdcwLoQ-oHeWSgXP-7gqVjA62FZF9RbhKGsbjLHegskSf9FU/exec?state=%7B%22ids%22:%5B%2213Zfj_n9lSupvgXolIPMD_AYPwAnMTrcj%22%5D,%22action%22:%22open%22,%22userId%22:%22100867906112081097060%22,%22resourceKeys%22:%7B%7D%7D');
    let decoded = decodeURIComponent(Url);

    let hasQuery = window.location.toString().includes('?');
    if (hasQuery) {
      let params = decoded.substring(decoded.indexOf('?') + 7);
      let stateParams = JSON.parse(params)

      let ids = stateParams.ids;

      let token = googleAuthObject.accessToken;

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      let fileId = ids[0];
      let documentData = await axios.get(`https://www.googleapis.com/drive/v3/files/${fileId}`, { headers })
      let { name: fileName } = documentData.data;
      setFileName(fileName);
      let response = await axios.get(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, { headers })
      // call the document upload api
      if (response.status === 200) {
        let fileData = response.data;
        await uploadDocumentData(fileData, fileName);
      }
    }
    setLoading(false);
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
    formdata.append("file", base64toBlob(fileData), fileName);
    formdata.append("documentName", documentName);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    const res = await APIService.post(url, formdata, myHeaders, requestOptions);
    if (res.status === 200 || res.status === 201) {
      console.log('Document uploaded successfully');
      const { document } = convertXmltoJson(res.data);
      setState({ ...state, documentId: document.id.text });
    } 
    // else {

    //   const {document} = convertXmltoJson(res.data);
    //   setState({...state, documentId: document.id.text, documentName: documentName});
    // }
    //  else if(res.data.status === 400){ 
    //   setError(true);
    //   setErrorMessage({ heading: "File size is too big, Max number of supported pages are 47" })
    //   console.log('Document upload File size is too big, Max number of supported pages are 47');
    // }
    else {

      setError(true);
      setErrorMessage({ heading: "Error occured while uploading document" })
      console.log('Document upload failed');
    }
    setLoading(false);
  }

  const handleJobClick = () => {
      router.push('/addnewdoc', undefined, {scroll: false});
    } 

  return (
    <div>
      {router.pathname !== '/orderhistory' &&
        <main className="bannerBg homepage">
          {error ? <ErrorMessage message={errorMessage} handleErrorClose={() => setError(false)} className="homepage-error" /> :
            loading ?
              <div className={!isMobile && "centered-loader"}>
                <Loader />
                <div className="text-center fw-20 mt-1">{loadingMessage}</div>
              </div> :
              <div className="container-xxl  d-flex flex-column h-100 justify-content-between position-relative">
                <CurrentFund showAddFund />
                <div className="d-flex justify-content-between flex-column flex-lg-row row">
                  <div className="d-flex mt-3 flex-lg-column align-self-baseline w-tbl-G100 col-md-4" >
                    {/* Banner Start */}
                    <div className="card r-10  mb-lg-3 mb-3 mb-md-0  me-sm-1 h-350" >
                      <div className="card-body d-flex flex-column h-100 justify-content-center" >
                        <div className="text-center"><img src="/images/shortBanner.svg" alt="" className="shortbanner" /></div>
                        <div className="d-flex flex-column  align-items-center">
                          <h2 className="fw-bold text-center fw-26 my-4">Welcome!</h2>
                          <button className="btn btn-primary  w-100" onClick={handleJobClick} ><img src="/images/wadd.svg" alt="" className="me-2" /> Start a New Job </button>
                        </div>
                      </div>
                    </div>
                    {/* Banner End */}
                    <HomepageOrderHistory />
                  </div>
                  {viewDoc ?
                    <HomepageDocument
                      fileName={fileName}
                      handleViewDoc={(val) => setViewDoc(val)}
                    />
                    : jobId ?
                      <JobSettings
                        handleViewDoc={(val) => setViewDoc(val)}
                      /> : <div className="col-lg-8 col-md-12 col-12  text-md-center align-self-lg-center  my-md-4">
                        <img src="/images/banner.svg" alt="" className="img-fluid" />
                      </div>
                  }
                </div>
              </div>}
        </main>}
    </div>
  )
}


export default Homepage;