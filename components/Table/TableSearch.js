import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

/*
@Params
    - value              --> Current value of search field
    - onChange           --> function to handle input change
    - clearSearch        --> function to handle clear search
*/
const TableSearch = (props) => {
  const { value, onChange, clearSearch } = props;
  return (
    <>
      <div className="table-search-container">
        <TextField
          variant="standard"
          value={value}
          onChange={onChange}
          placeholder="Search List"
          className='form-control border-0 ps-0'
          // InputProps={{
          //   startAdornment: <SearchIcon fontSize="small" />,
          //   endAdornment: (
          //     <IconButton
          //       title="Clear"
          //       aria-label="Clear"
          //       size="small"
          //       style={{ visibility: value ? 'visible' : 'hidden' }}
          //       onClick={clearSearch}
          //     >
          //       <ClearIcon fontSize="small" />
          //     </IconButton>
          //   ),
          // }}
          sx={{
            width: {
              xs: 1,
              sm: 'auto',
            },
            m: (theme) => theme.spacing(1, 0.5, 1.5),
            '& .MuiSvgIcon-root': {
              mr: 0.5,
            },
            // '& .MuiInput-underline:before': {
            //   // borderBottom: 1,
            //   // borderColor: 'divider',
            // },
          }}
        />
      </div>
    </>
  );
}

TableSearch.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default TableSearch