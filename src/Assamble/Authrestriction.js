  import React from "react";
  import { useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import { Outlet } from "react-router-dom";

  const [user, setuser] = useState(null)
  
  let navigate = useNavigate()
  async function restrict() {
      let gettinguser = await authService.getcurrentuser() 
      if (gettinguser) {
          console.log(gettinguser);
          setuser(gettinguser)
        }
    }
    useEffect(()=>{restrict()},[])  
    
    export default function notrequireauth({user}){
     {user ? navigate('/Newdash') :<Outlet/>} 
     return user
   }
//  export default function requireauth({user}){
//      {user ? navigate('/Newdash') :<Outlet/>}
//    }
 
   