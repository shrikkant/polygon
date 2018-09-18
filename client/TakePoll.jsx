import React from 'react';
import styled from 'styled-components'

import Paper from 'material-ui/Paper';
import { Card, CardTitle } from 'material-ui/Card';
import AnswerChoice from './AnswerChoice';
import Grid from '@material-ui/core/Grid';


const Wrapper = styled.div`
  cursor: pointer;
`



const ChatWindow = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  width: 420px;
  box-sizing: border-box;
`
const ChatPanel = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  z-index: 1;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 20px ;
  z-index: 1;
  color: #fafafa !important;
  border-bottom: 1px solid;
`

const Title = styled.p`
  text-align: center;
  font-size: 24px;
`

const NoDots = styled.div`
  hr {
    visibility: hidden;
  }
`

const OutputText = styled.div`
  white-space: normal !important;
  word-break: break-all !important;
  overflow: initial !important;
  width: 100%;
  height: auto !important;
  color: #fafafa !important;
`

const InputPanel = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  align-self: center;
  border-top: 1px solid #fafafa;
`

const ChatroomImage = styled.img`
  position: absolute;
  top: 0;
  width: 100%;
`

const Scrollable = styled.div`
  height: 100%;
  overflow: auto;
`

export default class TakePoll extends React.Component {

  constructor(props, context) {
    super(props, context)

    const { chatHistory, chatroom } = props

    this.state = {
      chatroom,
      chatHistory,
      input: '',
        selection:{}
    }

    this.onInput = this.onInput.bind(this)
    this.onSendMessage = this.onSendMessage.bind(this)
    this.onMessageReceived = this.onMessageReceived.bind(this)
    this.updateChatHistory = this.updateChatHistory.bind(this)
  }

  componentDidMount() {
    this.props.registerHandler(this.onMessageReceived)
  }

  componentDidUpdate() {

  }

  componentWillUnmount() {
    this.props.unregisterHandler()
  }

  onInput(e) {
    this.setState({
      input: e.target.value
    })
  }

  onSendMessage(answer) {
    console.log('Submitting Answer ****** ' + JSON.stringify(answer));

    if (!answer)
      return

    this.props.onSendMessage(answer, (err) => {
      if (err)
        return console.error(err)


    })
  }

  onMessageReceived(entry) {
    console.log('onMessageReceived:', entry)
    this.updateChatHistory(entry)
  }

  updateChatHistory(entry) {
      let newroom = Object.assign({}, this.state.chatroom);

      const rooms = Object.assign([], this.state.chatrooms);

      if (newroom.id == entry.roomID) {
          console.log('turing active!!!')
          newroom.started = true;
      }

      this.setState({ chatHistory: this.state.chatHistory.concat(entry), chatroom:newroom})

  }


  render() {
    if (this.state.chatroom.started) {
        return (

            <Paper
                zDepth={5}>
              <Wrapper style={{height:'100%'}}>
                <Card>
                  <CardTitle title={this.state.chatroom.name}
                             style={{background: '#f7f7f7', borderBottom: '1px solid #ccc'}}/>

                  <Grid container style={{flexGrow: 1, padding: 20}} spacing={32}>
                    <Grid item xs={12}>
                      <Grid container direction="column" justify="space-between" spacing={32}>
                          {this.state.chatroom.answers.map(answer => (
                              <Grid key={answer.id} item>
                                <Paper style={{
                                    height: 120,
                                    width: '100%',
                                }}>
                                  <AnswerChoice title={answer.text}
                                                onClick={() => this.onSendMessage({answer: answer})}/>
                                </Paper>
                              </Grid>
                          ))}
                      </Grid>
                    </Grid>

                  </Grid>

                </Card>
              </Wrapper>
            </Paper>
        )
    } else {
      return (

      <Paper
          style={{maxWidth: 600, marginBottom: 40}}
          zDepth={5}>
        <Wrapper>
          <Card>
            <CardTitle title={this.state.chatroom.name}
                       style={{background: '#f7f7f7', borderBottom: '1px solid #ccc'}}/>

            <Grid container style={{flexGrow: 1, padding: 20}} spacing={32}>
              <Grid container style={{flexGrow: 1, padding: 20}} spacing={32}>
                <Grid item xs={12}>
                  Your poll will start anytime. {this.state.chatroom.numMembers} attendes.
                </Grid>
              </Grid>

            </Grid>

            <Paper>

            </Paper>
          </Card>
        </Wrapper>
      </Paper>


      )
    }
  }
}
