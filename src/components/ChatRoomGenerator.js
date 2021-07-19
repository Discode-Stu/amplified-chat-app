import React, { useContext } from "react"
import { useAppContext } from "../contextLib/appContext"
import Channel from "../channels/channel"
import { AccountContext } from "./Accounts"
import { CognitoUserAttribute } from "amazon-cognito-identity-js"

export default function ChatRoomGenerator() {
  const { chatRoomList, setChatRoomList } = useAppContext()

  const { getSession } = useContext(AccountContext)

  function handleDelete(chatroomToDelete) {
    console.log("chatroom to delete: ", chatroomToDelete)
    console.log("List of chatrooms before delete", chatRoomList)
    let newList = []
    newList = chatRoomList.filter((item) => item !== chatroomToDelete)
    console.log("newList", newList)
    setChatRoomList(newList)
    getSession().then(({ user }) => {
      const attributes = [
        new CognitoUserAttribute({
          Name: "custom:list-of-chatrooms",
          Value: JSON.stringify(newList),
        }),
      ]

      user.updateAttributes(attributes, (err, result) => {
        if (err) console.error("chatrooms error: ", err)
        console.log("chatrooms loaded: ", result)
      })
    })
  }

  return (
    <div className="channels">
      {chatRoomList &&
        chatRoomList.map((chatroom, id) => {
          return (
            <div key={id}>
              <h1 style={{ textAlign: "center" }}>{chatroom}</h1>
              <h2
                style={{
                  border: "3px solid black",
                  textAlign: "center",
                  backgroundColor: "#D3D3D3",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50px",
                  cursor: "pointer",
                  zIndex:"10",
                  position:"relative",
                  opacity:".8"
                }}
                onClick={() => handleDelete(chatroom)}
              >
                Delete
              </h2>
              <Channel channel={chatroom} />
            </div>
          )
        })}
    </div>
  )
}
