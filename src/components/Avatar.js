import React, { useEffect, useState, useContext } from "react"
import { S3Image } from "aws-amplify-react"
import Attributes from "./Attributes"
import { Storage } from "aws-amplify"
import { useAppContext } from "../contextLib/appContext"
import { AccountContext } from "./Accounts"
import { CognitoUserAttribute } from "amazon-cognito-identity-js"

export default function Avatar() {
  // const [files, setFiles] = useState([])
  const [fileData, setFileData] = useState([])

  const [showAvatars, setShowAvatars] = useState(true)

  const { setFiles, plan, setPlan } = useAppContext()

  // const [fileState, setFileState] = useState({
  //   fileUrl: "",
  //   file: "",
  //   fileName: "",
  // })
  const { getSession } = useContext(AccountContext)

  useEffect(() => {
    Storage.get(plan).then((data) => {
      setFiles(data)
    })
  }, [plan])

  useEffect(() => {
    const awaitFiles = async () => {
      const filesVar = await Storage.list("")
      setFileData(filesVar)
    }
    awaitFiles()
  }, [])

  // function handleChange(e) {
  //   const file = e.target.files[0]
  //   setFileState({
  //     fileUrl: URL.createObjectURL(file),
  //     file,
  //     fileName: file.name,
  //   })
  // }

  // function saveFile() {
  //   Storage.put(fileState.fileName, fileState.file).then(() => {
  //     console.log("!!!!!!!!!!!!!!!!!")
  //     console.log("SAVE FILE SUCCESS")
  //     console.log("!!!!!!!!!!!!!!!!!")
  //     setFileState({
  //       fileUrl: "",
  //       file: "",
  //       fileName: "",
  //     }).catch((e) => {
  //       console.log("error uploading file", e)
  //     })
  //   })
  // }

  useEffect(() => {
    if (plan) {
      getSession().then(({ user }) => {
        const attributes = [
          new CognitoUserAttribute({
            Name: "custom:profile-pic-s3-URL",
            Value: plan,
          }),
        ]

        user.updateAttributes(attributes, (err, result) => {
          if (err) console.error("70 avatar error", err)
          console.log("avatar result: ", result)
        })
      })
    } else console.log("NO PLAN 77")
  })

  return (
    <div className="avatar-container">
      <button
        className="avatar-button"
        onClick={() => setShowAvatars(!showAvatars)}
        type="button"
      >
        {!showAvatars ? "Show Avatars" : "Hide Avatars"}
      </button>
      {showAvatars ? (
        <div className="s3">
          <div className="s3Image-container">
            {fileData &&
              fileData.map((file, id) => {
                // console.log("fileURL", file)
                return (
                  <S3Image
                    className="s3Image"
                    key={id}
                    onClick={() => setPlan(file.key)}
                    imgKey={file.key}
                  />
                )
                // return <img key={id} src={file.key} />
              })}
          </div>
        </div>
      ) : null}
      {/* <img alt="file1" src={files} /> */}
      <div
        style={{
          // borderTop: "5px solid black",
          width: "75vw",
          marginBottom: "50px",
          // borderBottom: "5px solid black",
        }}
      >
        {/* <Attributes plan={plan} setPlan={setPlan} /> */}
      </div>
    </div>
  )
}
