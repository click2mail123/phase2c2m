import Modal from '../Modal/Modal'

/*
@Params
    - variant            --> String to detrmine error/success design
    - message            --> An object that contain mheading and body string
        |  - heading              --> String Heading text for error
        | - body                --> String text for smaller body 
    - handleErrorClose      --> Function to handle error close
*/
const ErrorMessage = (props) => {
  const { variant } = props;
  const {heading = "Something went wrong!", body = "Please try again"} = props.message;
  const {className = ""} = props;
  return (
    <Modal isOpen={true} closeBtn={props.handleErrorClose} sizeClass="small-modal">
      <div className="modal-content border-0">
        <div className="modal-header border-0 pb-0 pt-1">
        </div>
        <div className="modal-body">
          <div className="text-center">
            {variant === "success" ? <a href="#" className="mb-2 successCircle" ><img src="/images/check.svg" alt="" /></a> :
              <a href="#" className="mb-2"><img src="/images/info.svg" alt="" /></a>
            }
            <h4 className={`mb-2 ${variant === "success" ? "successText" : "errorText"}`}>{heading}</h4>
            <p className="mb-2">{body}</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ErrorMessage
