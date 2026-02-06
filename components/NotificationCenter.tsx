import * as React from "react"
import { Bounce, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const NotificationContainer: React.FunctionComponent = () => {
  return (
    <ToastContainer
      stacked
      position="bottom-right"
      autoClose={1500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      draggable
      theme="colored"
      transition={Bounce}
    />
  )
}

export default NotificationContainer
