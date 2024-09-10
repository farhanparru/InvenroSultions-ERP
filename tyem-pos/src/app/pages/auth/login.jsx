import { useState } from "react";
import React from "react";
import { loginFields } from "./formField";
import FormAction from "./FormAction";
import FormExtra from "./FormExtra";
import Input from "./input";
import axios from "axios";
import { WEBSITE_URL,WEBSITE_API_URL } from "../../config";
import { useDispatch } from "react-redux";
import { saveStoreUser } from "../../store/storeUser/storeUserSlice";

const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Login() {
  const dispatch = useDispatch();

  const [loginState, setLoginState] = useState(fieldsState);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleChangePass = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateUser();
  };

  //Handle Login API Integration here
  const authenticateUser = () => {
    let data = loginFields;

    axios
      .post(WEBSITE_URL + "oauth/token", {
        grant_type : 'password',
        client_id: '1',
        client_secret: '8f3RoooLTE7Jn9Kz8dRrKAy3Hq7utG0raCKYLVrm',
        username,
        password,
      })
      .then((response) => {

        const accessToken = response.data.access_token;

        const headers = {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        };

        axios.get(WEBSITE_API_URL + "/user/loggedin", { headers })
          .then((loggedInResponse) => {
            loggedInResponse.data.data.accessToken = accessToken;
            loggedInResponse.data.data.success = true;

            axios.get(WEBSITE_API_URL + "/cash-register?status=open&user_id="+loggedInResponse.data.data.id, { headers }).then((cashRegister) => {
              if(cashRegister?.data?.data?.length == 0){
                // Cash Register Does Not Exist.
                axios
                .post(WEBSITE_API_URL + "cash-register", {
                  status : 'open',
                  initial_amount: '0',
                 
                }, {headers});
              }
            });

            // console.log(loggedInResponse);
            // return

            dispatch(saveStoreUser(loggedInResponse.data.data));
          })
          .catch((error) => console.log(error));


        //API Success from LoginRadius Login API
      })
      .catch((error) => console.log(error));
    // const endpoint = `https://api.loginradius.com/identity/v2/auth/login?apikey=${apiKey}`;
    // fetch(endpoint, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(loginFields),
    // })
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="-space-y-px">
        <Input
          handleChange={handleChangeUsername}
          value={username}
          labelText={"Enter your Username"}
          labelFor={"Username"}
          name={"username"}
          type={"username"}
          isRequired={true}
          placeholder={"Enter your Username"}
        />
        <Input
          handleChange={handleChangePass}
          value={password}
          labelText={"Enter your password"}
          labelFor={"Passsword"}
          name={"password"}
          type={"password"}
          isRequired={true}
          placeholder={"Enter your password"}
        />
      </div>

      {/* <FormExtra /> */}
      <FormAction handleSubmit={handleSubmit} text="Login" />
    </form>
  );
}
