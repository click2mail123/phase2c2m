import { useState, useContext, useEffect } from 'react'
import qs from 'qs';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import APIService from '../../helper/APIService';
import { NavContext } from '../../components/Context/NavContextProvider';
import { validateCreditCardNumber, convertXmltoJson } from '../../helper/helper';
const CurrentFund = dynamic(() => import('../../components/Fund/CurrentFund'))
const Modal = dynamic(() => import('../../components/Modal/Modal'))
const Loader = dynamic(() => import('../../components/Shared/Loader'))


const AddFund = () => {
  const router = useRouter();
  const { state } = useContext(NavContext);
  const { sessionId } = state;
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [inputData, setInputData] = useState({
    amount: "",
    creditCard: undefined,
    cardName: "",
    cardNum: "",
    address: "",
    expMonth: undefined,
    expYear: undefined,
    cvv: "",
    company: "",
    address1: "",
    address2: "",
    state: "",
    city: ""
  })
  const [addStatus, setAddStatus] = useState(null);
  const [isValidCard, setIsVaildCard] = useState(true);
  const [billingAdd, setBillingAdd] = useState();
  const [formErrors, setFormErrors] = useState([]);


  const fetchBillingAddress = async () => {
    setLoading(true);
    const res = await APIService.get(`/account/addresses?addressType=Billing address`);
    if (res.status === 201 || res.status === 200) {
      let xmlRes = convertXmltoJson(res.data);
      let { account: { addresses: { address } } } = xmlRes;
      if (address) {
        setBillingAdd(address);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchBillingAddress();
  }, [sessionId])

  useEffect(() => {
    if (billingAdd) {
      let inputAdd = billingAdd.address1.text + " , " + billingAdd.city.text + " , " + billingAdd.state.text;

      setInputData({
        ...inputData,
        address: inputAdd,
        address1: billingAdd.address1.text,
        address2: billingAdd.address2 ? billingAdd.address2.text : "",
        state: billingAdd.state.text,
        city: billingAdd.city.text
      });
    }
  }, [billingAdd])

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.back();
  }

  const handleInputChange = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    if (key === 'cardNum' && value.length > 3) {
      const isValid = validateCreditCardNumber(value);
      setIsVaildCard(isValid);
    }

    let newInputData = { ...inputData };
    newInputData[key] = value;
    setInputData(newInputData);
  }

  const validateInputFields = () => {
    const errorExceptions = ['company', 'address2']
    let errors = [];
    for (let key of Object.keys(inputData)) {
      if (!errorExceptions.includes(key)) {
        let value = inputData[key];
        if (!value || (value && value.trim() === "")) {
          errors.push(key);
        }
      }
    }
    return errors;
  }

  const handleBuyCredit = async () => {
    //TODO: Test
    const inputErrors = validateInputFields();
    if (inputErrors && inputErrors.length > 0) {
      setFormErrors([...inputErrors]);
      return;
    }
    const url = '/credit/purchase';
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    // const payload = {
    //   billingName: "Mahesh Lavannis",
    //   billingAddress1: "6070 California Cir Apt 310",
    //   billingCity: "Rockville",
    //   billingState: "MD",
    //   billingZip: "20852-4868",
    //   billingAmount: "100",
    //   billingNumber: "4111111111111111",
    //   billingMonth: "01",
    //   billingYear: "2030",
    //   billingCvv: "123",
    //   billingCcType: "VI"
    // }
    let payload;
    if (billingAdd) {
      payload = {
        'billingName': inputData.cardName,
        'billingAddress1': billingAdd.address1.text,
        'billingCity': billingAdd.city.text,
        billingState: billingAdd.state.text,
        billingZip: billingAdd.zip.text,
        billingAmount: inputData.amount,
        billingNumber: inputData.cardNum,
        billingMonth: inputData.expMonth,
        billingYear: inputData.expYear,
        billingCvv: inputData.cvv,
        billingCcType: inputData.creditCard
      }
    } else {
      payload = {
        'billingName': inputData.cardName,
        'billingAddress1': inputData.address1,
        'billingCity': inputData.city,
        'billingState': inputData.state,
        'billingZip': inputData.zipCode,
        'billingAmount': inputData.amount,
        'billingNumber': inputData.cardNum,
        'billingMonth': inputData.expMonth,
        'billingYear': inputData.expYear,
        'billingCvv': inputData.cvv,
        'billingCcType': inputData.creditCard
      }
    }

    const body = qs.stringify(payload)

    setLoading(true);
    const res = await APIService.post(url, body, headers);
    if (res.status === 200) {
      setAddStatus("success");
    } else {
      setAddStatus("fail");
    }
    setLoading(false);
  }

  const renderOptions = (start, end) => {
    let options = Array.from({ length: end - start + 1 }, (x, i) => {
      let val = start + i;
      if (val < 10) {
        val = '0' + String(val);
      }
      val = String(val);
      return <option value={val} key={val}>{val}</option>;
    })
    return options;
  }


  /* -------------------------------Long Form---------------------------------- */


  const renderLongForm = () => {
    return (
      <div>
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input name="cardName" type="text" placeholder="Company Name" className="form-control" value={inputData.cardName} onChange={handleInputChange} />
            <div className={formErrors.includes("cardName") ? "text-danger col-4" : "text-black-50 col-4"}><small >Required</small> </div>
          </div>
          <div className="col-lg-6 mb-4 mb-lg-0">
            <input name="company" type="text" placeholder="Company" className="form-control" value={inputData.company} onChange={handleInputChange} />
          </div>
        </div>
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input name="address1" type="text" placeholder="Address 1" className="form-control" value={inputData.address1} onChange={handleInputChange} />
            <div className={formErrors.includes("address1") ? "text-danger col-4" : "text-black-50 col-4"}><small >Required</small> </div>
          </div>
          <div className="col-lg-6 mb-4 mb-lg-0">
            <input name="address2" type="text" placeholder="Address 2" className="form-control" value={inputData.address2} onChange={handleInputChange} />
          </div>
        </div>
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input name="city" type="text" placeholder="City" className="form-control" value={inputData.city} onChange={handleInputChange} />
            <div className={formErrors.includes("city") ? "text-danger col-4" : "text-black-50 col-4"}><small >Required</small> </div>
          </div>
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input name="state" type="text" placeholder="State" className="form-control" value={inputData.state} onChange={handleInputChange} />
            <div className={formErrors.includes("state") ? "text-danger col-4" : "text-black-50 col-4"}><small >Required</small> </div>
          </div>
        </div>
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input name="zipCode" type="text" placeholder="Zip code" className="form-control" value={inputData.zipCode} onChange={handleInputChange} />
            <div className={formErrors.includes("zipCode") ? "text-danger col-4" : "text-black-50 col-4"}><small >Required</small> </div>
          </div>
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <select name="creditCard" className="form-control" value={inputData.creditCard} onChange={handleInputChange}>
              <option value="null">Credit Card Type</option>
              <option value="VI">Visa</option>
              <option value="mastercard">Mastercard</option>
            </select>
            <div className={formErrors.includes("creditCard") ? "text-danger col-4" : "text-black-50 col-4"}><small >Required</small> </div>
          </div>
        </div>
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" name="amount" placeholder="Amount" className="form-control" value={inputData.amount} onChange={handleInputChange} required />
            <div className={formErrors.includes("amount") ? "text-danger col-4" : "text-black-50 col-4"}><small >Required</small> </div>
          </div>
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="Card Number" className="form-control" name="cardNum" value={inputData.cardNum} onChange={handleInputChange} />
            <div className={formErrors.includes("cardNum") ? "text-danger col-4" : "text-black-50 col-4"}><small >Required</small> </div>
          </div>
        </div>
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <div className="d-flex">
              <select name="expMonth" id="" className="form-control me-2" value={inputData.expMonth} onChange={handleInputChange}>
                <option value="null">MM</option>
                {renderOptions(1, 12)}
              </select>
              <select name="expYear" id="" className="form-control me-2" value={inputData.expYear} onChange={handleInputChange}>
                <option value="null">YYYY</option>
                {renderOptions((new Date()).getFullYear(), (new Date()).getFullYear() + 20)}
              </select>
              <input name="cvv" type="text" placeholder="CVV" className="form-control" value={inputData.cvv} onChange={handleInputChange} />
            </div>

            <div className="row mb-lg-3 mb-md-3 mb-0">
              <div className={formErrors.includes("expMonth") ? "text-danger col-4" : "text-black-50 col-4"}><small >Required</small> </div>
              <div className={formErrors.includes("expYear") ? "text-danger col-4" : "text-black-50 col-4"}><small >Required</small> </div>
              <div className={formErrors.includes("cvv") ? "text-danger col-4" : "text-black-50 col-4"}><small >Required</small> </div>
            </div>
          </div>
          <div className='align-items-center col-lg-6 d-flex justify-content-end'>
            <div className="footAction d-flex">
              <div className="ms-auto">
                <div className="btn btn-link text-decoration-none" onClick={handleModalClose}>Cancel</div>
                <button type="submit" className="btn btn-primary w-150" onClick={handleBuyCredit}>AddFund</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* -------------------------------Small Form---------------------------------- */

  // * Render Small Add Fund form
  const renderAddFundForm = () => {
    return (
      <div className="p-4">
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" name="amount" placeholder="Amount" className="form-control" value={inputData.amount} onChange={handleInputChange} />
            <div className={formErrors.includes("amount") ? "d-block" : "d-none"}><small className="text-danger">Please enter valid amount</small> </div>
          </div>
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <select name="creditCard" className="form-control" value={inputData.creditCard} onChange={handleInputChange}>
              <option value="null">Credit Card Type</option>
              <option value="VI">Visa</option>
              <option value="mastercard">Mastercard</option>
            </select>
            <div className={formErrors.includes("creditCard") ? "d-block" : "d-none"}><small className="text-danger">Please select credit card type</small> </div>
          </div>
        </div>
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="Name on Card" className="form-control" name="cardName" value={inputData.cardName} onChange={handleInputChange} />
            <div className={formErrors.includes("cardName") ? "d-block" : "d-none"}><small className="text-danger">Please enter name on the card</small> </div>
          </div>
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="Card Number" className="form-control" name="cardNum" value={inputData.cardNum} onChange={handleInputChange} />
            <div className={!isValidCard || formErrors.includes("cardNum") ? "d-block" : "d-none"}><small className="text-danger">Enter a valid card number</small> </div>
          </div>
        </div>
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="Address" className="form-control" name="address" value={inputData.address} onChange={handleInputChange} disabled={true} />
            <div className={formErrors.includes("address") ? "d-block" : "d-none"}><small className="text-danger">Enter a valid address</small> </div>
          </div>
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <div className="d-flex">
              <select name="expMonth" className="form-control me-2" value={inputData.expMonth} onChange={handleInputChange}>
                <option value="null">MM</option>
                {renderOptions(1, 12)}
              </select>
              <select name="expYear" className="form-control me-2" value={inputData.expYear} onChange={handleInputChange}>
                <option value="null">YYYY</option>
                {renderOptions((new Date()).getFullYear(), (new Date()).getFullYear() + 20)}
              </select>
              <input name="cvv" type="text" placeholder="CVV" className="form-control" value={inputData.cvv} onChange={handleInputChange} />
            </div>
            <div className="row mb-lg-3 mb-md-3 mb-0">
              <div className={formErrors.includes("expMonth") ? "d-block col-4" : "d-none col-4"}><small className="text-danger">Required</small> </div>
              <div className={formErrors.includes("expYear") ? "d-block col-4" : "d-none col-4"}><small className="text-danger">Required</small> </div>
              <div className={formErrors.includes("cvv") ? "d-block col-4" : "d-none col-4"}><small className="text-danger">Required</small> </div>
            </div>
            <div className="footAction d-flex">
              <div className="ms-auto">
                <div className="btn btn-link text-decoration-none" onClick={handleModalClose}>Cancel</div>
                <button type="submit" className="btn btn-primary w-150" onClick={handleBuyCredit}>Buy Credit</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }

  /* ----------------------------------------------------------------- */

  const renderModalBody = () => {
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
                <h4 className="mb-2 successText">Funds added</h4>
                <p className="mb-2">You will see this funds in your balance</p>
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
                <h4 className="mb-2 errorText">Error in adding funds</h4>
                <p className="mb-2">We are sorry, we cannot verify your card</p>
                <div className="footAction">
                  <button className="btn btn-primary px-4" onClick={() => setAddStatus(null)}>Try with other card</button>
                </div>
              </div>
            </div>
          </div>
        )
        break;
      default:
        bodyHtml = (
          <div className="container">
            <div className="align-items-end d-flex justify-content-between mb-4">
              <div className="title ">
                <h2 className="text-start p-0 fw-28">Add Funds</h2>
              </div>
              {!loading &&
                <div className="me-4">
                  <CurrentFund addStatus={addStatus} />
                </div>
              }
            </div>
            {/* {billingAdd ? renderAddFundForm() : renderLongForm()} */}
            {billingAdd ? renderLongForm() : renderAddFundForm()}

            {/* <div className="footAction d-flex">
              <div className="ms-auto flex-lg-row flex-md-row flex-column-reverse d-flex w-100">
                <div className="btn btn-link text-decoration-none" onClick={handleModalClose}>Cancel</div>
                <button type="submit" className="btn btn-primary" onClick={handleBuyCredit}>Buy Credit</button>
              </div>
            </div> */}
          </div>
        );
        break;
    }
    return bodyHtml;
  }

  return (
    <div>
      <Modal isOpen={isModalOpen} closeBtn={handleModalClose} sizeClass={billingAdd && "long-scroll-modal addFund"}>
        {loading ? <Loader /> :
          renderModalBody()
        }
      </Modal>
    </div>
  )
}


export default AddFund