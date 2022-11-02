import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import qs from 'qs'
import Modal from '../../components/Modal/Modal';
import Table from '../../components/Table/Table';
import { convertXmltoJson } from '../../helper/helper';
import APIService from '../../helper/APIService';
import { NavContext } from '../../components/Context/NavContextProvider';
import Loader from '../../components/Shared/Loader';
import ErrorMessage from '../../components/Shared/ErrorMessage'
import TabModal from '../../components/Shared/TabModal';


const Contacts = () => {
  const router = useRouter();
  const { state, setState } = useContext(NavContext);
  const { jobId, documentId } = state;
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [addBookId, setAddBookId] = useState()
  const [addInfo, setAddInfo] = useState()
  const [addressList, setAddressList] = useState([]);


  const getAddressList = async () => {
    setLoading(true);
    const res = await APIService.get(
      `/addressBook/${addBookId}`);
    let xml = convertXmltoJson(res.data);
    const { addresses: { address } } = xml;
    if (Array.isArray(address)) {
      setAddressList([...address]);
    } else {
      setAddressList([address])
    }
    setLoading(false);
  }

  useEffect(() => {
    if (addBookId) {
      getAddressList();
    }
  }, [addBookId])


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
      "envelope": "#10 Double Window",
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
      setErrorMessage({ heading: "Unable to create new job" });
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
      setErrorMessage({ heading: "Unable to update job" });
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
    // navigate('/');
  }

  //Handle Mailing list edit
  const handleEdit = (addressInfo) => {
    console.log('addressInfoaddressInfoaddressInfo', addressInfo)
    let addressInfoTwo = addressInfo;
    //TODO: Update Handler
    let addressId = addressInfo.id.text;
    setAddInfo(addressInfo)
    console.log('addressInfoTwoaddressInfoTwo', addressInfoTwo)
    addressInfoTwo.addBookId = addBookId;
    // navigate(`/address`, { state: { addressInfo: addressInfo, mode: 'update' } });
    // router.push({ pathname: `/contacts/addnewaddress`, query: { id: addBookId, addressInfo: addressInfoTwo } });
    // console.log('data inside the return addresss edit', data)
    const copyRouter = { ...router };
    copyRouter.query.state = JSON.stringify({ ...addressInfoTwo });
    // copyRouter.pathname = '/contacts/addnewaddress';
    // router.push(copyRouter)
  }

  const handleDelete = async (id) => {
    //TODO : Handle Delete
  }

  const handleNewAddress = (addBookId) => {
    // router.push("/contacts/addnewaddress");
    // router.push({ pathname: `/contacts/addnewaddress`, query: { id: addBookId} });
    let addressInfoTwo = {};
    addressInfoTwo.addBookId = addBookId
    const copyRouter = { ...router };
    // copyRouter.query.state = addressInfoTwo;
    copyRouter.query.state = JSON.stringify({ ...addressInfoTwo });

    // copyRouter.pathname = '/contacts/addnewaddress';
    // router.push(copyRouter)
  }

  const handleDropDownChange = (id) => {
    if(id === "newBook"){
      router.push('/addressbook/newbook')
    } else if (id === "manageBook"){
      router.push('/addressbook/managebook')
    } 
    else {
      setAddBookId(id)
    }
  }

  //Render actions column
  const renderActions = (addressInfo) => {
    return (
      <div className="align-content-center d-flex justify-content-between table-actions">
        <span onClick={() => handleEdit(addressInfo)} title="Edit">
          <img src="/images/edit.svg" alt="" className="me-3" /></span>
        <span onClick={() => handleDelete(addressInfo)} title="Delete">
          <img src="/images/delete.svg" alt="" className="me-3" /></span>
      </div>
    )
  }

  const rowSelectionHandler = (rows) => {
    setSelectedRows([...rows]);
  }

  const renderRows = () => {
    const rows = addressList.map(address => {
      return {
        id: address?.id?.text,
        name: address?.name?.text,
        address: address?.address1?.text,
        city: address?.city?.text,
        state: address?.state?.text,
        addressInfo: address
      }
    });
    return rows;
  }

  const columns = [
    { field: 'name', headerName: 'Name', flex: 0.5 },
    { field: 'address', headerName: 'Addresse Line', flex: 0.8 },
    { field: 'city', headerName: 'City', flex: 0.5 },
    { field: 'state', headerName: 'State', flex: 0.5 },
    {
      field: 'action', headerName: 'Action', flex: 0.5, renderCell: (params) => {
        return renderActions(params.row.addressInfo);
      }
    }
  ];

  const renderMobileListItem = (row) => {
    return <div>
      <p className="mb-0">{row.name}</p>
      <p>{row.address}, {row.city}, {row.state}</p>
    </div>
  }

  return (
    <div>
      {!error ?
        <Modal isOpen={isModalOpen} closeBtn={handleModalClose}>
          {loading ? <Loader /> : <>
            <TabModal currentTab={0} buttons={[{ buttonText: "Contacts", url: "/contacts" }, { buttonText: "Mailing List", url: "/mailinglists" }]} />
            <>
              <Table
                rows={!addBookId ? [] : renderRows()}
                columns={columns}
                checkbox
                tableHeader={`Select Addresses or Add new Address`}
                renderMobileListItem={renderMobileListItem}
                renderActions={renderActions}
                selectedRows={selectedRows}
                rowSelectionHandler={rowSelectionHandler}
                hideSelectAll
                showAddressBookDropdown
                dropdownChangeHandler={(id) => {handleDropDownChange(id)}}
                currentDropdownValue={addBookId}
              />
              <div className="col-md-12 d-flex flex-lg-row flex-md-row flex-sm-row flex-column justify-content-end pe-0 mt-2 text-end">
                <button className="btn btn-outline-primary me-lg-2 me-md-2 mb-2 mb-lg-0"
                  onClick={() => {handleNewAddress(addBookId)}}>
                  <img src="/images/add.svg" alt="" className="me-2" />New Address</button>
                <button
                  className={
                    `btn btn-primary ${!(selectedRows && selectedRows.length > 0) && 'disable_Btn'}`} onClick={() => {}}>Done</button>
              </div>
            </>
          </>}
        </Modal>
        : <ErrorMessage message={errorMessage} handleErrorClose={() => setError(false)} />
      }
    </div>
  )
}

export default Contacts