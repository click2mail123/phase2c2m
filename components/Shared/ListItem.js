/*
@Params
    - id              --> Unique id for selection
    - itemBody           --> HTML to render as body 
    - actions           --> HTML to render as actions 
    - checkbox           --> boolean to show/hide checkbox selection
    - isChecked          --> boolean to determine checked state
    - selectionHandler        --> Function to handle selection
*/
const ListItem = (props) => {
  const { id, itemBody, actions, checkbox, isChecked, selectionHandler } = props;
  return (
    <div>
      <div className="align-items-start d-flex justify-content-between col-12 mb-2 p-1">
        <div className="d-flex">
          <div className="form-group me-2">
            {checkbox &&
              <>
                <input id={id} type="checkbox" checked={isChecked} onChange={selectionHandler}/>
                <label htmlFor={id}></label>
              </>}
          </div>
          {itemBody}
        </div>
        <div className="table-actions">{actions}</div>
      </div>
    </div>
  )
}

export default ListItem