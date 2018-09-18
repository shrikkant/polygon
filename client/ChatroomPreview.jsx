import React from 'react';
import styled from 'styled-components'
import Paper from 'material-ui/Paper';
import { Card, CardMedia, CardTitle, CardHeader } from 'material-ui/Card';
import AnswerChoice from './AnswerChoice';
import Grid from '@material-ui/core/Grid';

const Wrapper = styled.div`
  cursor: pointer;
`

const getCardTitleStyle = () => ({
  display: 'flex',
  alignItems: 'center'
})

class UserSelection extends React.Component {
    constructor(props) {
        super(props)
    }


    render() {

        return (
            <Paper style={{maxWidth: 600, marginBottom: 40}} zDepth={5}>
              <Wrapper>
                <Card>

                  <CardHeader
                      title={this.props.chatroom.name + ' : ' + this.props.chatroom.numMembers + ' users'}
                      subheader="Users"/>

                  <Grid container style={{flexGrow: 1, padding: 20}} spacing={32}>
                    <AnswerChoice title={this.props.user && this.props.user.admin ? 'Start Poll For All' : 'Start Poll'}
                                  onClick={this.props.onEnter}/>
                  </Grid>

                </Card>
              </Wrapper>


            </Paper>

        )
    }
}

export default UserSelection;
