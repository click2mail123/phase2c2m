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
  const [gridView, setGridView] = useState(true);


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

  const renderGridView = () => {
    const gridList = filteredRows.map(x => {
      return (
      <div className="col-md-4 col-6 pe-1 ps-1" key={person.id}><div className="boxGrid"><a href="#"><img src="/images/folder.svg" alt="" className="img-fluid me-2" /><span>{x.name}</span></a></div></div>
      )
    })
    return gridList;
  }

  return (
    <div>
      <div className="d-flex align-items-center">
        {backButton && <span onClick={handleBackButton}>
          <Image src="/images/arrow.svg" alt="" className="titlearrow" width={12} height={20} />
        </span>}
        <h2 className="d-inline my-0 mx-auto">{tableHeader}</h2>
      </div>
      {/* <div className="d-flex justify-content-between align-items-center row  py-1 border-bottom-0"> */}
      {/* <div className="col-lg-4 col-12 ">
          <TableSearch
            value={searchText}
            onChange={(e) => requestSearch(e.target.value)}
            clearSearch={() => requestSearch('')} />
        </div> */}
      {/* <div className="d-flex justify-content-end align-items-center col-lg-4 col-12 d-none d-lg-flex d-md-flex">
          <span className="me-2">Show</span>
          <select name="pageSize" id="pageSize" className="form-control w-auto" value={pageSize}
            onChange={e => setPageSize(e.target.value)}>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
          <span className="ms-2">Entries</span>
        </div> */}
      {/* </div> */}
      <div className="row m-0">
        <div className="d-flex justify-content-between align-items-center border p-1 border-bottom-0">
          <div className="slebox">PDFs</div>
          <div className="input-group c2_search mx-2 border-0  mt-lg-0">
            <span className="input-group-text bg-transparent border-0 "><img src="images/search.svg" /></span>
            {/* <input type="search" className="form-control border-0 ps-0" placeholder="Search List" /> */}
            <TableSearch
              value={searchText}
              onChange={(e) => requestSearch(e.target.value)}
              clearSearch={() => requestSearch('')} />
          </div>
          <div className="slebox greybx">
            <button onClick={() => setGridView(!gridView)}><img id="imgtoggle" src={gridView ? "images/bar.svg" : "images/grid.svg"} alt="" /></button>
          </div>
        </div>
      </div>
      <div className="table-container">
        {!isMobile ?
          gridView ?
            <DataGrid
              className={hideSelectAll && "hideSelectAll"}
              rows={filteredRows}
              columns={columns}
              // pageSize={pageSize}
              // rowsPerPageOptions={[5,10]}
              checkboxSelection={checkbox}
              selectionModel={selectedRows}
              onSelectionModelChange={rowSelectionHandler}
            /> :
            <div className="row border fixedHeight">{renderGridView()}</div>
          :
          renderMobileList()
        }
      </div>
    </div>
  )
}

export default Table