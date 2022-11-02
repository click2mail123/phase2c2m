import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Modal from '../../components/Modal/Modal';
import Table from '../../components/Table/Table';
import { convertXmltoJson, convertJstoXml } from '../../helper/helper';
import APIService from '../../helper/APIService';
import { NavContext } from '../../components/Context/NavContextProvider';
import Loader from '../../components/Shared/Loader';
import ErrorMessage from '../../components/Shared/ErrorMessage'

const ManageAddressBook = () => {
  const router = useRouter();
  const { state } = useContext(NavContext);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [renderTable, setRenderTable] = useState(false)
  const [listInput, setListInput] = useState("")
  const [addBookId, setAddBookId] = useState()
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);
  const [toggleModal, setToggleModal] = useState({
    modal: false,
    rows: [],
    title: 'Manage Address Books'
  })

  const columns = [
    { field: 'name', headerName: 'Name', flex: 0.5 },
    // { field: 'address', headerName: 'Addresse Line', flex: 0.8 },
    // { field: 'city', headerName: 'City', flex: 0.5 },
    // { field: 'state', headerName: 'State', flex: 0.5 },
    {
      field: 'action', headerName: 'Action', flex: 0.5, renderCell: (params) => {
        return renderActions(params.row);
      }
    }
  ];

  const addressColumn = [
    { field: 'name', headerName: 'Name', flex: 0.3 },
    { field: 'address1', headerName: 'Address Line', flex: 0.4 },
    { field: 'city', headerName: 'City', flex: 0.3 },
    { field: 'state', headerName: 'State', flex: 0.4 },
    {
      field: 'action', headerName: 'Action', flex: 0.3, renderCell: (params) => {
        return renderActions(params.row);
      }
    }
  ]

  const getAddressBooks = async () => {
    setLoading(true);
    const res = await APIService.get(
      `/addressBook`);
    const addressesBooks = convertXmltoJson(res.data);
    const addresses = addressesBooks?.listOfAddressbooks?.addressbooks?.addressBook;
    const rows = addresses?.map(address => {
      return {
        id: address.id.text,
        name: address.name.text,
        // address: address.address1.text,
        // city: address.city.text,
        // state: address.state.text,
        // addressInfo: address
      }
    });
    setToggleModal((prevData) => ({ ...prevData, rows: rows, modal: false }));
    setLoading(false);
  }

  useEffect(() => {
    getAddressBooks();
  }, [])


  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/');
  }


  const handleEdit = async (rowdata) => {
    setLoading(true)
    //TODO: Handle Address Edit
    let addressId = rowdata.id;
    const res = await APIService.get(
      `/addressBook/${addressId}`);
    if (res.status === 200) {
      const addressBooks = convertXmltoJson(res.data);
      const finalObj = addressBooks.addresses.address.map((data) => {
        return {
          id: data.id.text,
          name: data.name.text,
          address1: data.address1.text,
          city: data.city.text,
          state: data.state.text
        }
      })
      setToggleModal((prevData) => ({ title: `Managing "Family"`, rows: [...finalObj], modal: true, columns: addressColumn }))
    }
    setLoading(false)
  }

  const handleDelete = (addressInfo) => {
    //TODO: Handle Address delete
  }

  const handleNewAddress = () => {
    // navigate('/address', {state: { addressInfo: {}, mode: 'create' }})
  }

  const renderActions = (rows) => {
    return (
      <div className="align-content-center d-flex justify-content-between table-actions">
        <span onClick={() => handleEdit(rows)} title="Edit">
          <img src="/images/edit.svg" alt="" className="me-3" /></span>
        <span onClick={() => handleDelete(rows)} title="Delete">
          <img src="/images/delete.svg" alt="" className="me-3" /></span>
      </div>
    )
  }

  const rowSelectionHandler = (rows) => {
    setSelectedRows([...rows]);
  }


  const renderMobileListItem = (row) => {
    return <div>
      <p className="mb-0">{row.name}</p>
      {/* <p>{row.address}, {row.city}, {row.state}</p> */}
    </div>
  }


  const renderAddressBook = () => {
    if (loading) {
      return <Loader />
    } else if (addSuccess) {
      return <ErrorMessage
        variant="success"
        message={{ heading: "Mailing List created successfully", body: "" }}
        handleErrorClose={() => {
          setAddSuccess(false);
          router.push("/mailinglists");
        }} />
    } else if (error) {
      return <ErrorMessage message={errorMessage} handleErrorClose={() => setError(false)} />
    } else {
      return (
        <>
          <Table
            rows={toggleModal.rows}
            columns={toggleModal.modal ? addressColumn : columns}
            checkbox
            tableHeader={toggleModal.title}
            renderMobileListItem={renderMobileListItem}
            renderActions={renderActions}
            selectedRows={selectedRows}
            rowSelectionHandler={rowSelectionHandler}
            hideSelectAll
            backButton
            showAddressBookDropdown={false}
          // dropdownChangeHandler={(id) => { setAddBookId(id) }}
          // currentDropdownValue={addBookId}
          />
          <div className="col-md-12 d-flex justify-content-end pe-0 mt-2 text-end">
            <button className="btn btn-outline-primary me-2 mb-2 mb-lg-0"
              onClick={handleNewAddress}>
              {
                toggleModal.modal ? <>Transfer to Address book</> : <>
                  <img src="/images/add.svg" alt="" className="me-2" />New Address
                </>
              }
            </button>
            <button
              className={
                `btn btn-primary ${!(selectedRows && selectedRows.length > 0) && 'disable_Btn'}`} onClick={handleNewAddress}>{toggleModal.modal ? 'Copy to ' : 'Add to '}Address Book</button>
          </div>
        </>
      )
    }
  }
  return (
    <div>
      <Modal isOpen={isModalOpen} closeBtn={handleModalClose} sizeClass={renderTable && "med-modal"}>
        {renderAddressBook()}
      </Modal>
    </div>
  )
}

export default ManageAddressBook