import { useState, useEffect, useContext } from 'react';
import  Link  from 'next/link'
import { convertXmltoJson, formatDate } from '../../helper/helper';
import APIService from '../../helper/APIService';
import { NavContext } from '../Context/NavContextProvider';
import Loader from '../Shared/Loader';

const HomepageOrderHistory = () => {
  const { state } = useContext(NavContext);
  const { sessionId, jobId } = state;
  const [orderLists, setOrderLists] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobInformation = async () => {
    setLoading(true);
    const res = await APIService.get(`/jobs/appSignature2?appid=reactapp&offset=0&numberOfJobs=3`);
    if (res.status === 201 || res.status === 200) {
      let xmlRes = await convertXmltoJson(res.data);
      let jobs = xmlRes?.job?.jobList?.job;
      setOrderLists(jobs)
    }
    setLoading(false);
  }
  console.log('sessionIdsessionId', sessionId)
  console.log('jobIdjobIdjobId', jobId)
  useEffect(() => {
    fetchJobInformation();
  }, [sessionId, jobId])

  return (
    <div className="card r-10  ms-sm-1 align-self-sm-end align-self-lg-auto h-350">
      {loading ? <Loader /> :
        <div className="card-body p-0">
          <div className="d-flex justify-content-between border_bottom py-3 px-4">
            <h4 className="fw-16 fw-bold mb-0">Order History</h4>
            <Link href="/orderhistory"><a className="text-decoration-none cw_blue fw-bold">View All</a></Link>
          </div>
          {orderLists.map((list, i) => {
            let status = list.jobStatus.text;
            if (i < 3) {
              return (<div className="border_bottom p-4" key={i}>
                <div className="d-flex justify-content-between">
                  <h4 className="fw-14 fw-bold mb-1 themeBlack">{list.id.text}</h4>
                  <h4 className={status === "EDITING" ? "text-warning fw-14 fw-bold mb-1" : status === "AWAITING_PRODUCTION" ? "themeRed fw-14 fw-bold mb-1" : "themeGreen fw-14 fw-bold mb-1"}>
                    {status === "AWAITING_PRODUCTION" ? "Awaiting Production" : status === "ORDER_PROCESSING" ? "In Production" : status === "EDITING" ? "Editing" : ""}
                  </h4>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="fw-14 textGray">{list.document.text}</p>
                  <p className="fw-14 textGray">{formatDate('MM/DD/YYYY', list.submittedDate.text)}</p>
                </div>
              </div>)
            }
          })}
        </div>
      }
    </div>
  )
}

export default HomepageOrderHistory