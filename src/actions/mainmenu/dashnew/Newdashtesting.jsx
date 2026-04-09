// import React from 'react'
// import { useQuery } from "@tanstack/react-query"; 
// import authService from '../../../appwrite/auth'
// import database from '../../../appwrite/database'
// import { useEffect,useState } from 'react';



// function Newdashtesting() {

//    class Collects {
//        client = new Client()
//     account;
//     databases
//     constructor()
//     { 
//         this.client .setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
//     this.account = new Account(this.client);
//         this.databases = new Databases(this.client);
//     }

//        async AI(){    

//         try {
//           let category = "AI"
//               const airesults = await this.databases.listDocuments( conf.appwritedatabaseid, conf.appwritepostcollectionid,[Query.equal("postcategory", category)])
//                 let aidocuments = airesults.documents.reverse()
//                 setpostings(aidocuments)
//         } catch (error) {
//             return error
//         }
//         }
//        async EV(){
//           try {
//             let category = "EV"
//              const evresults =  await this.databases.listDocuments(conf.appwritedatabaseid, conf.appwritepostcollectionid,[Query.equal("postcategory", category)])
//              let evdocuments = evresults.documents.reverse()
//              setpostings(evdocuments)
             
             
//           } catch (error) {
//              return error
             
//           }
//         }
       
//          }
//    let latestcollects = new Collects() 

//    const { data :postdocuments, isLoading :postdocumentsloading, error :postdocumentserror } = useQuery({
//              queryKey: ["documents", category],
//              queryFn: latestcollects.AI(category),
//              queryFn: latestcollects.EV(category),
             
//               staleTime: 5 * 60 * 1000,
//            });
   

//   return (
//     <div>
      
//     </div>
//   )
// }

// export default Newdashtesting
