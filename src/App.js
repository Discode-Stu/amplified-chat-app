import React, { useEffect, useState } from "react"
import "@aws-amplify/pubsub"
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react"
import { Auth } from "@aws-amplify/auth"
import "./App.css"
import Channel from "./channels/channel"
import { Account } from "./components/Accounts"
import Avatar from "./components/Avatar"
import { AppContext } from "./contextLib/appContext"
import ChatRooms from "./components/ChatRooms"
import ChatRoomGenerator from "./components/ChatRoomGenerator"
import Attributes from "./components/Attributes"
import { S3Image } from "aws-amplify-react"

function App() {
  const [userInfo, setUserInfo] = useState(null)
  const [plan, setPlan] = useState("")
  const [files, setFiles] = useState([])
  const [chatRoomList, setChatRoomList] = useState([])

  useEffect(() => {
    Auth.currentUserInfo().then((userInfo) => {
      setUserInfo(userInfo)
    })
  }, [])

  useEffect(() => {
    console.log("plan 30 app.js", plan)
  }, [])

  return (
    <div className="app">
      <AppContext.Provider
        value={{
          files,
          setFiles,
          plan,
          setPlan,
          chatRoomList,
          setChatRoomList,
        }}
      >
        <Account>
          {!plan ? (
            <Attributes />
          ) : (
            <>
              <div>
                {userInfo && (
                  <div className="header">
                    <div className="profile">
                      You are logged in as: <strong>{userInfo.username}</strong>
                    </div>
                    <div style={{ height: "50px", width: "50px" }}>
                      <S3Image className="s3Image-header" imgKey={plan} />
                      <S3Image className="s3Image-header-bg" imgKey={plan} />
                    </div>
                    <AmplifySignOut />
                  </div>
                )}
              </div>
              {/* <img alt="file1" src={files} /> */}
              {/* <div>
        <input type="file" onChange={handleChange} />
        <img src={fileState.fileUrl} />
        <button onClick={saveFile}>Save File </button>
      </div> */}
              <Attributes />
              <div className="chatroom-app">
                <ChatRooms />
                <ChatRoomGenerator />
              </div>
              {/* <h1>CHAT ROOM GENERATOR</h1> */}
            </>
          )}
        </Account>
      </AppContext.Provider>
    </div>
  )
}

export default withAuthenticator(App)
