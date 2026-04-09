 import conf from "./conf";
 import { Client, Account, ID } from "appwrite";
 import { useNavigate } from "react-router-dom";

export class Authservise{
    client = new Client();
    account;
       constructor(){
        this.client.setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
    this.account = new Account(this.client); 
       }
       async accountcreate( inputemail,
            inputpassword,
            inputname){
        try {
            const accountcreate = await this.account.create(
                ID.unique(),
                inputemail,
                inputpassword,
                inputname
              );
            return accountcreate
        } catch (error) {
                 console.log("error while creating account", error)
                  
        }
       }
        async accountlogin(inputemail, inputpassword){
        try{
              const accountlogin = await this.account.createEmailPasswordSession(inputemail, inputpassword) 
              return accountlogin
        }
        catch(error){
        console.log("error in login", error);
        }
        
        }

       async getcurrentuser(){
        try {
              const getcurrentuser = await this.account.get();
            //   console.log(getcurrentuser);
              
              return getcurrentuser;
        } catch (error) {
              console.log("error in getting user info", error)
        }
       }
       async logout(){
        try {
              const logout = await this.account.deleteSessions();
             
              return logout;
        } catch (error) {
              console.log("error in deleting session", error)
        }
       }
        gogooglelogin(){
            try {
                  const google =  this.account.createOAuth2Session("google","http://localhost:5173/newdash","http://localhost:5173/");
                  // console.log(google);
                  return google;
                  
                 } catch (error) {
                     console.log("error in logging with google", error);
                     
                 }
       }
}

const authService = new Authservise();

export default authService
// export default Authservise;