import React from 'react'
import conf from './conf'
import { Client,Account,ID,Databases,Query } from 'appwrite'


class Database{
    client = new Client()
    account;
    databases
    constructor()
    {
        this.client
        .setEndpoint(conf.appwriteurl)
        .setProject(conf.appwriteprojectid);
    this.account = new Account(this.client);
        this.databases = new Databases(this.client);
    }

   async createdocument(title,category, content, url, creator){
   try {
      const newdocument = await this.databases.createDocument(
        conf.appwritedatabaseid,conf.appwritecollectionid,ID.unique(),{
           "posttitle": title,
            "postcategory": category,
            "postcontent": content,
            "featuredimage": url,
            "creator":creator,
            "likes" : 0,
        }
      )
      return newdocument
   } catch (error) {
       console.log(error);
       
   }
    }
          

                                                                //  for all users
    async listdocuments(){
        try {
           const result = await this.databases.listDocuments(
            conf.appwritedatabaseid,conf.appwritepostcollectionid,[Query.limit(100)]
            )
            return result;
            
        } catch (error) {
             console.log(error);
             
        }
    }
    async aidocuments(){
        try {
            let category = "AI"
              const airesults =await this.databases.listDocuments(
                conf.appwritedatabaseid, conf.appwritecollectionid,
               [Query.equal("postcategory", category)])
               return airesults
        } catch (error) {
             console.log(error);
             
        }
    }
    async businessdocuments(){
        try {
            let category = "Business"
              const businessresults =await this.databases.listDocuments(
                conf.appwritedatabaseid, conf.appwritecollectionid,
               [Query.equal("postcategory", category)])
               return businessresults
        } catch (error) {
             console.log(error);
             
        }
    }
    

}
const database = new Database()
export default database;
