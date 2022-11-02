import { useState, useEffect, useContext } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import TableSearch from './TableSearch';
import { NavContext } from '../Context/NavContextProvider'
import ListItem from '../Shared/ListItem';
import Image from 'next/image';

/*
@Params
    - rows              --> Array of row data
    - columns           --> array of columns 
    - tableHeader       --> Header title for the table
    - checkbox           --> boolean to show/hide checkbox selection
    - backButton          --> boolean to show/hide backButton
    - handleBackButton     ---> function to handle backbutton
    - selectedRows        --> array of selected rows ids
    - rowSelectionHandler     --> function to handle row selection
    - hideSelectAll        --> boolean to show/hide select all checkbox
    - renderActions         --> function to render actions column
    - renderMobileListItem   --> function to render individual mobile list item 
*/

const Table = (props) => {
  const { rows, columns, checkbox, tableHeader, renderMobileListItem, renderActions, backButton, handleBackButton, selectedRows, rowSelectionHandler, hideSelectAll } = props;
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
      <div className="d-flex align-items-center">
        {backButton && <span onClick={handleBackButton}>
          <Image src="/images/arrow.svg" alt="" className="titlearrow" width={12} height={20}/>
          </span>}
        <h2 className="d-inline my-0 mx-auto">{tableHeader}</h2>
      </div>
      <div className="d-flex justify-content-between align-items-center row  py-1 border-bottom-0">
        <div className="col-lg-4 col-12 ">
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

      <div className="table-container">
        {!isMobile ?
          <DataGrid
            className={hideSelectAll && "hideSelectAll"}
            rows={filteredRows}
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[5,10]}
            checkboxSelection={checkbox}
            selectionModel={selectedRows}
            onSelectionModelChange={rowSelectionHandler}
          /> :
          renderMobileList()
        }
      </div>
    </div>
  )
}

export default Table