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

    const { pollStats } = props

    this.state = {
      pollStats:[]
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
    console.log('onMessageReceived:', entry);
    this.updateChatHistory(entry)
  }

    updateChatHistory(entry) {

        if (entry.event != 'NEW_RESPONSE')
          return;

        let newStats = Object.assign([],this.state.pollStats);


        console.log(entry);
        let answerPushed = false;

        newStats.forEach(function (a) {
            if (entry.message && (a.id == entry.message.answer.id)) {
                a.count++;
                answerPushed = true;
            }
        })

        if (!answerPushed) {
            let newEntry = Object.assign({}, entry.message.answer);
            newEntry.count = 1;
            newStats.push(newEntry);
        }

        console.log('Poll Stats ' + JSON.stringify(newStats));



        this.setState({ pollStats: newStats})
    }


  render() {
    return (
    <Paper
        style={{ maxWidth: 600, marginBottom: 0}}
        zDepth={5}>
      <Wrapper>
        <Card>
          <CardTitle title={this.props.chatroom.name} style={{background:'#f7f7f7',borderBottom:'1px solid #ccc'}}/>

          <Grid container style={{flexGrow:1,padding:20}} spacing={32} >

              <Grid container  direction="column"  justify="space-between" spacing={32}>

                  {
                    this.state.pollStats.map(answer => (
                      <Grid key={answer.id} item>
                            {answer.text} {answer.count}

                      </Grid>
                  ))}
            </Grid>

          </Grid>
        </Card>
      </Wrapper>


    </Paper>
    )
  }
}
