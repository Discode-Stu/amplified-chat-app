import React, { useEffect, useState, useContext } from "react"
import { useAppContext } from "../contextLib/appContext"
import { AccountContext } from "./Accounts"
import { CognitoUserAttribute } from "amazon-cognito-identity-js"

export default function ChatRooms() {
  const [chatRoom, setChatRoom] = useState([])

  const { chatRoomList, setChatRoomList } = useAppContext()

  const { getSession } = useContext(AccountContext)

  //! =======GET PLAN======>
  useEffect(() => {
    getSession().then((data) => {
      setChatRoomList(JSON.parse(data["custom:list-of-chatrooms"]))
    })
  }, [])

  //! =======SET PLAN ======>
  const onSubmit = (event) => {
    event.preventDefault()
    if (chatRoomList.includes(chatRoom)) {
      console.log(`${chatRoom} is inside ${chatRoomList}`)
      alert(`${chatRoom} already exists!`)
    } else {
      setChatRoomList([...chatRoomList, chatRoom])
      getSession().then(({ user }) => {
        const attributes = [
          new CognitoUserAttribute({
            Name: "custom:list-of-chatrooms",
            Value: JSON.stringify([...chatRoomList, chatRoom]),
          }),
        ]

        user.updateAttributes(attributes, (err, result) => {
          if (err) console.error("chatrooms error: ", err)
          console.log("chatrooms loaded: ", result)
        })
      })
    }

    // getSession().then(({ user }) => {
    //   const attributes = [
    //     new CognitoUserAttribute({
    //       Name: "custom:list-of-chatrooms",
    //       Value: JSON.stringify(chatRoom),
    //     }),
    //   ]

    //   user.updateAttributes(attributes, (err, result) => {
    //     if (err) console.error(err)
    //     console.log(result)
    //   })
    // })
  }

  function submitChatRoom(event) {
    setChatRoom(event.target.value)
  }

  return (
    <div className="chatroom-form">
      {/* <h1>Update your chatRoom:</h1> */}
      {/* <h1>chatRoom: {chatRoom}</h1> */}
      <form onSubmit={onSubmit}>
        <div>
          <div>Add chatroom below</div>
          <input
            // value={chatRoom}
            onChange={(event) => submitChatRoom(event)}
          />
        </div>
        <button type="submit">Add chatroom</button>
      </form>
    </div>
  )
}
