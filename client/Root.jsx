import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
//import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import MainLayout from './MainLayout';
import Home from './Home';
import Loader from './Loader';
import UserSelection from './UserSelection';
import Chatroom from './Chatroom';
import PollStats from './PollStats';
import TakePoll from './TakePoll';

import socket from './socket';

//injectTapEventPlugin()

export default class Root extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      user: null,
      isRegisterInProcess: false,
      client: socket(),
      chatrooms: null
    }

    this.onEnterChatroom = this.onEnterChatroom.bind(this)
    this.onLeaveChatroom = this.onLeaveChatroom.bind(this)
    this.getChatrooms = this.getChatrooms.bind(this)
    this.register = this.register.bind(this)
    this.renderUserSelectionOrRedirect = this.renderUserSelectionOrRedirect.bind(this)
    //  this.getUserCount = this.getUserCount.bind(this)

    this.getChatrooms()
  }




  onEnterChatroom(chatroomName, onNoUserSelected, onEnterSuccess) {

    if (!this.state.user)
      return onNoUserSelected()

    return this.state.client.join(chatroomName, (err, chatHistory) => {
      if (err)
        return console.error(err)
      return onEnterSuccess(chatHistory)
    })
  }

  onLeaveChatroom(chatroomName, onLeaveSuccess) {
    this.state.client.leave(chatroomName, (err) => {
      if (err)
        return console.error(err)
      return onLeaveSuccess()
    })
  }

  getChatrooms() {
    this.state.client.getChatrooms((err, chatrooms) => {
      this.setState({ chatrooms })
    })
  }

  register(name) {
    const onRegisterResponse = user => this.setState({ isRegisterInProcess: false, user })

    this.setState({ isRegisterInProcess: true })
    this.state.client.register(name, (err, user) => {
      if (err) {
        console.log('Error ' + err);
          return onRegisterResponse(null)
      } else {
          console.log('USER *** ' + user);
          return onRegisterResponse(user)
      }
    })
  }

  renderUserSelectionOrRedirect(renderUserSelection) {
    if (this.state.user) {
      return <Redirect to="/" />
    }

    return this.state.isRegisterInProcess
      ? <Loader />
      : renderUserSelection()
  }

  renderChatroomOrRedirect(chatroom, { history }) {
    if (!this.state.user) {
      return <Redirect to="/" />
    }

    const { chatHistory } = history.location.state

    return (
      this.state.user && this.state.user.admin ? <PollStats
          chatroom={chatroom}
          chatHistory={chatHistory}
          user={this.state.user}
          onLeave={
              () => this.onLeaveChatroom(
                  chatroom.name,
                  () => history.push('/')
              )
          }
          onSendMessage={
              (message, cb) => this.state.client.message(
                  chatroom.name,
                  message,
                  cb
              )
          }
          registerHandler={this.state.client.registerHandler}
          unregisterHandler={this.state.client.unregisterHandler}
          />:<TakePoll
        chatroom={chatroom}
        chatHistory={chatHistory}
        user={this.state.user}
        onLeave={
          () => this.onLeaveChatroom(
            chatroom.name,
            () => history.push('/')
          )
        }
        onSendMessage={
          (message, cb) => this.state.client.message(
            chatroom.id,
            message,
            cb
          )
        }
        registerHandler={this.state.client.registerHandler}
        unregisterHandler={this.state.client.unregisterHandler}
      />
    )
  }

  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <MainLayout user={this.state.user}>
            {
              !this.state.chatrooms
                ? <Loader />
                : (
                  <Switch>

                    <Route
                        exact
                        path="/"
                        render={
                            props => (
                                <Home
                                    getUserCount={this.state.client.getUserCount}
                                    user={this.state.user}
                                    chatrooms={this.state.chatrooms}
                                    onChangeUser={() => props.history.push('/user')}
                                    onEnterChatroom={
                                        chatroomID => this.onEnterChatroom(
                                            chatroomID,
                                            () => props.history.push('/user'),
                                            data => {
                                              console.log('Broadcased to me!!! ' );
                                                const rooms = Object.assign([], this.state.chatrooms);
                                                const lastMessage = data.log.slice(-1)[0];
                                                if (data.log.slice(-1)[0].event == 'NEW_USER') {
                                                 rooms.forEach(function (room) {

                                                     if (room.id == lastMessage.roomID) {
                                                         if (room.numMembers) {
                                                             room.numMembers++;
                                                         } else {
                                                             room.numMembers =1;
                                                         }
                                                     }
                                                 })
                                                }

                                                props.history.push({
                                                    pathname: '/polls/' + chatroomID,
                                                    state: {chatHistory:data.log, chatrooms:rooms}
                                                })
                                            }
                                        )
                                    }
                                />
                            )
                        }
                    />

                    <Route
                        exact
                        path="/user"
                        render={
                            (props) => {
                                const toHome = () => props.history.push('/')
                                return this.renderUserSelectionOrRedirect(() => (
                                    <UserSelection
                                        getAvailableUsers={this.state.client.getAvailableUsers}
                                        close={toHome}
                                        register={name => this.register(name, toHome)}
                                    />
                                ))
                            }
                        }
                    />



                    {
                      this.state.chatrooms.map(chatroom => (
                        <Route
                          key={chatroom.name}
                          exact
                          path={`/polls/${chatroom.id}`}
                          render={
                            props => this.renderChatroomOrRedirect(chatroom, props)
                          }
                        />
                      ))
                    }
                  </Switch>
                )
            }
          </MainLayout>
        </MuiThemeProvider>
      </BrowserRouter>
    )
  }
}
