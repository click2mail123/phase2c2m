import { useState, useEffect, useContext } from 'react';
import qs from 'qs'
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { convertXmltoJson, formatDate } from '../../helper/helper';
import APIService from '../../helper/APIService';
import { NavContext } from '../../components/Context/NavContextProvider';
import Table from '../../components/Table/Table'
import Loader from '../../components/Shared/Loader'
const Modal = dynamic(() => import('../../components/Modal/Modal'))
const ErrorMessage = dynamic(() => import('../../components/Shared/ErrorMessage'))



const MailingLists = () => {
  const router = useRouter();
  const { state, setState } = useContext(NavContext);
  const { jobId, documentId } = state;
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [mailingLists, setMailingLists] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  //Fetch All mailing lists
  const getMailingLists = async () => {
    setLoading(true);
    const res = await APIService.get('/addressLists');
    if (res.status === 200) {
      let { addressLists: addressListsRes } = convertXmltoJson(res.data);
      setMailingLists([...addressListsRes.lists.list]);
    } else {
      setError(true);
      setErrorMessage({ heading: "Please wait 5 minutes and try again. One of our APIs has not responded in time." })
    }
    setLoading(false);
  }

  useEffect(() => {
    getMailingLists();
  }, [])


  //Create New Job using selected mailing list
  const createJob = async () => {
    let addressListId = selectedRows[0];
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    const payload = {
      "documentClass": "Letter 8.5 x 11",
      "layout": "Address on Separate Page",
      "productionTime": "Next Day",
      "envelope": "Best Fit",
      "color": "Full Color",
      "paperType": "White 24#",
      "printOption": "Printing One side",
      "documentId": documentId,
      "addressId": addressListId,
      "mailClass": "First Class",
      "appSignature": "reactapp"
    }
    const body = qs.stringify(payload);
    setLoading(true);
    const res = await APIService.post('/jobs', body, headers);
    if (res.status === 201) {
      const { job } = convertXmltoJson(res.data);
      if (job && job.id) {
        setState({ ...state, jobId: job.id.text, selectedMailingList: selectedRows });
        handleModalClose();
      }
    } else {
      setError(true);
      setErrorMessage({heading: "Please wait 5 minutes and try again. One of our APIs has not responded in time."});
    }
    setLoading(false);
  }

  //Update mailing list in existing job with selected mailing list
  const updateJob = async (jobId) => {
    let addressListId = selectedRows[0];
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    const payload = { addressId: addressListId }
    const body = qs.stringify(payload);
    setLoading(true);
    const res = await APIService.post(`/jobs/${jobId}/update`, body, headers);
    if (res.status === 201) {
      setState({ ...state, selectedMailingList: selectedRows });
      handleModalClose();
    } else {
      setError(true);
      setErrorMessage({heading: "Please wait 5 minutes and try again. One of our APIs has not responded in time."});
    }
    setLoading(false);
  }

  //Handle Mailing list submission
  const handleSubmit = async () => {
    if (jobId && jobId !== "") {
      await updateJob(jobId);
    } else {
      await createJob();
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/', undefined, {scroll: false});
  }

  //Handle Mailing list edit
  const handleEdit = (id) => {
    router.push(`/mailinglists/${id}`, undefined, {scroll: false});
  }

  //Render actions column
  const renderActions = (id) => {
    return (
      <div className="align-content-center d-flex justify-content-between table-actions">
        <span onClick={() => handleEdit(id)}>
          {/* <Image  src="/images/edit.svg" alt="" className="me-3" width={15} height={15}/> */}
          <img src="/images/edit.svg" alt="" className="me-3" />
          </span>
      </div>
    )
  }

  const rowSelectionHandler = (rows) => {
    let currentRows = [...selectedRows];
    let newRows = rows.filter(x => !currentRows.includes(x))
    setSelectedRows(newRows);
  }

  const renderRows = () => {
    const rows = mailingLists.map(list => {
      return {
        id: list.id.text,
        title: list.name.text,
        count: list.statistics.total.text,
        createdon: formatDate('MM/DD/YYYY', list.lastUpdated.text),
      }
    });
    return rows;
  }

  const columns = [
    { field: 'title', headerName: 'List Title', flex: 1 },
    { field: 'count', headerName: 'Addresses', flex: 0.5 },
    { field: 'createdon', headerName: 'Date of creation', flex: 1 },
    {
      field: 'action', headerName: 'Action', flex: 0.5, renderCell: (params) => {
        return renderActions(params.id);
      }
    }
  ];

  const renderMobileListItem = (row) => {
    return <div>
      <p className="mb-0">{row.title}</p>
      <p>{row.count} addresses | {row.createdon}</p>
    </div>
  }
  return (
    <div>
      {!error ?
        <Modal isOpen={isModalOpen} closeBtn={handleModalClose}>
          {loading ? <Loader /> : <>
            <Table
              rows={renderRows()}
              columns={columns}
              checkbox
              tableHeader={"Mailing Lists"}
              renderMobileListItem={renderMobileListItem}
              renderActions={renderActions}
              selectedRows={selectedRows}
              rowSelectionHandler={rowSelectionHandler}
              hideSelectAll
            />
            <div className="col-md-12 d-flex justify-content-end pe-0 mt-2 text-end">
              <button className="btn btn-outline-primary me-2" onClick={handleModalClose}>Cancel</button>
              <button
                className={
                  `btn btn-primary ${!(selectedRows && selectedRows.length > 0) && 'disable_Btn'}`} onClick={handleSubmit}>Done</button>
            </div>
          </>}
        </Modal>
        : <ErrorMessage message={errorMessage} handleErrorClose={() => setError(false)} />
      }
    </div>
  )
}

export default MailingLists
