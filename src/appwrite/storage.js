 import { Storage } from "appwrite";
 import conf from "./conf";
 import { ID,Client } from "appwrite";

 export class storageservice {
    
    client = new Client()
     storage
    //   file = fileInput.files[0]
     
     constructor() {
         this.client
         .setEndpoint(conf.appwriteurl)
         .setProject(conf.appwriteprojectid);
         this.storage = new Storage(this.client);
        }
        
    //     uploadprofile(){
    //         try {
    //             const profile = this.storage.createFile(
    //            conf.appwritebucketid ,ID.unique(), document.getElementById('uploader')
    //         );
    //         return profile;
            
    //     } catch (error) {
    //          console.log(error)
    //     }
    // }
 }
 const StorageService = new storageservice();
 export default StorageService
 