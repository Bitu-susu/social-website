import React from "react"
import { Client,Storage,ID,Databases,Query, } from 'appwrite'
import authService from "../../../../appwrite/auth";
import conf from "../../../../appwrite/conf";
import { databases, storage } from "./appwritesdk";
import { useState } from "react";


//   its a custom hook 

const useProfile = ()=>{
   const[proffesion, setproffesion] = useState("")
  const [personal, setpersonal] = useState("") 
   const[credentials, setcredentials] = useState([])
        const[credentials1, setcredentials1] = useState("")
        const[credentials2, setcredentials2] = useState("")
        const[dp, setdp] = useState(null)
        const[yesedit, setyesedit] = useState(null)
  
        async function Profilecredential(e) {
            e.preventDefault()
            try {
        const user = await authService.getcurrentuser();
       const authid = user.$id 
      const fileInput = document.getElementById('profileupload');
   const profile = await storage.createFile(conf.appwriteprofileid,ID.unique(),fileInput.files[0]
               );
              //  console.log(profile.$id)
               let profileid = profile.$id 
               let picurl =`https://cloud.appwrite.io/v1/storage/buckets/67af2d5d0023c5596848/files/${profileid}/view?project=677eb42f003e041a0476`
      const profilebox = await databases.createDocument(
        conf.appwritedatabaseid, conf.appwritebiocollectionid, ID.unique(), {
        "profession":proffesion,
        "personal":personal,
        "authid": authid,
        "picurl" : picurl

      })
      // console.log("added credentials", profilebox);

    } catch (error) {
      console.log(error)
      }}

       async function editcredentials(id){
          console.log(id, "getting the id");
              try {
                     const getdocument = await  databases.listDocuments(
                          conf.appwritedatabaseid,conf.appwritebiocollectionid,[Query.equal("authid",id)] 
                        )
                        // console.log(getdocument, "haaa");
                        let newdoc = getdocument.documents[0].$id
                        if (yesedit) {
                          const fileInput = document.getElementById('editprofileupload');
                          const profile = await storage.createFile(conf.appwriteprofileid,ID.unique(),fileInput.files[0]);
                       let profileid = profile.$id 

                       console.log(profileid, "profileid");
                       
                       let picurl =`https://cloud.appwrite.io/v1/storage/buckets/67af2d5d0023c5596848/files/${profileid}/view?project=677eb42f003e041a0476`
      
                       const editupdate = await databases.updateDocument(conf.appwritedatabaseid,conf.appwritebiocollectionid,newdoc,{
                          "profession" :credentials1,
                          "personal" :credentials2,
                          "picurl": picurl,
                       }
                       ) 
                       console.log(editupdate, "updateeddd");
                       return editupdate
                       
                      }
        const editupdate = await databases.updateDocument(conf.appwritedatabaseid,conf.appwritebiocollectionid,newdoc,{
                                       "profession" :credentials1,
                                       "personal" :credentials2,
                                       "picurl": dp ,
                                    }
                                    ) 

                 console.log(editupdate, "updated successfully"); 
                 return editupdate
              }
               catch (error) {
                  console.log(error);
                                   
              }
           }
           
            let fetchprofilecredentials =async(authid)=>{

      const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
        const databases = new Databases(client);
        try {
          const getcredentials = await databases.listDocuments(
            conf.appwritedatabaseid, conf.appwritebiocollectionid,[Query.equal("authid",authid)] 
          )
          console.log(getcredentials.documents[0], "getted");
          
          return getcredentials.documents[0]
        } catch (error) {
          console.log(error, "error in fetching the  credentials of the user");
          
        }
      }


   return {personal, proffesion, credentials1, credentials2, dp,credentials,yesedit,setproffesion, setpersonal, setcredentials, setcredentials1, setcredentials2, setdp, setyesedit,editcredentials, Profilecredential,fetchprofilecredentials}

}
export default useProfile





     



   