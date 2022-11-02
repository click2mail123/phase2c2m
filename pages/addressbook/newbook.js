import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Modal from '../../components/Modal/Modal';
import Table from '../../components/Table/Table';
import { convertXmltoJson, convertJstoXml } from '../../helper/helper';
import APIService from '../../helper/APIService';
import { NavContext } from '../../components/Context/NavContextProvider';
import Loader from '../../components/Shared/Loader';
import ErrorMessage from '../../components/Shared/ErrorMessage'

const NewAddressBook = () => {
  const router = useRouter();
  const { state } = useContext(NavContext);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [addressList, setAddressList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [renderTable, setRenderTable] = useState(false)
  const [listInput, setListInput] = useState("")
  const [addBookId, setAddBookId] = useState()
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

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


  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/');
  }

  //This Function builds js object for conversion to xml to add addresses to mailing list
  const buildJsObjectForConversion = () => {
    const finalAddresses = addressList.filter(add => selectedRows.includes(add.id.text));
    const obj = {
      addressList: {
        addressListName: listInput,
        addressMappingId: 1,
        addresses:
        {
          address: finalAddresses.map(add => ({
            Firstname: add.name ? add.name.text : "",
            Organization: add.organization ? add.organization.text : "",
            Address1: add.address1 ? add.address1.text : "",
            Address2: add.address2 ? add.address2.text : "",
            Address3: add.address3 ? add.address3.text : "",
            City: add.city ? add.city.text : "",
            State: add.state ? add.state.text : "",
            Postalcode: add.postalCode ? add.postalCode.text : "",
            Country: add.country ? add.country.text : "",
          }))

        }
      }
    };

    return obj;
  }


  const handleAddToAddressBook = async () => {
   //TODO: Add to address book
  }

  const handleEdit = (addressInfo) => {
    //TODO: Handle Address Edit
    let addressId = addressInfo.id.text;
    // navigate(`/address`, { state: { addressInfo: addressInfo, mode: 'update' } });
  }

  const handleDelete = (addressInfo) => {
    //TODO: Handle Address delete
  }

  const handleNewAddress = () => {
    // navigate('/address', {state: { addressInfo: {}, mode: 'create' }})
  }

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
        id: address.id.text,
        name: address.name.text,
        address: address.address1.text,
        city: address.city.text,
        state: address.state.text,
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

    // TODO : Render mobile layout
    return <div>
      <p className="mb-0">{row.name}</p>
      <p>{row.count} addresses | {row.createdon}</p>
    </div>
  }

  const renderListInput = () => {
    return (
      <div className="modal-body my-md-5 py-md-5">
        <div className="title text-center fw-bold mb-4">
          <h5>Create New Address Book</h5>
        </div>
        <div className="form-group col-lg-6 col-12 mx-auto">
          <input type="text" placeholder="Address Book Name" required={true}
            className={`form-control`}
            value={listInput}
            onChange={(e) => { setListInput(e.target.value) }} />
          <div className="mb-5"><small className="text-black-50">Required</small> </div>
          <div className="align-items-center d-flex flex-column justify-content-center">
            <button type="submit"
              className={`btn btn-primary col-lg-6 col-12 mb-2  ${listInput.trim() === "" && 'disable_Btn'}`}
              onClick={() => {setRenderTable(true) }}
            >
              Next</button>
            <button className="btn btn-link col-lg-6 col-12 text-decoration-none" onClick={() => { router.push('/mailinglists') }}>Cancel</button>
          </div>
        </div>
      </div>
    )
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
            rows={!addBookId ? [] : renderRows()}
            columns={columns}
            checkbox
            tableHeader={`Select the addresses that you want to add to '${listInput}'`}
            renderMobileListItem={renderMobileListItem}
            renderActions={renderActions}
            selectedRows={selectedRows}
            rowSelectionHandler={rowSelectionHandler}
            hideSelectAll
            showAddressBookDropdown
            dropdownChangeHandler={(id) => { setAddBookId(id) }}
            currentDropdownValue={addBookId}
          />
          <div className="col-md-12 d-flex justify-content-end pe-0 mt-2 text-end">
            <button className="btn btn-outline-primary me-2 mb-2 mb-lg-0"
              onClick={handleNewAddress}>
              <img src="/images/add.svg" alt="" className="me-2" />New Address</button>
            <button
              className={
                `btn btn-primary ${!(selectedRows && selectedRows.length > 0) && 'disable_Btn'}`} onClick={handleAddToAddressBook}>Add to Address Book</button>
          </div>
        </>
      )
    }
  }
  return (
    <div>
      <Modal isOpen={isModalOpen} closeBtn={handleModalClose} sizeClass={renderTable && "med-modal"}>
        {renderTable ?
          renderAddressBook() : renderListInput()
        }
      </Modal>
    </div>
  )
}

export default NewAddressBook