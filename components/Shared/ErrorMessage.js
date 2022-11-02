import Modal from '../Modal/Modal'

/*
@Params
    - heading              --> String Heading text for error
    - body                --> String text for smaller body 
*/
const ErrorMessage = (props) => {
  const {heading = "Something went wrong!", body = "Please try again"} = props.message;
  const {className = ""} = props;
  return (
    <Modal isOpen={true} closeBtn={props.handleErrorClose} sizeClass={`small-modal ${className}`}>
      <div className="modal-content border-0">
        <div className="modal-header border-0 pb-0 pt-1">
        </div>
        <div className="modal-body">
          <div className="text-center">
            <a href="#" className="mb-2">
              <img src="/images/info.svg" alt=""/>
            </a>
            <h4 className="mb-2 errorText">{heading}</h4>
            <p className="mb-2">{body}</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ErrorMessage
