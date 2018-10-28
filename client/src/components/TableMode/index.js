import React, { Component } from 'react';
import Table from '../Display/Table';
import connect from 'react-redux/es/connect/connect';
import * as actions from '../../actions';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import './main.css';

const styles = (theme) => ({
  root: {
    width: '100%'
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200
      }
    }
  }
});

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      anchorEl: null
    };
  }
  componentDidMount() {
    this.props.getEmployees();
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  changeHandler = (event) => {
    this.setState({ input: event.target.value });
  };

  submitHandler = (event) => {
    if (event.keyCode === 13) {
      this.props.setAndUseSearch(this.state.input);
      this.setState({ input: '' });
      event.preventDefault();
    }
  };

  profileHandler = (el) => {
    this.props.history.push(`/employees/${el._id}`);
    this.props.getOneEmployee(el._id);
  };

  deleteHandler = (id) => {
    this.props.deleteEmployee(id);
  };

  render() {
    if (this.props.employees.isFetching) {
      return <div>Getting data</div>;
    }
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const options = [
      <div onClick={this.props.resetSearch}>Show All Employee</div>,
      <div onClick={() => this.props.history.push(`/create`)}>Create New Employee</div>
    ];
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={this.handleClose}
              PaperProps={{
                style: {
                  maxHeight: 48 * 4.5,
                  width: 200
                }
              }}
            >
              {options.map((option) => (
                <MenuItem key={option} onClick={this.handleClose}>
                  {option}
                </MenuItem>
              ))}
            </Menu>
            <Typography className={classes.title} variant="title" color="inherit" noWrap>
              Employment Management System
            </Typography>
            <div className={classes.grow} />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <Input
                placeholder="Search…"
                disableUnderline
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                value={this.state.input}
                onChange={this.changeHandler}
                onKeyDown={this.submitHandler}
              />
            </div>
          </Toolbar>
        </AppBar>
        <div className="ui grid massive message">
          <Table
            employees={this.props.employees}
            getEmployees={this.props.getEmployees}
            search={this.props.search}
            profileHandler={this.profileHandler}
            deleteHandler={this.deleteHandler}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    employees: state.employees,
    search: state.search
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // Action to get all the employees
    getEmployees: () => {
      dispatch(actions.getAllEmployees());
    },
    setAndUseSearch: (text) => {
      dispatch(actions.setAndUseSearch(text));
    },
    resetSearch: () => {
      dispatch(actions.resetSearch());
    },
    deleteEmployee: (id) => {
      dispatch(actions.deleteEmployee(id));
    },
    getOneEmployee: (id) => {
      dispatch(actions.getOneEmployee(id));
    }
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MainPage)
);
