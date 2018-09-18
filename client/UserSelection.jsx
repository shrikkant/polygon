import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import Loader from './Loader'

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    dense: {
        marginTop: 16,
    },
    menu: {
        width: 200,
    },
});

class UserSelection extends React.Component {
  constructor(props) {
      let user = {};
      user.name = '';
      user.email = '';
      user.admin = false;
    super(props)

    this.state = {
        user: user
    }


    this.handleSelection = this.handleSelection.bind(this)
    this.handleChange = this.handleChange.bind(this)
      this.joinPoll = this.joinPoll.bind(this)

    this.props.getAvailableUsers((err, availableUsers) => {
    console.log('Available Users ****  ' + JSON.stringify(availableUsers));
    })
  }

  handleSelection(selectedUser) {
    this.props.register(selectedUser)
  }

    joinPoll(e) {
        let u = this.state.user;
        this.setState({user:u});
        this.handleSelection(this.state.user);
    };

    handleChange(prop, event) {
        let u = Object.assign({}, this.state.user);
        u[prop] = event.target.value;
        this.setState({user:u});
    }

    handleCheckboxChange(prop, event) {
        let u = Object.assign({}, this.state.user);
        u[prop] = event.target.checked;
        this.setState({user:u});
    }


    render() {
      const classes = this.props;
      const actions = [
          <FlatButton
              label="Cancel"

              onClick={this.props.close}
          />,
          <FlatButton
              label="Join Poll"
              primary
              onClick={() => this.handleSelection(this.state.user)}
          />


      ]

      return (

          <Dialog
              title="Enter your name"
              actions={actions}
              modal={false}
              open={true}
              onRequestClose={this.props.close}
              onExited={(e) => alert}>

              <div style={{padding:20}}>
                  <form onSubmit={this.joinPoll}>

                      <Grid container  alignItems="stretch" direction="column"  justify="space-between" spacing={32}>
                          <Grid>
                              <TextField
                                  id="outlined-name"
                                  label="Full name"
                                  className={classes.textField}
                                  value={this.state.user.name}
                                  defaultValue={'Shrikant'}
                                  margin="normal"
                                  onChange={(e) => this.handleChange('name', e)}
                                  variant="outlined"
                              style={{width:320}}/>
                          </Grid>
                          <Grid>

                              <Checkbox
                                  checked={this.state.user.admin}
                                  onChange={(e) =>this.handleCheckboxChange('admin',e)}
                                  value="admin"
                              />
                              I am admin
                          </Grid>
                      </Grid>
                  </form>

              </div>

          </Dialog>
      )
  }
}

UserSelection.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UserSelection);
