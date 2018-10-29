import React, { Component } from 'react';
import * as actions from '../../actions';
import connect from 'react-redux/es/connect/connect';
import { Button, Card, Image } from 'semantic-ui-react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class Profile extends Component {
  componentDidMount() {
    this.props.getOneEmployee(this.props.match.params.id);
  }

  editHandler = (obj) => {
    this.props.setEmployeeToEdit(obj);
    this.props.history.push(`/edit/${obj._id}`);
  };

  render() {
    if (this.props.employees.profile === undefined) {
      return <div>Loading Data</div>;
    } else {
      const profile = this.props.employees.profile;
      let avatarUrl = '';
      if (profile.avatar !== 'Icon') {
        avatarUrl = 'http://localhost:4000/' + profile.avatar;
      } else {
        if (profile.gender === 'Male') {
          avatarUrl = 'http://localhost:4000/defaultMale.png';
        } else {
          avatarUrl = 'http://localhost:4000/defaultFemale.png';
        }
      }
      return (
        <div>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="title" color="inherit" noWrap>
                {`${profile.name}'s Profile`}
              </Typography>
              <div />
            </Toolbar>
          </AppBar>

          <div className="ui grid massive message">
            <div className="ui container ">
              <div className="ui centered card ">
                <Card key={profile.id}>
                  <Card.Content>
                    <Image floated="right" size="mini" src={avatarUrl} />
                    <Card.Header>{profile.name}</Card.Header>
                    <Card.Meta>
                      A {profile.gender} {profile.title}
                    </Card.Meta>
                    <Card.Description>{profile.cell}</Card.Description>
                    <Card.Description>{profile.email}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Button
                      basic
                      color="red"
                      style={{ display: 'block', margin: '0 auto' }}
                      onClick={() => this.editHandler(profile)}
                    >
                      Edit
                    </Button>
                  </Card.Content>
                </Card>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
const mapStateToProps = (state) => {
  return {
    employees: state.employees
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOneEmployee: (id) => {
      dispatch(actions.getOneEmployee(id));
    },
    setEmployeeToEdit: (obj) => {
      dispatch(actions.setEmployeeToEdit(obj));
    },
    resetOneEmployee: () => {
      dispatch(actions.resetOneEmployee());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
