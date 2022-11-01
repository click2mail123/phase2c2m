import { useState, useContext, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { NavContext } from '../Context/NavContextProvider';
import { convertXmltoJson } from '../../helper/helper';
import APIService from '../../helper/APIService';
const Loader = dynamic(() => import('../Shared/Loader'))

const ReturnAddress = () => {
  const { state } = useContext(NavContext);
  const { sessionId } = state;

  const [returnAdd, setReturnAdd] = useState();
  const [loading, setLoading] = useState(false);

//   const fetchReturnAddresss = async () => {
//     setLoading(true);
//     const res = await APIService.get(`/account/addresses?addressType=Return address`);
//     if (res.status === 201 || res.status === 200) {
//       let xmlRes = convertXmltoJson(res.data);
//       let { account: { addresses: { address } } } = xmlRes;
//       if (address) {
//         if (Array.isArray(address)) {
//           setReturnAdd([...address]);
//         } else {
//           setReturnAdd([address])
//         }
//       }
//     }
//     setLoading(false);
//   }
  

   const fetchReturnAddresss = async () => {
    setLoading(true);
    const res = await APIService.get(`/account/addresses?addressType=Return address`);
    if (res.status === 201 || res.status === 200) {
      let xmlRes = convertXmltoJson(res.data);
      let { account: { addresses: { address } } } = xmlRes;
      if (address) {
        if (Array.isArray(address)) {
          let defaultadd;
          if(address && address.length > 0 ){
            address && address.map(add => {
              if(add.default.text == 'true'){
                defaultadd = add
              }
            })
          }
          // setReturnAdd([...address]);
          setReturnAdd([defaultadd]);
        } else {
          setReturnAdd([address])
        }
      }
    } else {

    }
    setLoading(false);
  }

  useEffect(() => {
    fetchReturnAddresss();
  }, [sessionId])
  return (
    <div>
      {loading ? <Loader /> :
        <div>
          {returnAdd && returnAdd.length > 0 ?
            <address>
              <div>{returnAdd[0].name.firstName.text} {returnAdd[0].name.lastName.text}</div>
              <div>{returnAdd[0].address1.text}, </div>
              <div>{returnAdd[0].city.text} {returnAdd[0].state.text} {returnAdd[0].zip.text}</div>
            </address>
            : "Unable to fetch return address"
          }
        </div>
      }
    </div>
  )
}

export default ReturnAddress
