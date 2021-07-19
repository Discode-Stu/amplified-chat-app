import React, { createRef, useEffect, useState, useRef } from "react"
import API, { graphqlOperation } from "@aws-amplify/api"
import { messagesByChannelID } from "../graphql/queries"
import "@aws-amplify/pubsub"
import { onCreateMessage } from "../graphql/subscriptions"
import { createMessage } from "../graphql/mutations"
import { Auth } from "@aws-amplify/auth"
import Emojis from "../emoji/emoji"
import { ReactComponent as Smiley } from "../images/smiley.svg"
import "../App.css"
import { useAppContext } from "../contextLib/appContext"
import { S3Image } from "aws-amplify-react"

function Channel({ channel }) {
  const inputRef = createRef()
  const [cursorPosition, setCursorPosition] = useState()
  const [showEmojis, setShowEmojis] = useState(false)

  const [messages, setMessages] = useState([])
  const [messageBody, setMessageBody] = useState("")
  const [userInfo, setUserInfo] = useState(null)

  const { plan } = useAppContext()

  useEffect(() => {
    console.log("channel 26", channel)
  }, [])

  useEffect(() => {
    Auth.currentUserInfo().then((userInfo) => {
      setUserInfo(userInfo)
    })
  }, [])

  useEffect(() => {
    API.graphql(
      graphqlOperation(messagesByChannelID, {
        channelID: channel,
        sortDirection: "ASC",
      })
    )
      .then((response) => {
        const items = response?.data?.messagesByChannelID?.items
        if (items) {
          setMessages(items)
        }
      })
      .catch((e) => console.log("catch error", e))
  }, [channel])

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
    ).subscribe({
      next: (event) => {
        if (event.value.data.onCreateMessage.channelID === channel) {
          setMessages([...messages, event.value.data.onCreateMessage])
        }
      },
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [messages])

  const handleChange = (event) => {
    setMessageBody(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    const input = {
      channelID: channel,
      author: userInfo.id,
      username: userInfo.username,
      avatar: plan,
      body: messageBody.trim(),
    }

    try {
      setMessageBody("")
      await API.graphql(graphqlOperation(createMessage, { input }))
    } catch (error) {
      console.warn(error)
    }
  }

  const pickEmoji = (e, { emoji }) => {
    const ref = inputRef.current
    ref.focus()
    const start = messageBody.substring(0, ref.selectionStart)
    const end = messageBody.substring(ref.selectionStart)
    const text = start + emoji + end
    setMessageBody(text)
    setCursorPosition(start.length + emoji.length)
  }

  const handleShowEmojis = () => {
    inputRef.current.focus()
    setShowEmojis(!showEmojis)
  }

  useEffect(() => {
    inputRef.current.selectionEnd = cursorPosition
  }, [cursorPosition])

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="container">
      <div className="messages">
        <div className="messages-scroller">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.author === userInfo?.id ? "message me" : "message"
              }
            >
              {/* {console.log("message", message)} */}
              <div className="name-avatar-container">
                <S3Image
                  className="avatar-in-chat"
                  // key={id}
                  // onClick={()=>setPlan(file.key)}
                  imgKey={message.avatar}
                />
                {/* <img src={message.avatar} className="avatar-in-chat"></img> */}
                {/* <img src={files} className="avatar-in-chat"></img> */}
                <strong
                  style={
                    message.author === userInfo?.id
                      ? { color: "blue" }
                      : { color: "limeGreen" }
                  }
                >
                  {message.username}:{" "}
                </strong>
              </div>
              {message.body}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="chat-bar">
        <div className="emoj-container">
          <div className="smiley" onClick={handleShowEmojis}>
            <Smiley />
          </div>
          {showEmojis ? (
            <div className="emoji-div">
              <Emojis pickEmoji={pickEmoji} />
            </div>
          ) : null}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="messageBody"
            placeholder="Type your message here"
            disabled={userInfo === null}
            onChange={handleChange}
            value={messageBody}
            ref={inputRef}
          />
        </form>
      </div>
    </div>
  )
}

export default Channel
