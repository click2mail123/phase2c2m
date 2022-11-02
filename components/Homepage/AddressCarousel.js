import { useState, useEffect, useContext } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import Image from 'next/image';
import APIService from '../../helper/APIService';
import { convertXmltoJson } from '../../helper/helper';
import { NavContext } from '../Context/NavContextProvider';
import ErrorMessage from '../Shared/ErrorMessage';
const Loader = dynamic(() => import('../Shared/Loader'))

const AddressCarousel = () => {
  const router = useRouter();
  const { state, setState } = useContext(NavContext);
  const { selectedMailingList, jobId, documentId } = state

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchCostBreakdown = async (jobId) => {
    const res = await APIService.get(
      `/jobs/${jobId}/cost?paymentType=Invoice&details=true`);
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
        setState({ ...state, costBreakdown: { ...costBreakdown } });
      }
    } else {
       let message = "Please wait 5 minutes and try again. One of our APIs has not responded in time."
        message = convertXmltoJson(res.data.data)
        message =  message?.job?.description?.text;
        if(message.includes('Maximum')){
          let numOfPages = message.slice(-4)
          message = `File size is too big, Max number of supported pages are ${numOfPages}`
       }
      setError(true);
      setErrorMessage({ heading: message});
    }
  }


  const fetchAddressList = async (id) => {
    const res = await APIService.get(`/addressLists/info?baseAddressListId=${id}`);
    if(res.status === 200){
      let { addresses: addList } = convertXmltoJson(res.data);
      return addList.address;
    }else{
      setError(true);
      setErrorMessage({ heading: "Please wait 5 minutes and try again. One of our APIs has not responded in time."});
      return {};
    }
  }

  const fetchAllAddresses = async () => {
    if (selectedMailingList && selectedMailingList.length > 0) {
      const newAddresses = [];
      setLoading(true)
      for (let i = 0; i < selectedMailingList.length; i++) {
        let addRes = await fetchAddressList(selectedMailingList[i]);
        if (Array.isArray(addRes)) {
          newAddresses.push(...addRes);
        } else {
          newAddresses.push(addRes);
        }
      }
      await fetchCostBreakdown(jobId);
      setLoading(false);
      setAddresses(newAddresses);
    }
  }

  useEffect(() => {
    if (selectedMailingList && selectedMailingList.length > 0) {
      fetchAllAddresses();
    }
  }, [selectedMailingList])

  const handleAddressClick = () => {
    if(documentId){
      router.push('/mailinglists', undefined, {scroll: false})
    }else{
      alert("Upload Document First")
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="mb-0 fw-16 fw-bold themeBlack">Addresses (<span>{addresses.length}</span>)</h4>
        <a href="#" onClick={handleAddressClick}>
          <Image src="/images/edit.svg" alt="Edit Button" width={15} height={15}/>
          </a>
      </div>
      <div id="demo" className="carousel slide" data-bs-ride="carousel">
        {/* <!-- The slideshow/carousel --> */}
        {!error ? 
        loading ? <Loader /> :
          <div className="carousel-inner addressBlock">
            {addresses.map((address, i) => (
              <div className={`carousel-item ${i === 0 && 'active'}`} key={address.id.text}>
                <div className="carousel-caption">
                  <address>
                    <div>{address.name.text}</div>
                    <div>{address.address1.text}</div>
                    <div>{address.city.text} {address.state.text} {address.postalCode.text} </div>
                  </address>
                </div>
              </div>
            ))}
          </div> : <ErrorMessage message={errorMessage} handleErrorClose={() => {
            setError(false);
            setAddresses([]);
          }}/>
        }
        {/* <!-- Left and right controls/icons --> */}
        <button className="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
          <Image src='/images/arrow.svg' width={20} height={20} alt='prev-button'className="ro-180"/>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
          <Image src='/images/arrow.svg' width={20} height={20} alt='next-button' />
        </button>
      </div>
    </div>
  )
}

export default AddressCarousel
