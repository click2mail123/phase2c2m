import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import { convertXmltoJson, formatDate } from '../../helper/helper';
import APIService from '../../helper/APIService';
import { NavContext } from '../../components/Context/NavContextProvider';
import Table from '../../components/Table/Table';
import Loader from '../../components/Shared/Loader';
import Modal from '../../components/Modal/Modal';
import CostBreakdownTable from '../../components/Shared/CostBreakdownTable';

const JobHistory = () => {
  const router = useRouter();
  const { state, setState } = useContext(NavContext);
  const { sessionId, selectedMailingList, costBreakdown, proofStatus, jobId  } = state;
  const [orderLists, setOrderLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobCost, setJobCost] = useState({});
  const [showCostModal, setShowCostModal] = useState(false)

  const fetchJobInformation = async () => {
    setLoading(true);
    const res = await APIService.get(`/jobs/appSignature2?appid=reactapp&offset=0&numberOfJobs=100`);
    if (res.status === 201 || res.status === 200) {
      let xmlRes = await convertXmltoJson(res.data);
      let jobs = xmlRes?.job?.jobList?.job;
      setOrderLists(jobs)
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchJobInformation();
  }, [sessionId])


  const renderRows = () => {
    const rows = orderLists.map(list => {
      return {
        id: list.id.text,
        document: list.document.text,
        noOfPieces: list.noOfPieces.text,
        submittedDate: formatDate('MM/DD/YYYY', list.submittedDate.text),
        jobStatus: list.jobStatus.text,
      }
    });
    return rows;
  }


  const renderStatus = (row) => {
    let status = row.jobStatus || '';
    return (
      <b className={status === "EDITING" ? "text-warning" : status === "AWAITING_PRODUCTION" ? "themeRed" : "themeGreen"}>{status === "AWAITING_PRODUCTION" ? "AWAITING PRODUCTION" : status === "ORDER_PROCESSING" ? "IN PRODUCTION" : status}</b>
    )
  }
  
  const columns = [
    { field: 'id', headerName: 'Job Id', flex: 0.5 },
    { field: 'document', headerName: 'Documents', flex: 1 },
    { field: 'noOfPieces', headerName: 'No. of pieces', flex: 0.5 },
    { field: 'submittedDate', headerName: 'Sent On', flex: 0.5 },
    {
      field: 'status', headerName: 'Status', flex: 1, renderCell: (cell) => {
        return renderStatus(cell.row);
      }
    },
    {
      field: 'action', headerName: 'Action', flex: 0.5, renderCell: (cell) => {
        return renderActions(cell.row);
      }
    }
  ];

  const renderMobileListItem = (row) => {
    return <div>
      <p className="mb-0 h5">{row.document}</p>
      <p>Job Id {row.id} | {row.noOfPieces} pieces</p>
      <p>Sent on {row.submittedDate}</p>
      <p>{renderStatus(row)}</p>
    </div>
  }


  const getJobInfoAndSetData = async (id) => {
    let jobId = id;
    const res = await APIService.get(`/jobs/info/${jobId}`);
    if (res.status === 200 || res.status === 201) {
      const jobdetails = convertXmltoJson(res.data);
      console.log('jobdetailsjobdetails000000000', jobdetails)
      setState({ ...state, 
        selectedMailingList: [jobdetails.job.jobAddressId.text],
        jobId: jobdetails.job.id.text,
        documentName: jobdetails.job.document.text,
        documentId: jobdetails.job.jobDocumentId.text,
        layout: jobdetails.job.layout.text,
        mailClass: jobdetails.job.mailClass.text,
        noOfPieces: jobdetails.job.noOfPieces.text,
        paperType: jobdetails.job.paperType.text,
        printOption: jobdetails.job.printOption.text,
        jobAddressId: jobdetails.job.jobAddressId.text,
        documentName: jobdetails.job.document.text,
        documentSize: jobdetails.job.documentClass.text,
        envelope: jobdetails.job.envelope.text,
        cost: jobdetails.job.cost.text,
        clonning: true
      });
      router.push('/', undefined, {scroll: false});
    } 
  }


  const handleEdit = async (id) => {
    getJobInfoAndSetData(id)
  }

  const handleDeleteJob = async (jobId) => {
    setLoading(true);
    const url = `/jobs/${jobId}/delete`;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    let payload = {};
    const res = await APIService.post(url, payload, headers, sessionId);
    if (res.status === 201 || res.status === 200) {
      let jobs = orderLists.filter((job) => { return job.id.text != jobId });
      setOrderLists(jobs)
    }
    setLoading(false);
  }

  const handleClone = async (id) => {
    //First Duplicate the job
    const res = await APIService.post(`/jobs/${id}/duplicate`, {}, {});
    const dupJob = convertXmltoJson(res.data)
    console.log('Info', dupJob)
    console.log('Info', dupJob?.job?.id?.text)
    // Then call the job detail api and set the data
    getJobInfoAndSetData(dupJob?.job?.id?.text)
  }

  const handlePrice = async (id) => {
    //TODO for mobile
    const res = await APIService.get(`/jobs/${id}/cost?details=true`);
    if (res.status === 200 || res.status === 201) {
      const { job } = convertXmltoJson(res.data);
      if (job) {
        let costBreakdown = {
          totalCost: job.cost ? job.cost : 0,
          internationalCost: job.internationalCost ? job.internationalCost : null,
          nonStandardCost: job.nonStandardCost ? job.nonStandardCost : null,
          standardCost: job.standardCost ? job.standardCost : null,
          productionCost: job.productionCost ? job.productionCost : null,
          totalTax: job.totalTax ? job.totalTax : null,
        }
        setJobCost({ ...costBreakdown });
        setShowCostModal(true);
      }
    }
  }

  const renderActions = (row) => {
    return (
      <div className="align-content-center d-flex justify-content-between table-actions">
        {row.jobStatus === "EDITING" ? <><span onClick={() => handleEdit(row.id)} title="Edit">
          <img src="/images/next.svg" alt="" className="me-3" /></span>
          <span onClick={() => handleDeleteJob(row.id)} title="Delete">
            <img src="/images/delete.svg" alt="" className="me-3" /></span>
        </> :
          <>
            <span onClick={() => handleClone(row.id)} title='Clone'>
              <img src="/images/refresh.svg" alt="" className="me-3" /></span>
            <span onClick={() => handlePrice(row.id)} title='View Cost'>
              <img src="/images/price.svg" alt="" className="me-3" /></span>
          </>
        }
      </div>
    )
  }

  const handleJobClick = () => {
    router.push('/addnewdoc', undefined, { scroll: false });
  }

  const renderJobCostBreakdown = () => {
    return <Modal
      isOpen={showCostModal}
      closeBtn={() => {
        setShowCostModal(false);
        setJobCost(null);
      }}
      sizeClass={`popover costboxsize`}
    >
      <h2 className="text-center py-4">Cost Breakdown</h2>
      <CostBreakdownTable costBreakdown={jobCost} />
    </Modal>
  }

  return (
    <main className="bannerBg homepage " >
      {showCostModal && renderJobCostBreakdown()}
      <div className="container-xxl d-flex flex-column h-100 justify-content-between position-relative">
        <div className="row  mb-lg-0 mb-md-0 my-3 mx-md-1">
          <div className="col-lg-12 col-md-12 col-sm-12 p-lg-0 m-1">
            <div className="card r-10 orderHistory">
              <div className="card-body bg-white py-3 px-0">
                <div className="d-flex justify-content-end pb-lg-3 px-lg-4 px-md-2 pb-md-2 ">
                  <div className="col-md-6 col-12 col-sm-6 title pb-1 px-4">
                    <h4 className="text-start mb-0 fw-28 fw-bold">Job History</h4>
                  </div>
                  <div className="col-md-6 col-12 col-sm-6  text-end d-flex justify-content-end flex-column flex-sm-row flex-lg-row p-2 ms-sm-2">
                    <a className="btn btn-outline-primary me-2 col-lg-4 col-sm-5 col-12 mb-2" onClick={() => router.push("/")}>Back To Home</a>
                    <a onClick={handleJobClick} className="btn btn-primary  col-lg-4 col-sm-7 col-12" data-bs-toggle="modal" ><img src="/images/wadd.svg" alt="" className="me-2" /> Start a New Job </a>
                  </div>
                </div>
                <div className="p-0 ">
                  {loading ? <Loader /> :
                    <Table
                      rows={renderRows()}
                      columns={columns}
                      renderActions={renderActions}
                      renderMobileListItem={renderMobileListItem}
                    />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
export default JobHistory