import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import APIService from '../../helper/APIService'
import { convertXmltoJson } from '../../helper/helper'

const AddressBookDropdown = ({ currentDropdownValue = null, dropdownChangeHandler }) => {
  const router = useRouter();
  const { pathname } = router;
  const [books, setBooks] = useState([]);

  const getAllAddressBooks = async () => {
    const res = await APIService.get("/addressBook");
    const { listOfAddressbooks: { addressbooks: { addressBook } } } = convertXmltoJson(res.data)
    setBooks([...addressBook]);
  }

  useEffect(() => {
    getAllAddressBooks();
  }, [])


  const renderOptions = () => {
    const options = books.map(book => {
      return <option key={book.id.text} value={book.id.text}>{book.name.text}</option>
    });

    return options;
  }

  const handleSelect = (e) => {
    let addressBookId = e.target.value;
    dropdownChangeHandler(addressBookId);
  }

  return (
    <select className="form-control" onChange={handleSelect} value={currentDropdownValue}>
      <option value="null">Select Address Book</option>
      {renderOptions()}
      {pathname === '/contacts' && <option value="newBook">Create New Address Book</option>}
      {pathname === '/contacts' && <option value="manageBook">Manage Address Book</option>}
    </select>
  );
}

export default AddressBookDropdown;
