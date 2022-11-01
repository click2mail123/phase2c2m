import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Modal from '../../components/Modal/Modal';
import Table from '../../components/Table/Table';
import { convertXmltoJson, convertJstoXml } from '../../helper/helper';
import APIService from '../../helper/APIService';
import Loader from '../../components/Shared/Loader';
import ErrorMessage from '../../components/Shared/ErrorMessage';
import { _formatCountryName, generateTimeStamp } from '../../helper/helper';
import Select from "react-select";
// import { Country, State } from "country-state-city";


const MailingList = () => {

  const router = useRouter();
  const { addressListName } = router.query;
  const { id } = router.query;
  const listInput = addressListName;
  let addressInfo;
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [addressList, setAddressList] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newaddressaddition, setNewAddressAddition] = useState(false);
  const [renderaddressform,   setRenderAddressForm] = useState(false);
  const [setformaddress,   setFormAddress] = useState('');
  const [newaddress,   setNewAddress] = useState(false);
  const [inputData, setInputData] = useState({
    fname: addressInfo?.name?.text || '',
    lname: addressInfo?.name?.lastName?.text || '',
    organization: addressInfo?.organization?.text || '',
    country: addressInfo?.country ? { ...addressInfo.country, name: _formatCountryName(addressInfo.country.text) } : '',
    address1: addressInfo?.address1?.text || '',
    address2: addressInfo?.address2?.text || '',
    address3: addressInfo?.address3?.text || '',
    city: addressInfo?.city?.text || '',
    zip: addressInfo?.postalCode?.text || '',
    state: addressInfo?.state?.text || '',
    addId: addressInfo?.addressId?.text || '',
  })
  const defaultError = {
    fnameerror: '', lnameerror: '', countryerror: '', address1error: '', cityerror: '', ziperror: '', stateerror: ''
  }


  const countries = Country?.getAllCountries();
  const updatedCountries = countries.map((country) => ({
    label: country.name,
    value: country.id,
    ...country
  }));


  console.log('inputDatainputDatainputDatainputData', inputData)
  console.log('router queryyyyyyyyyyyyyyyyyyy', router.query)

  const updatedStates = (isoCode) => {
    let country = updatedCountries.filter(ct => ct.name === inputData.country.name)[0];
    const states = State.getStatesOfCountry(country?.isoCode || isoCode)
      .map((state) => ({ label: state.name, value: state.isoCode, ...state }));
    return states;
  }

  //handle validation
  const checkValidation = async () => {
    let errorObj = {};
    if (inputData?.fname === '') {
      errorObj.fnameerror = 'Please enter firstname!';
    }
    if (inputData?.lname === '') {
      errorObj.lnameerror = 'Please enter lastname!';
    }
    if (inputData?.country === '') {
      errorObj.countryerror = 'Please select country!';
    }
    if (inputData?.address1 === '') {
      errorObj.address1error = 'Please enter address1!';
    }
    if (inputData?.city === '') {
      errorObj.cityerror = 'Please enter city!';
    }
    if (inputData?.zip === '' || inputData?.zip?.length < 4) {
      errorObj.ziperror = 'Please enter minimum 5 digits zipcode!';
    }
    if (inputData?.state === '') {
      errorObj.stateerror = 'Please select state!';
    }
    return errorObj;
  }
  
  //Get Address list info i.e. list of all addresses
  const getAddressList = async () => {
    setLoading(true);
    const res = await APIService.get(`/addressLists/info?baseAddressListId=${id}`);
    if (res.status === 200) {
      let { addresses: addList } = convertXmltoJson(res.data);
      if (Array.isArray(addList.address)) {
        setAddressList([...addList.address]);
      } else {
        setAddressList([addList.address])
      }
    } else {
      setError(true);
      setErrorMessage({ heading: "Unable to fetch addresses from Mailing List" });
    }
    setLoading(false);
  }

  useEffect(() => {
    getAddressList();
  }, [id])

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/', undefined, { scroll: false });
  }

  const handleNewAddress = (id) => {
    setNewAddress(true)
  }

   //Handle Mailing list edit
   const handleEdit = (addressInfoList) => {
    console.log('addressInfoaddressInfo in handle edit 00000000000000', addressInfoList)
    console.log('addressses we got from the api calls', addressList)
    addressInfoList = addressList.find(x => x?.id?.text === addressInfoList.id);
    console.log('addressInfoaddressInfo in handle edit 11111111111111111111', addressInfoList)
    console.log('setformaddress inside the edit000000000000000000', setformaddress)
    //TODO: Add update Handler
    setRenderAddressForm(true);
    setNewAddress(true)
    // let addressInfo2 = { ...addressInfo };
    // // newInputData[key] = value;
    // console.log('addressInfo22222222222222', addressInfo2)
    // addressInfo2 = JSON.stringify(addressInfo2)
    // console.log('addressInfo3333333333333333333333333', addressInfo2)
    // setInputData(addressInfo2);
    setFormAddress(addressInfoList)
    addressInfo = addressInfoList
    console.log('setformaddress inside the 111111111111111111111111111111111111', setformaddress)
    console.log('addressInfo inside the 111111111111111111111111111111111111', addressInfo)
    setInputData({
      fname: addressInfo?.name?.text || '',
      // lname: addressInfo?.name?.lastName?.text || '',
      organization: addressInfo?.organization?.text || '',
      country: addressInfo?.country ? { ...addressInfo.country, name: _formatCountryName(addressInfo.country.text) } : '',
      address1: addressInfo?.address1?.text || '',
      address2: addressInfo?.address2?.text || '',
      address3: addressInfo?.address3?.text || '',
      city: addressInfo?.city?.text || '',
      zip: addressInfo?.postalCode?.text || '',
      state: addressInfo?.state?.text || '',
      addId: addressInfo?.addressId?.text || '',
    })


  }

  const handleDelete = async (addressInfo) => {
    console.log('addressInfoaddressInfo in handledelete', addressInfo)
    let addressId = addressInfo?.id;
    let addressListId = id;
    const res = await APIService.delete(`/addressLists?baseAddressListId=${addressListId}&id=${addressId}`);
    // const res = await APIService.delete(`/addressLists/${id}`);
    if (res.status === 200) {
      await getAddressList();
    }
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

  const renderRows = () => {
    const rows = addressList.map(address => {
      return {
        id: address.id.text,
        name: address.name.text,
        address: address.address1.text,
        city: address.city.text,
        state: address.state.text,
      }
    });
    return rows;
  }

  const columns = [
    { field: 'name', headerName: 'Name', flex: 0.8 },
    { field: 'address', headerName: 'Addresse Line', flex: 1 },
    { field: 'city', headerName: 'City', flex: 0.5 },
    { field: 'state', headerName: 'State', flex: 0.5 },
    {
      field: 'action', headerName: 'Action', flex: 0.5, renderCell: (params) => {
        console.log('params.row.addressInfo', params)
        return renderActions(params.row);
      }
    }
  ];

  const renderMobileListItem = (row) => {
    return <div>
      <p className="mb-0">{row.name}</p>
      <p>{row.city}, {row.state}</p>
    </div>
  }

 
  const handleInputChange = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    let newInputData = { ...inputData };
    newInputData[key] = value;
    setInputData(newInputData);
  } 

  //handle update address
  const handleUpdateAddress = async () => {
    console.log('inside the handleNewAddToListhandleNewAddToList')
    const headers = {
      'Accept': 'application/xml',
      'Content-Type': 'application/xml',
    }
    const addressObject = buildJsObjectForConversion();
    console.log('addressObjectaddressObject................', addressObject)
    let body = convertJstoXml(addressObject);
    console.log('bodybodybodybodybodybody................', body)

    const res = await APIService.put(`addressLists/address2?baseAddressListId=${id}`, body, headers);
    console.log('ress handle add new addresssss put addresssss', res)
    if (res.status === 200) {
      setAddSuccess(true);
    } else {
      setError(true);
      setErrorMessage({ heading: "Unable to create new mailing list" });
    }
  }
  
  //handle add address
  const handleAddAddress = async () => {
    let errors = await checkValidation()
    setError(errors)
    if (!Object.keys(errors).length) {
      setError(defaultError)
      const url = '/account/addresses';
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      const payload = {
        firstName: inputData?.fname,
        lastName: inputData?.lname,
        organization: inputData?.organization,
        country: inputData?.country['name'],
        address1: inputData?.address1,
        city: inputData?.city,
        zip: inputData?.zip,
        state: inputData?.state['isoCode'],
        type: 'Return address',
        description: generateTimeStamp(),
      }

      const body = qs.stringify(payload)
      setLoading(true);
      const res = await APIService.post(url, body, headers);
      if (res.status === 200) {
        setAddStatus("success");
        setSuccess(true)
        setSuccessMessage({ heading: "Return Address Added Successfully", body: "" })
      } else {
        setAddStatus("fail");
      }
      setLoading(false);
    }
  }

  //get country name
      
  const getCountry = (country) => {
    console.log('countrycountry', country)
    return country.label
    
  }

  //This Function builds js object for conversion to xml to add addresses to mailing list
  const buildJsObjectForConversion = () => {
    console.log('handleNewAddToListhandleNewAddToList....................', inputData)
    // const finalAddresses = addressList.filter(add => selectedRows.includes(add.id.text));
    const finalAddresses = [inputData];
    console.log('finallllllllladdressssssssssssssssss', finalAddresses)

    ' <addressList><addressListName>yyyyyyyyyyyyy</addressListName><addressMappingId>1</addressMappingId><addresses><address><Firstname>Facebook Inc</Firstname><Organization>Meta</Organization><Address1>Menlo Park</Address1><Address2>1 Hacker Way</Address2><Address3/><City>Menlo Park</City><State>CA</State><Postalcode>94025-1456</Postalcode><Country>UNITED STATES</Country></address></addresses></addressList> '

    const obj = {
      addressList: {
        // addressListName: listInput,
        // addressMappingId: 1,
        addresses:
        {
          address: finalAddresses.map(add => ({
            Firstname: add.fname ? add.fname : "",
            Organization: add.organization ? add.organization : "",
            Address1: add.address1 ? add.address1 : "",
            Address2: add.address2 ? add.address2 : "",
            Address3: add.address3 ? add.address3 : "",
            City: add.city ? add.city : "",
            State: add.state ? add.state['isoCode'] : "",
            Postalcode: add.zip ? add.zip : "",
            // Country: getCountry(add.country), Country_non-US
            // Country_non-US: ''
          }))

        }
      }
    };
    return obj;
  }


  const handleNewAddToList = async () => {
    console.log('inside the handleNewAddToListhandleNewAddToList')
    const headers = {
      'Accept': 'application/xml',
      'Content-Type': 'application/xml',
    }
    const addressObject = buildJsObjectForConversion();
    console.log('addressObjectaddressObject................', addressObject)
    let body = convertJstoXml(addressObject);
    console.log('bodybodybodybodybodybody................', body)

    const res = await APIService.put(`addressLists/address2?baseAddressListId=${id}`, body, headers);
    console.log('ress handle add new addresssss put addresssss', res)
    if (res.status === 200) {
      setAddSuccess(true);
    } else {
      setError(true);
      setErrorMessage({ heading: "Unable to create new mailing list" });
    }
  }  

  const renderAddressForm = () => {
    return (
      <div className="container">
        <div className="align-items-end d-flex justify-content-between mb-4">
          <div className="title">
            <h2 className="text-center p-0 fw-28">Create/Update New Address</h2>
          </div>
        </div>
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="First Name" className="form-control" name="fname" value={inputData.fname} onChange={handleInputChange} />
            {error?.fnameerror ? <p className="text-danger">{error?.fnameerror}</p> : null}
          </div>
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="Last Name" className="form-control" name="lname" value={inputData.lname} onChange={handleInputChange} />{error?.lnameerror ? <p className="text-danger">{error?.lnameerror}</p> : null}
          </div>
        </div>
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="Organization" className="form-control" name="organization" value={inputData.organization} onChange={handleInputChange} />
          </div>
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3 selectBx">
            <Select
              id="country"
              name="country"
              label="country"
              options={updatedCountries}
              value={updatedCountries.find(op => {
                return op.name == inputData.country.name
              })}
              defaultValue={inputData.country}
              placeholder="Select country"
              // className="select-return"
              onChange={(value) => {
                setInputData({ ...inputData, country: value });
              }}
            />
            {error?.countryerror ? <p className="text-danger">{error?.countryerror}</p> : null}
          </div>
        </div>
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="Address 1" className="form-control" name="address1" value={inputData.address1} onChange={handleInputChange} />
            {error?.address1error ? <p className="text-danger">{error?.address1error}</p> : null}
          </div>
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="Address 2" className="form-control" name="address2" value={inputData.address2} onChange={handleInputChange} />
          </div>
        </div>
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="Address 3" className="form-control" name="address3" value={inputData.address3} onChange={handleInputChange} />
          </div>
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="City" className="form-control" name="city" value={inputData.city} onChange={handleInputChange} />
            {error?.cityerror ? <p className="text-danger">{error?.cityerror}</p> : null}
          </div>
        </div>
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="ZIP Code" className="form-control" name="zip" value={inputData.zip} onChange={handleInputChange} />
            {error?.ziperror ? <p className="text-danger">{error?.ziperror}</p> : null}
          </div>
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3 selectBx">
            <Select
              id="state"
              name="state"
              // className='select-return'
              options={updatedStates()}
              value={updatedStates().find(op => op.isoCode === inputData.state)}
              placeholder="Select state"
              onChange={(value) => {
                setInputData({ ...inputData, state: value });
              }}
            />{error?.stateerror ? <p className="text-danger">{error?.stateerror}</p> : null}
          </div>
        </div>

        <div className="footAction d-flex">
          <div className="ms-auto flex-lg-row flex-md-row flex-column-reverse d-flex response_btn">
            <div className="btn btn-link text-decoration-none" onClick={handleModalClose}>Cancel</div>
            <button type="submit" className="btn btn-primary" onClick={!newaddress ? handleUpdateAddress : handleNewAddToList}>{!newaddress ? 'Update' : 'Save'}</button>
          </div>
        </div>
      </div>
    )
  }


  const renderAddressList = () => {
    // if(setNewAddressAddition) {
    //   // renderAddressForm()
    // }
    // else {
      <div>
        {!error ?
          <Modal isOpen={isModalOpen} closeBtn={handleModalClose}>
            {loading ? <Loader /> : <Table
              rows={renderRows()}
              columns={columns}
              tableHeader={"'Summer Campaign' List"}
              renderMobileListItem={renderMobileListItem}
              renderActions={renderActions}
              backButton
              checkbox
            />}
            <div className="col-md-12 d-flex flex-lg-row flex-md-row flex-sm-row flex-column justify-content-end pe-0 mt-2 text-end">
              <button className="btn btn-outline-primary me-lg-2 me-md-2 mb-2 mb-lg-0"
                onClick={handleNewAddress 
                  //TODO: Handle New Address
                }>
                <img src="/images/add.svg" alt="" className="me-2" />New Address</button>
              <button
                className={`btn btn-primary`} onClick={() => { router.push('/mailinglists') }}>Save</button>
            </div>
          </Modal>
          : <ErrorMessage message={errorMessage} handleErrorClose={() => {
            setError(false);
            router.back();
          }} />
        }
      </div>
    // }
  }

  return (
    // renderAddressList()
    <div>
      <>
      {!error ?
        <Modal isOpen={isModalOpen} closeBtn={handleModalClose}>
          {!newaddress ?
            <>
              {loading ? <Loader /> : <Table
                rows={renderRows()}
                columns={columns}
                tableHeader={"'Summer Campaign' List"}
                renderMobileListItem={renderMobileListItem}
                renderActions={renderActions}
                backButton
                checkbox
              />}
              <div className="col-md-12 d-flex flex-lg-row flex-md-row flex-sm-row flex-column justify-content-end pe-0 mt-2 text-end">
                <button className="btn btn-outline-primary me-lg-2 me-md-2 mb-2 mb-lg-0"
                  onClick={() => handleNewAddress(id)}
                    //TODO: Handle New Address
                  >
                  <img src="/images/add.svg" alt="" className="me-2" />New Address</button>
                <button
                  className={`btn btn-primary`} onClick={() => { router.push('/mailinglists') }}>Save</button>
              </div>
            </>
            :
            <>
            {renderAddressForm()}
           </>

          }  
        </Modal>
        : <ErrorMessage message={errorMessage} handleErrorClose={() => {
          setError(false);
          router.back();
        }} />
      }
      </>
  </div>
  )
}

export default MailingList