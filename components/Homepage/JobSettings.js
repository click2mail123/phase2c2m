import { useState, useContext, useEffect } from 'react';
import {useRouter} from 'next/router';
import APIService from '../../helper/APIService';
import { NavContext } from '../Context/NavContextProvider';
import Select from "react-select";
import { convertXmltoJson } from '../../helper/helper';


const JobSettings = (props) => {
  const router = useRouter();
  const { state } = useContext(NavContext);
  const { selectedMailingList, costBreakdown, sessionId, jobId } = state;
  const defaultError = {
    docsizeerror: '', layouterror: '', printOptionerror: '', printColorerror: '', paperTypeerror: '', mailClasserror: '', envelopeerror: '', proTimeerror: ''
  }
  const [inputData, setInputData] = useState()
  const [error, seterror] = useState(defaultError);
  const [jobInfo, setJobInfo] = useState();
  const [currentCost, setCurrentCost] = useState(costBreakdown?.totalCost?.text);


  const fetchJobInformation = async () => {
    const res = await APIService.get(`/jobs/info/${jobId}`, sessionId);
    if (res.status === 201 || res.status === 200) {
      let xmlRes = await convertXmltoJson(res.data);
      setJobInfo(xmlRes.job);
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
    return data.map((item) => ({
      label: item,
      value: item,
      ...data
    }));
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
    <div className="d-flex justify-content-between flex-grow-1 flex-column  align-self-baseline w-tbl-100 postRelative col-md-8">
      <div id="accordion" className="clearfix pt-3 ">
        <div className="card bg-transparent border-0 mb-3">
          <div className="card-header bg-transparent d-flex justify-content-between arrowryt collapsed border-0 p-1" data-bs-toggle="collapse" data-bs-target="#collapseOne">
            <h4 className="fw-bold themeBlack fw-20 ">MyDocument.pdf</h4>
          </div>
          <div id="collapseOne" className="collapse show" data-bs-parent="#accordion">
            <div className="card-body docDetail py-lg-4">
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
                            value={renderOptions([jobInfo?.documentClass?.text]).find(item => {
                              return item.value == jobInfo?.documentClass?.text;
                            })}
                            className="select-return"
                            onChange={(value) => {
                              setInputData({ ...inputData, docsize: value });
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
                            options={renderOptions([jobInfo?.layout?.text])}
                            value={renderOptions([jobInfo?.layout?.text]).find(item => {
                              return item.value == jobInfo?.layout?.text;
                            })}
                            className="select-return"
                            onChange={(value) => {
                              setInputData({ ...inputData, layout: value });
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
                            options={renderOptions([jobInfo?.productionTime.text])}
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
                            options={renderOptions([jobInfo?.envelope?.text])}
                            value={renderOptions([jobInfo?.envelope?.text]).find(item => {
                              return item.value == jobInfo?.envelope?.text;
                            })}
                            className="select-return"
                            onChange={(value) => {
                              setInputData({ ...inputData, envelope: value });
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
                            options={renderOptions([jobInfo?.mailClass?.text])}
                            value={renderOptions([jobInfo?.mailClass?.text]).find(item => {
                              return item.value == jobInfo?.mailClass?.text;
                            })}
                            className="select-return"
                            onChange={(value) => {
                              setInputData({ ...inputData, mailClass: value });
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
                            options={renderOptions([jobInfo?.paperType?.text])}
                            value={renderOptions([jobInfo?.paperType?.text]).find(item => {
                              return item.value == jobInfo?.paperType?.text;
                            })}
                            className="select-return"
                            onChange={(value) => {
                              setInputData({ ...inputData, paperType: value });
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
                            options={renderOptions([jobInfo?.color?.text])}
                            value={renderOptions([jobInfo?.color?.text]).find(item => {
                              return item.value == jobInfo?.color?.text;
                            })}
                            className="select-return"
                            onChange={(value) => {
                              setInputData({ ...inputData, printColor: value });
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
                            options={renderOptions([jobInfo?.printOption?.text])}
                            value={renderOptions([jobInfo?.printOption?.text]).find(item => {
                              return item.value == jobInfo?.printOption?.text;
                            })}
                            className="select-return"
                            onChange={(value) => {
                              setInputData({ ...inputData, printOption: value });
                            }}
                          />
                          {error?.printOptionerror ? <p className="text-danger">{error?.printOptionerror}</p> : null}
                        </div>
                        <div className="mb-1 d-flex justify-content-between justify-content-lg-start justify-content-md-start">
                          <button className="btn btn-outline-primary me-2" onClick={()=>props.Sethide(!props.hide)}>Cancel</button>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default JobSettings