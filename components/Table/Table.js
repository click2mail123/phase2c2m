import { useState, useEffect, useContext } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import TableSearch from './TableSearch';
import { NavContext } from '../Context/NavContextProvider'
import ListItem from '../Shared/ListItem';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const AddressBookDropdown = dynamic(() => import('../AddressBook/AddressBookDropdown'))

/*
@Params
- rows              --> Array of row data
- columns           --> array of columns 
- tableHeader       --> Header title for the table
- checkbox           --> boolean to show/hide checkbox selection
- backButton          --> boolean to show/hide backButton
- selectedRows        --> array of selected rows ids
- rowSelectionHandler     --> function to handle row selection
- hideSelectAll        --> boolean to show/hide select all checkbox
- renderActions         --> function to render actions column
- renderMobileListItem   --> function to render individual mobile list item 
- showAddressBookDropdown   --> boolean to show address book dropdown (false by default)
- currentDropdownValue      --> Current value of selected option in dropdown
- dropdownChangeHandler    --> function to handle address book dropdown select
*/

const Table = (props) => {
  const { rows, columns, checkbox, tableHeader, renderMobileListItem, renderActions, backButton, selectedRows, rowSelectionHandler, hideSelectAll, showAddressBookDropdown = false, currentDropdownValue = null, dropdownChangeHandler } = props;
  const { state: { isMobile } } = useContext(NavContext);
  const router = useRouter();
  const [filteredRows, setFilteredRows] = useState(rows)
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(5);


  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);


  const escapeRegExp = (value) => {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const newRows = rows.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setFilteredRows([...newRows])
  };

  const handleListSelection = (e, id) => {
    let isSelect = e.target.checked;
    let copyRows = [...selectedRows]
    if (isSelect) {
      copyRows.push(id);
      rowSelectionHandler(copyRows);
    } else {
      const newRows = copyRows.filter(row => row !== id);
      rowSelectionHandler(newRows);
    }
  }

  const renderMobileList = () => {
    console.log("MObileViewLIST")
    const mobileList = filteredRows.map(listItem => {
      let itemBody = renderMobileListItem(listItem);
      return <ListItem key={listItem.id}
        id={listItem.id}
        itemBody={itemBody}
        actions={renderActions(listItem.id)}
        checkbox={checkbox}
        isChecked={selectedRows && selectedRows.length > 0 && selectedRows.includes(listItem.id)}
        selectionHandler={(e) => handleListSelection(e, listItem.id)}
      />
    })
    return mobileList;
  }

  return (
    <div>
      <div className="d-flex align-items-center mb-2">
        {backButton && <span onClick={() => { router.back() }}><img src="/images/arrow.svg" alt="" className="titlearrow" /></span>}
        <h4 className="d-inline my-1 mx-auto fw-bold headerfont">{tableHeader}</h4>
      </div>
      <div className="row m-0">
        <div className="d-flex justify-content-between align-items-center border p-1 border-bottom-0 search-menu">
          {showAddressBookDropdown && <div className="col-lg-4 col-12 ">
            <AddressBookDropdown
              currentDropdownValue={currentDropdownValue}
              dropdownChangeHandler={dropdownChangeHandler} />
          </div>}
          <div className="input-group c2_search border-0 mx-2 mt-lg-0 search-bar">
            <span className="input-group-text bg-transparent border-0 "><img src="/images/search.svg" /></span>
            <TableSearch
              value={searchText}
              onChange={(e) => requestSearch(e.target.value)}
              clearSearch={() => requestSearch('')} />
          </div>

          <div className="d-flex justify-content-end align-items-center col-lg-4 col-12 d-none d-lg-flex d-md-flex">
            <span className="me-2">Show</span>
            <select name="pageSize" id="pageSize" className="form-control w-auto" value={pageSize}
              onChange={e => setPageSize(e.target.value)}>
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
            <span className="ms-2">Entries</span>
          </div>
        </div>
      </div>
      {/* <div>
        {isMobile ? <h6>Sent by</h6> : ""}
      </div> */}

      <div className="table-container table-design">
        {!isMobile ?
          <DataGrid
            className={hideSelectAll && "hideSelectAll"}
            rows={filteredRows}
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[5, 10]}
            checkboxSelection={checkbox}
            selectionModel={selectedRows}
            onSelectionModelChange={rowSelectionHandler}
            disableSelectionOnClick
          /> :
          renderMobileList()
        }
      </div>
    </div>
  )
}

export default Table