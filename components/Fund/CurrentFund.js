import Link from 'next/link'
import { useState, useEffect, useContext } from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import { convertXmltoJson } from '../../helper/helper';
import APIService from '../../helper/APIService';
import { NavContext } from '../Context/NavContextProvider'

const CurrentFund = (props) => {
  const { state: { sessionId, fundAddSuccess } } = useContext(NavContext);
  const { state, setState } = useContext(NavContext);
  const { showAddFund = false } = props;
  const [currentFund, setCurrentFund] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  useEffect(() => {
    getCurrentFund();
  }, [sessionId, fundAddSuccess])

  const getCurrentFund = async () => {
    setLoading(true);
    const res = await APIService.get('/credit');
    if (res.status === 200) {
      let { credit } = convertXmltoJson(res.data);
      setCurrentFund(credit.balance.text);
      setState({...state, fundAddSuccess: ""});
    } else {
      setError(true);
    }

    setLoading(false);
  }

  let className = !showAddFund ? "fundsPriceBox" : "w-230  mt-3";
  return (
    <div className={`priceTag_box ${className}`} >
      <div className="d-flex align-items-center justify-content-lg-center justify-content-around h-100">
        <a href="" className={`dollarCircle ${error && "me-0 ms-1"}`}>
            <Image src='/images/money-sign.svg' width={20} height={20}/>
          </a>
        {!error ?
          <h4 className="mb-0 d-flex flex-column me-3 fw-16 fw-bold">{!loading ? currentFund : 0}<small className="small textGray fw-normal">Balance</small></h4>
          : <small className="small textGray fw-normal fw-14 text-wrap ms-3">Unable to fetch fund</small>
        }
        {showAddFund &&
          <Link href="/addfund" scroll={false}><a className="text-decoration-none fw-bold fw-14 cw_blue">Add Funds</a></Link>
        }
      </div>
    </div>
  )
}
export default CurrentFund