import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import qs from 'qs';
import Select from "react-select";
import Modal from '../../components/Modal/Modal';
// import { Country, State } from "country-state-city";
import APIService from '../../helper/APIService';
import Loader from '../../components/Shared/Loader';
import convertJstoXml from '../../helper/helper'
import { _formatCountryName, generateTimeStamp } from '../../helper/helper';
const SuccessMessage = dynamic(() => import('../../components/Shared/SuccessMessage'))
// const Country = dynamic(() => import('country-state-city'))
// const State = dynamic(() => import('country-state-city'))


const AddNewAddress = () => {
  const router = useRouter();
  const { addressListId } = router.query;
  let addressData;
  const defaultError = {
    fnameerror: '', lnameerror: '', countryerror: '', address1error: '', cityerror: '', ziperror: '', stateerror: ''
  }
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [inputData, setInputData] = useState({
    fname: addressData?.name?.firstName?.text || '',
    lname: addressData?.name?.lastName?.text || '',
    organization: addressData?.organization?.text || '',
    country: addressData?.country ? { ...addressData.country, name: _formatCountryName(addressData.country.text) } : '',
    address1: addressData?.address1?.text || '',
    address2: addressData?.address2?.text || '',
    address3: addressData?.address3?.text || '',
    city: addressData?.city?.text || '',
    zip: addressData?.zip?.text || '',
    state: addressData?.state?.text || '',
    addId: addressData?.addressId?.text || '',
  })
  const [addStatus, setAddStatus] = useState(null);
  const [error, setError] = useState(defaultError);
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const listid = addressListId;


  const countries = Country?.getAllCountries();
  const updatedCountries = countries.map((country) => ({
    label: country.name,
    value: country.id,
    ...country
  }));
  const updatedStates = (isoCode) => {
    let country = updatedCountries.filter(ct => ct.name === inputData.country.name)[0];
    const states = State.getStatesOfCountry(country?.isoCode || isoCode)
      .map((state) => ({ label: state.name, value: state.isoCode, ...state }));
    return states;
  }


  console.log('router.query;router.query;', router.query)
  // console.log('router.query;router.query;00000000000', data)

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

  //handle update address
  const handleUpdateAddress = async () => {
    let errors = await checkValidation()
    setError(errors)
    if (!Object.keys(errors).length) {
      setError(defaultError)
      const url = ``;
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      const payload = {
        firstName: inputData?.fname,
        lastName: inputData?.lname,
        organization: inputData?.organization,
        country: (inputData.country['name'] === undefined ? inputData.country : inputData.country['name']),
        address1: inputData?.address1,
        city: inputData?.city,
        zip: inputData?.zip,
        state: (inputData?.state['isoCode'] === undefined ? inputData.state : inputData?.state['isoCode']),
        type: 'new address',
        description: addressData?.description?.text
      }
      const body = qs.stringify(payload)
      setLoading(true);
      const res = await APIService.post(url, body, headers);
      if (res.status === 200) {
        setAddStatus("success");
        setSuccess(true)
        setSuccessMessage({ heading: "Address Updated", body: "" })
      } else {
        setAddStatus("fail");
      }
      setLoading(false);
    }
  }

  //handle add address
  const handleAddAddress = async () => {
    let errors = await checkValidation()
    setError(errors)
    if (!Object.keys(errors).length) {
      setError(defaultError)
      const url = `/addressLists/address2?baseAddressListId=${listid}`;
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }

      let address0 = {
        firstName: inputData?.fname,
        lastName: inputData?.lname,
        organization: inputData?.organization,
        country: inputData?.country['name'],
        address1: inputData?.address1,
        city: inputData?.city,
        zip: inputData?.zip,
        state: inputData?.state['isoCode'],
        type: 'new address',
        description: generateTimeStamp(),
        addressListName: 'Test by C2M',
        addressType: '1'
      }
      const payload = {
        addressListName: 'Test by C2M',
        addressMappingId: '1',
        // address : address0
        // address : {
          firstName: inputData?.fname,
          lastName: inputData?.lname,
          organization: inputData?.organization,
          country: inputData?.country['name'],
          address1: inputData?.address1,
          city: inputData?.city,
          zip: inputData?.zip,
          state: inputData?.state['isoCode'],
          type: 'new address',
          description: generateTimeStamp(),
          addressListName: 'Test by C2M',
          addressType: '1'
        // }
      }

      // console.log('payload before..............', convertJstoXml(payload))


//       const body = "
// <addressList>\n  
// 	<addressListName>C2M_Mahesh_Magento_Test</addressListName>\n  
// 	<addressMappingId>1</addressMappingId>\n  
// 	<addresses>\n    
// 		<address>\n        
// 			<id>461936075</id>\n        
// 			<Firstname>Mahesh</Firstname>\n        
// 			<Lastname></Lastname>\n        
// 			<Organization>C2M LLC</Organization>\n        
// 			<Address1>6070 California Circle Apt 310</Address1>\n        
// 			<Address2></Address2>\n        
// 			<Address3></Address3>\n        
// 			<City>Rockville</City>\n        
// 			<State>MD</State>\n        
// 			<Postalcode>20852</Postalcode>\n        
// 			<Country></Country>\n    
// 		</address>\n  
// 	</addresses>\n  
// </addressList>"


  // const payload2 = 

  //       <addressList>
  //         <addressListName>Test by C2M</addressListName>
  //         <addressMappingId>1</addressMappingId>
  //         <addresses>
  //           <address>
  //               <Firstname> {inputData?.fname} </Firstname>
  //               <Lastname>{inputData?.lname}</Lastname>
  //               <Organization> {inputData?.organization} </Organization>
  //               <Address1>{inputData?.address1}</Address1>
  //               <Address2></Address2>
  //               <Address3></Address3>
  //               <City>{inputData?.city}</City>
  //               <State>{payload.state}</State>
  //               <Postalcode>{payload.zip}</Postalcode>
  //               <Country>{payload.country}</Country>
  //           </address>
  //         </addresses>
  //       </addressList>

      // const body = qs.stringify(payload)
      const body = payload
      console.log('bodybodybody in the mailing lists', body)
      setLoading(true);
      const res = await APIService.put(url, body, headers);
      if (res.status === 200) {
        setAddStatus("success");
        setSuccess(true)
        setSuccessMessage({ heading: "Address Created", body: "" })
      } else {
        setAddStatus("fail");
      }
      setLoading(false);
    }
  }


  // const handleAddAddress = () => {
  //   var myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/xml");
  //   myHeaders.append("Accept", "application/xml");
  //   myHeaders.append("user-agent", "my-app/0.0.1");
  //   myHeaders.append("Authorization", "Basic Y2xpY2sybWFpbDEyMzpDbGljazJtYWlsQDEyMw==");

  //   var raw = "<addressList>\n  <addressListName>Test by C2M</addressListName>\n  <addressMappingId>1</addressMappingId>\n  <addresses>\n    <address>\n        <Firstname>C2M Mahesh</Firstname>\n        <Lastname></Lastname>\n        <Organization>C2M LLC</Organization>\n        <Address1>6070 California Circle Apt 310</Address1>\n        <Address2></Address2>\n        <Address3></Address3>\n        <City>Rockville</City>\n        <State>MD</State>\n        <Postalcode>20852</Postalcode>\n        <Country></Country>\n    </address>\n  </addresses>\n  </addressList>";

  //   var requestOptions = {
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: 'follow'
  //   };

  //   fetch("https://api-proxy.click2mail.com/molpro/addressBook/33405/address", requestOptions)
  //     .then(response => response.text())
  //     .then(result => console.log(result))
  //     .catch(error => console.log('errorrrrrrrrrrrrrrrrr', error));
  // }


// const handleAddAddress = () => {
// var myHeaders = new Headers();
// myHeaders.append("Content-Type", "application/xml");
// myHeaders.append("Accept", "application/xml");
// myHeaders.append("user-agent", "my-app/0.0.1");
// myHeaders.append("Authorization", "Basic Y2xpY2sybWFpbDEyMzpDbGljazJtYWlsQDEyMw==");

// var raw = "<addressList>\n    <addresses>\n        <address>\n            <id>507448</id>\n            <unmappedField>\n                <key>First_name</key>\n                <value>Joe</value>\n            </unmappedField>\n            <unmappedField>\n                <key>Last_name</key>\n                <value>Tempes</value>\n            </unmappedField>\n            <unmappedField>\n                <key>Organization</key>\n                <value>sample org</value>\n            </unmappedField>\n            <unmappedField>\n                <key>Address1</key>\n                <value>6010 California Circle</value>\n            </unmappedField>\n            <unmappedField>\n                <key>Address2</key>\n                <value>Apt 32</value>\n            </unmappedField>\n            <unmappedField>\n                <key>Address3</key>\n                <value></value>\n            </unmappedField>\n            <unmappedField>\n                <key>City</key>\n                <value>Rockville</value>\n            </unmappedField>\n            <unmappedField>\n                <key>State</key>\n                <value>MD</value>\n            </unmappedField>\n            <unmappedField>\n                <key>Zip</key>\n                <value>20852</value>\n            </unmappedField>\n            <unmappedField>\n                <key>Country_non-US</key>\n                <value></value>\n            </unmappedField>\n        </address>\n    </addresses>\n</addressList>";

// var requestOptions = {
//   method: 'PUT',
//   headers: myHeaders,
//   body: raw,
//   redirect: 'follow'
// };

// fetch("https://api-proxy.click2mail.com/molpro/addressLists/address2?baseAddressListId=523288", requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error00000000000000000000000000000000', error));
// }

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/', undefined, { scroll: false });
  }

  const handleInputChange = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    let newInputData = { ...inputData };
    newInputData[key] = value;
    setInputData(newInputData);
  }

  const renderAddressForm = () => {
    return (
      <div className="container">
        <div className="align-items-end d-flex justify-content-between mb-4">
          <div className="title">
            <h2 className="text-center p-0 fw-28">Create / Update New Address</h2>
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
          <div className="ms-auto flex-lg-row flex-md-row flex-column-reverse d-flex w-100">
            <div className="btn btn-link text-decoration-none" onClick={handleModalClose}>Cancel</div>
            <button type="submit" className="btn btn-primary" onClick={addressData && addressData.name ? handleUpdateAddress : handleAddAddress}>{addressData && addressData.name ? "Update" : "Save"}</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Modal isOpen={isModalOpen} closeBtn={handleModalClose}>
        {success ?
          <SuccessMessage message={successMessage} handleSuccessClose={() => {
            setSuccess(false);
            handleModalClose();
          }
          } />
          :
          loading ? <Loader /> :
            renderAddressForm()
        }
      </Modal>
    </div>
  )
}

export default AddNewAddress