import React, {useState} from "react";


function Login({setIsLogin}){


const [username,setUsername]=useState("");
const [password,setPassword]=useState("");



const login=(e)=>{

e.preventDefault();


if(username==="admin" && password==="admin123"){

localStorage.setItem(
"login",
"true"
);

setIsLogin(true);

}

else{

alert("Invalid Login Details");

}

};



return(

<div className="login-page">


<div className="login-box">


<h1>👔 HR Portal</h1>

<p>
Employee Management System
</p>


<form onSubmit={login}>


<input

placeholder="Username"

value={username}

onChange={
e=>setUsername(e.target.value)
}

/>



<input

type="password"

placeholder="Password"

value={password}

onChange={
e=>setPassword(e.target.value)
}

/>



<button>
Login
</button>



</form>



<p className="demo">

Demo:
<br/>
Username: admin
<br/>
Password: admin123

</p>


</div>


</div>

)


}


export default Login;