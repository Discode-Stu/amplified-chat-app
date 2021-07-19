import React, { useEffect, useContext } from "react"
import { CognitoUserAttribute } from "amazon-cognito-identity-js"
import { AccountContext } from "./Accounts"
import Avatar from "./Avatar"
import { useAppContext } from "../contextLib/appContext"

export default () => {
  const { getSession } = useContext(AccountContext)

  const { plan, setPlan } = useAppContext()

  //! =======GET PLAN======>
  useEffect(() => {
    getSession().then((data) => {
      setPlan(data["custom:profile-pic-s3-URL"])
    })
  }, [])

  //! =======SET PLAN ======>
  const onSubmit = (event) => {
    event.preventDefault()

    getSession().then(({ user }) => {
      console.log("user")
      const attributes = [
        new CognitoUserAttribute({
          Name: "custom:profile-pic-s3-URL",
          Value: plan,
        }),
      ]

      user.updateAttributes(attributes, (err, result) => {
        if (err) console.error(err)
        console.log(result)
      })
    })
  }

  return (
    <Avatar />
    // <div>
    //   <h1>Update your plan:</h1>
    //   <h1>Plan: {plan}</h1>
    //   <form onSubmit={onSubmit}>
    //     <input value={plan} onChange={(event) => setPlan(event.target.value)} />
    //     <button type="submit">Change plan</button>
    //   </form>
    // </div>
  )
}
