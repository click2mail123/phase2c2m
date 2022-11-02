import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Modal from '../../components/Modal/Modal';
import Table from '../../components/Table/Table';
import { convertXmltoJson } from '../../helper/helper';
import APIService from '../../helper/APIService';
import { NavContext } from '../../components/Context/NavContextProvider';
import Loader from '../../components/Shared/Loader';
import ErrorMessage from '../../components/Shared/ErrorMessage'


const ReturnAddressList = () => {
  const router = useRouter();
  const { state, setState } = useContext(NavContext);
  const { sessionId } = state;
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [returnAdd, setReturnAdd] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addStatus, setAddStatus] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchReturnAddresss = async () => {
    setLoading(true);
    const res = await APIService.get(`/account/addresses?addressType=Return address`);
    if (res.status === 201 || res.status === 200) {
      let xmlRes = convertXmltoJson(res.data);
      let { account: { addresses: { address } } } = xmlRes;
      if (Array.isArray(address)) {
        setReturnAdd([...address]);
      } else {
        setReturnAdd([address])
      }
    }else {
      setError(true);
      setErrorMessage({ heading: "Unable to fetch Return addresses" });
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchReturnAddresss();
  }, [sessionId])


  const handleSubmit = async () => {
    let filteredReturnAddress = returnAdd.filter(ra => ra.addressId.text === selectedRows[0]);
    setState({...state, returnAddress: filteredReturnAddress[0]})
    handleModalClose();
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/');
  }

  const handleNewReturnAddress = () => {
    console.log('router iside the new return address', router)
    const copyRouter = {...router};
    console.log('copyRouter inide the new return address', copyRouter)

    copyRouter.query.state = JSON.stringify({});
    copyRouter.pathname = `/returnaddress/edit/new`;
    router.push(copyRouter,`/returnaddress/edit/new`)
  }

  const handleEdit = (id, data) => {
    const copyRouter = {...router};
    copyRouter.query.state = JSON.stringify({...data});
    copyRouter.pathname = `/returnaddress/edit/${id}`;
    router.push(copyRouter,`/returnaddress/edit/${id}`)
  }

  const handleDelete = async (id) => {
    //TODO: Test this route
    const url = `/address/${id}`;
    setLoading(true);
    const res = await APIService.delete(url);
    if (res.status === 200) {
      setAddStatus("success");
    } else {
      setAddStatus("fail");
    }
    setLoading(false);
  }



  const renderActions = (id, data) => {
    if(!data){
      data = returnAdd.find(x => x?.addressId?.text === id);
    }
    return (
      <div className="align-content-center d-flex justify-content-between table-actions">
        <span onClick={() => handleEdit(id, data)} title="Edit">
          <img src="/images/edit.svg" alt="" className="me-3" /></span>
        <span onClick={() => handleDelete(id)} title="Delete">
          <img src="/images/delete.svg" alt="" className="me-3" /></span>
      </div>
    )
  }

  const rowSelectionHandler = (rows) => {
    let currentRows = [...selectedRows];
    let newRows = rows.filter(x => !currentRows.includes(x))
    setSelectedRows(newRows);
  }

  const renderRows = () => {
    const rows = returnAdd.map(list => {
      return {
        id: list.addressId.text,
        name: `${list?.name?.firstName?.text} ${list?.name?.lastName.text}`,
        address: `${list?.address1?.text} ${list?.address2 == '' ? list.address2.text : ''}`,
        city: list.city.text,
        state: list.state.text,
        rdata: list,
      }
    });
    return rows;
  }

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'address', headerName: 'Address Line', flex: 1 },
    { field: 'city', headerName: 'City', flex: 1 },
    { field: 'state', headerName: 'State', flex: 0.3 },
    {
      field: 'action', headerName: 'Action', flex: 0.3, renderCell: (params) => {
        return renderActions(params.id, params.row.rdata);
      }
    }
  ];

  const renderMobileListItem = (row) => {
    return <div>
      <p className="mb-0">{row.name}</p>
      <p>{row.address}, {row.city}, {row.state}</p>
    </div>
  }

  const renderModalBody = () => {
    console.log('addStatusaddStatusaddStatus', addStatus)
    let bodyHtml;
    switch (addStatus) {
      case 'success':
        bodyHtml = (
          <div className="modal-content border-0">
            <div className="modal-header border-0 pb-0 pt-1">
            </div>
            <div className="modal-body">
              <div className="text-center">
                <a href="#" className="mb-2 successCircle" ><img src="/images/check.svg" alt="" /></a>
                <h4 className="mb-2 successText">Return address delete successfully</h4>
              </div>
            </div>
          </div>)
        break;
      case 'fail':
        bodyHtml = (
          <div className="modal-content border-0">
            <div className="modal-header border-0 pb-0 pt-1">
            </div>
            <div className="modal-body">
              <div className="text-center">
                <a href="#" className="mb-2"><img src="/images/info.svg" alt="" /></a>
                <h4 className="mb-2 errorText">Error in deleting return address</h4>
                <p className="mb-2">Try again</p>
              </div>
            </div>
          </div>
        )
        break;
      default:
        break;
    }
    return bodyHtml;
  }

  return (
    <div>
      {addStatus == null ?
        <Modal isOpen={isModalOpen} closeBtn={handleModalClose}>
          {loading ? <Loader /> : <>
            <Table
              rows={renderRows()}
              columns={columns}
              checkbox
              tableHeader={"Return Address"}
              renderMobileListItem={renderMobileListItem}
              renderActions={renderActions}
              selectedRows={selectedRows}
              rowSelectionHandler={rowSelectionHandler}
              hideSelectAll
            />
            <div className="col-md-12 d-flex justify-content-end pe-0 mt-2 text-end">
              <button className="btn btn-outline-primary me-2 mb-2 mb-lg-0"
                onClick={() => handleNewReturnAddress()}
                >
                <img src="/images/add.svg" alt="" className="me-2" />New Address</button>
              <button
                className={
                  `btn btn-primary ${!(selectedRows && selectedRows.length > 0) && 'disable_Btn'}`} onClick={handleSubmit}>Done</button>
            </div>
          </>}
        </Modal>
        : <Modal isOpen={isModalOpen} closeBtn={handleModalClose}>
          {loading ? <Loader /> :
            renderModalBody()
          }
        </Modal>}
    </div>
  )
}

export default ReturnAddressList