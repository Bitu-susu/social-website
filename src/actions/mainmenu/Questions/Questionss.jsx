import React, { useState } from 'react'
import { Client,Storage,ID } from 'appwrite'
import database from '../../../appwrite/database'
import {Account,Databases,Query } from 'appwrite'
import  {useEffect ,useRef, useMemo} from 'react'


  function Usecurrentuser(){
     const[userss, setuser] = useState(null)

    useEffect(()=>{
        const fetchinguser = async()=>{
         const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
        // const databases = new Databases(client);
        
      const account = new Account(client);

        try {
            const getcurrentuser = await account.get();
               setuser(getcurrentuser.name)  
            // console.log(getcurrentuser.name);
            
               return
        } catch (error) {
              return error
        }
     }
     fetchinguser()
    },[])
    return userss  
  }
  export default Usecurrentuser 

// function Questionss() {


//   return (
//     <div>
      
//     </div>
//   )
// }

// export default Questionss
