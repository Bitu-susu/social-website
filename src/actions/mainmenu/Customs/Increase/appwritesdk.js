import { Client,Storage,ID,Databases, } from 'appwrite'
import conf from "../../../../appwrite/conf";
const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid); 

export const databases = new Databases(client); 
export const storage = new Storage(client)