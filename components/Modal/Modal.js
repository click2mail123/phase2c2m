import PropTypes from "prop-types";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import CloseIcon from '@mui/icons-material/Close';

/*
@Params
    - isOpen              --> boolean to hide/show modal
    - hideCloseButton       --> boolean to hide/show close button
    - closeBtn           --> function to handle modal close
    - handleClick           --> function to handle modal click
*/
const Modal = (props) => {
  const { isOpen, closeBtn, hideCloseButton, handleClick ,sizeClass } = props;
  let className = `custom-modal ${sizeClass ? sizeClass : ""}`;
  const handleClose = () => {
    closeBtn();
  }
  if (isOpen) {
    return (
      <div onClick={handleClick}>
        <div className="overlay" onClick={closeBtn}></div>
        <ReactCSSTransitionGroup
          transitionName={""}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          <div className={className}>
            {hideCloseButton ? null :
              <button
                className={"close-btn"}
                onClick={handleClose}
              ><CloseIcon/></button>
            }
            {props.children}
          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
  } else {
    return (
      <ReactCSSTransitionGroup
        transitionName={" "}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      />
    );
  }
};

export default Modal;

Modal.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  closeBtn: PropTypes.func,
  handleClick: PropTypes.func,
};
