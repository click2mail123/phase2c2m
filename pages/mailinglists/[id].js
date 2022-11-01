import { useState, useEffect } from 'react'
import {useRouter} from 'next/router'
import Modal from '../../components/Modal/Modal';
import Table from '../../components/Table/Table';
import { convertXmltoJson } from '../../helper/helper';
import APIService from '../../helper/APIService';
import Loader from '../../components/Shared/Loader';
import ErrorMessage from '../../components/Shared/ErrorMessage';

const MailingList = () => {

  const router = useRouter();
  const {id} = router.query;

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [addressList, setAddressList] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    router.push('/', undefined, {scroll: false});
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
  ];

  const renderMobileListItem = (row) => {
    return <div>
      <p className="mb-0">{row.name}</p>
      <p>{row.city}, {row.state}</p>
    </div>
  }

  return (
    <div>
      {!error ?
        <Modal isOpen={isModalOpen} closeBtn={handleModalClose}>
          {loading ? <Loader /> : <Table
            rows={renderRows()}
            columns={columns}
            tableHeader={"My Address List"}
            renderMobileListItem={renderMobileListItem}
            renderActions={() => { }}
            backButton
            handleBackButton={() => {
              router.push('/mailinglists', undefined, {scroll: false})
            }}
          />}
        </Modal>
        : <ErrorMessage message={errorMessage} handleErrorClose={() => {
          setError(false);
          router.back();
        }} />
      }
    </div>
  )
}

export default MailingList