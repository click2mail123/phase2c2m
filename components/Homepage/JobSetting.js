import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import APIService from '../../helper/APIService';
import { NavContext } from '../Context/NavContextProvider';
import Select from "react-select";
import { convertXmltoJson } from '../../helper/helper';
import axios from 'axios';
import dynamic from 'next/dynamic';
const Loader = dynamic(() => import('../Shared/Loader'));




const JobSettings = (props) => {
  const router = useRouter();
  const { state } = useContext(NavContext);
  const { selectedMailingList, costBreakdown, sessionId, jobId, documentSize, isMobile } = state;
  const defaultError = {
    docsizeerror: '', layouterror: '', printOptionerror: '', printColorerror: '', paperTypeerror: '', mailClasserror: '', envelopeerror: '', proTimeerror: ''
  }
  const [inputData, setInputData] = useState()
  const [error, seterror] = useState(defaultError);
  const [jobInfo, setJobInfo] = useState();
  const [productInfo, setProductInfo] = useState();
  const [currentCost, setCurrentCost] = useState(costBreakdown?.totalCost?.text);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const fetchJobInformation = async () => {
    setLoading(true);
    setLoadingMessage("Getting Job Options");
    const res = await APIService.get(`/jobs/info/${jobId}`, sessionId);
    if (res.status === 201 || res.status === 200) {
      let xmlRes = await convertXmltoJson(res.data);
      setJobInfo(xmlRes.job);
      await fetchProductOptionsNext()
    }
    setLoading(false);
  }

  const fetchProductOptions = async () => {
    console.log('documentSizedocumentSize', documentSize)
    const headers = {
      "X-Auth-Token": process.env.STAGING_API_KEY,
  }
    const res = await APIService.get(`/productOptions?documentClass=${documentSize}&skipBulkPrint=false`, headers);
    if (res.status === 201 || res.status === 200) {
      let xmlRes = await convertXmltoJson(res.data);
      console.log('xmlResxmlResxmlRes000000000000', xmlRes)
      setProductInfo(xmlRes.job);
      console.log('product infoooooooooooooo', productInfo)
    }
  }

  const fetchProductOptionsNext = async () => {
    let username = 'click2mail123'
    const headers = {
      "X-Auth-Token":'60330c3a7abfcbd23b57b5a9365a3f8c'
    }
    const res = await axios.get(`https://api-proxy.click2mail.com/molpro/system/productOptions/advanced?username=${username}&documentClass=${documentSize}&skipBulkPrint=true`, {headers});
    if (res.status === 201 || res.status === 200) {
      setProductInfo(res.data);
    }
  }

  useEffect(() => {
    fetchJobInformation();
  }, [sessionId])

  useEffect(() => {
    if (jobInfo) {
      setInputData({
        docsize: jobInfo?.documentClass?.text || '',
        layout: jobInfo?.layout?.text || '',
        proTime: jobInfo?.productionTime.text || '',
        envelope: jobInfo?.envelope.text || '',
        mailClass: jobInfo?.mailClass.text || '',
        paperType: jobInfo?.paperType.text || '',
        printColor: jobInfo?.color.text || '',
        printOption: jobInfo?.printOption.text || '',
      })
    }
  }, [jobInfo])

  //Fetch Cost breakdown when job is created
  const handleCostBreakdown = () => {
    if (selectedMailingList && selectedMailingList.length > 0) {
      if (router.pathname === "/") {
        router.push('/costbreakdown');
      } else {
        router.push('/');
      }
    }
  }

  const renderOptions = (data) => {
    if(data){
      return data.map((item) => ({
        label: item,
        value: item,
      }));
    }
  }
  const handleSaveSetting = async (e) => {
    e.preventDefault()
    const url = `/jobs/${jobId}/update`;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    const payload = {
      "documentClass": inputData.docsize,
      "layout": inputData.layout,
      "productionTime": inputData.proTime,
      "envelope": inputData.envelope,
      "color": inputData.printColor,
      "paperType": inputData.paperType,
      "printOption": inputData.printOption,
      "documentId": jobInfo?.jobDocumentId?.text,
      "addressId": jobInfo?.jobAddressId?.text,
      "mailClass": inputData.mailClass,
    }
    const res = await APIService.post(url, payload, headers, sessionId);
    if (res.status === 201 || res.status === 200) {
      props.handleViewDoc(true)
    }
  }
  return (
    <>
      <div className="d-flex justify-content-between flex-grow-1 flex-column  align-self-baseline w-tbl-100 postRelative col-md-8">
        <div id="accordion" className="clearfix pt-3 ">
          <div className="card bg-transparent border-0 mb-3">
            <div className="card-header bg-transparent d-flex justify-content-between arrowryt collapsed border-0 p-1" data-bs-toggle="collapse" data-bs-target="#collapseOne">
              <h4 className="fw-bold themeBlack fw-20 ">MyDocument.pdf</h4>
            </div>
            <div id="collapseOne" className="collapse show" data-bs-parent="#accordion">
              <div className="card-body docDetail py-lg-4">
              {loading ?
                <div className={!isMobile && "centered-loader"}>
                  <Loader />
                  <div className="text-center fw-20 mt-1">{loadingMessage}</div>
                </div> 
                :
                <form >
                  <div className="d-flex justify-content-between row">
                    <div className="col-lg-10 col-9 col-md-10">
                      <div className="row">
                        <div className="col-lg-6 col-md-6  ps-lg-4">
                          <div className="mb-2">
                            <label htmlFor="docsize" className="themeBlack fw-roboto fw-12">Document Size</label>
                            <Select
                              id="docsize"
                              name="docsize"
                              label="docsize"
                              options={renderOptions([jobInfo?.documentClass?.text])}
                              value={inputData && inputData.docsize ? {label: inputData.docsize, value: inputData} : null}
                              className="select-return"
                              onChange={(value) => {
                                setInputData({ ...inputData, docsize: value.value });
                              }}
                            />
                            {error?.docsizeerror ? <p className="text-danger">{error?.docsizeerror}</p> : null}
                          </div>
                          <div className="mb-2">
                            <label htmlFor="layout" className="themeBlack fw-roboto fw-12">Layout</label>
                            <Select
                              id="layout"
                              name="layout"
                              label="layout"
                              // options={renderOptions([jobInfo?.layout?.text, "Address on First Page", "Picture and Address First Page", "Address Back Page", "Address on Separate Page w/ECQ"])}
                              options={renderOptions(productInfo?.layouts)}
                              value={inputData && inputData.layout ? {label: inputData.layout, value: inputData} : null}
                              className="select-return"
                              onChange={(value) => {
                                //on every change we need to call the job details api to get the product option
                                setInputData({ ...inputData, layout: value.value });
                              }}
                            />
                            {error?.layouterror ? <p className="text-danger">{error?.layouterror}</p> : null}
                          </div>
                          <div className="mb-2">
                            <label htmlFor="proTime" className="themeBlack fw-roboto fw-12">Production Time</label>
                            <Select
                              id="proTime"
                              name="proTime"
                              label="proTime"
                              // options={renderOptions([jobInfo?.productionTime.text])}
                              options={renderOptions(productInfo?.productionTimes)}
                              value={renderOptions([jobInfo?.productionTime?.text]).find(item => {
                                return item.value == jobInfo?.productionTime?.text;
                              })}
                              className="select-return"
                              onChange={(value) => {
                                setInputData({ ...inputData, proTime: value });
                              }}
                            />
                            {error?.proTimeerror ? <p className="text-danger">{error?.proTimeerror}</p> : null}
                          </div>
                          <div className="mb-2">
                            <label htmlFor="envelope" className="themeBlack fw-roboto fw-12">Envelope</label>
                            <Select
                              id="envelope"
                              name="envelope"
                              label="envelope"
                              // options={renderOptions([jobInfo?.envelope?.text, "#10 Double Window", "6 x 9.5 Double Window", "Flat Envelope"])}
                              options={renderOptions(productInfo?.envelopes)}
                              value={inputData && inputData.envelope ? {label: inputData.envelope, value: inputData} : null}
                              className="select-return"
                              onChange={(value) => {
                                setInputData({ ...inputData, envelope: value.value });
                              }}
                            />
                            {error?.envelopeerror ? <p className="text-danger">{error?.envelopeerror}</p> : null}
                          </div>
                        </div>
                        <div className="col-lg-6  col-md-6  ps-lg-4">
                          <div className="mb-2">

                            <label htmlFor="mailClass" className="themeBlack fw-roboto fw-12">Mail class</label>
                            <Select
                              id="mailClass"
                              name="mailClass"
                              label="mailClass"
                              // options={renderOptions([jobInfo?.mailClass?.text, "Standard", "First Class Live Stamp", "First Class Speciality Stamp", "First Class No Move Update"])}
                              options={renderOptions(productInfo?.mailClasses)}
                              value={inputData && inputData.mailClass ? {label: inputData.mailClass, value: inputData} : null}
                              className="select-return"
                              onChange={(value) => {
                                setInputData({ ...inputData, mailClass: value.value });
                              }}
                            />
                            {error?.mailClasserror ? <p className="text-danger">{error?.mailClasserror}</p> : null}
                          </div>
                          <div className="mb-2">
                            <label htmlFor="paperType" className="themeBlack fw-roboto fw-12">Paper Type</label>
                            <Select
                              id="paperType"
                              name="paperType"
                              label="paperType"
                              // options={renderOptions([jobInfo?.paperType?.text, "White 28#"])}
                              options={renderOptions(productInfo?.paperTypes)}
                              value={inputData && inputData.paperType ? {label: inputData.paperType, value: inputData} : null}
                              className="select-return"
                              onChange={(value) => {
                                setInputData({ ...inputData, paperType: value.value });
                              }}
                            />
                            {error?.paperTypeerror ? <p className="text-danger">{error?.paperTypeerror}</p> : null}
                          </div>
                          <div className="mb-2">
                            <label htmlFor="printColor" className="themeBlack fw-roboto fw-12">Print Color</label>
                            <Select
                              id="printColor"
                              name="printColor"
                              label="printColor"
                              // options={renderOptions([jobInfo?.color?.text, "Black and White"])}
                              options={renderOptions(productInfo?.printColors)}
                              value={inputData && inputData.printColor ? {label: inputData.printColor, value: inputData} : null}
                              className="select-return"
                              onChange={(value) => {
                                setInputData({ ...inputData, printColor: value.value });
                              }}
                            />
                            {error?.printColorerror ? <p className="text-danger">{error?.printColorerror}</p> : null}
                          </div>
                          <div className="mb-3">
                            <label htmlFor="printOption" className="themeBlack fw-roboto fw-12">Print Option</label>
                            <Select
                              id="printOption"
                              name="printOption"
                              label="printOption"
                              options={renderOptions(productInfo?.printOptions)}
                              // options={renderOptions([jobInfo?.printOption?.text, "Printing Both Sides"])}
                              value={inputData && inputData.printOption ? {label: inputData.printOption, value: inputData} : null}
                              className="select-return"
                              onChange={(value) => {
                                setInputData({ ...inputData, printOption: value.value });
                              }}
                            />
                            {error?.printOptionerror ? <p className="text-danger">{error?.printOptionerror}</p> : null}
                          </div>
                          <div className="mb-1 d-flex justify-content-between justify-content-lg-start justify-content-md-start">
                            <button className="btn btn-outline-primary me-2" onClick={() => props.handleViewDoc(true)}>Cancel</button>
                            <button className="btn btnTheme" onClick={(e) => handleSaveSetting(e)}>Save Settings</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-3 col-md-2 pe-0 ps-0 pe-md-3 ps-md-3" onClick={handleCostBreakdown}>
                      <div className="position-relative text-center">
                        <img src="/images/Stamp.png" alt="" />
                        <h4 className="fw-16 fw-bold mb-0 price_pos">
                          {selectedMailingList && selectedMailingList.length > 0 && currentCost > 0 && `$${currentCost}`}
                        </h4>
                      </div>
                    </div>
                  </div>
                </form>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </> 
  )
}
export default JobSettings