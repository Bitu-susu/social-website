//   const conf = {
//        appwriteurl :"https://cloud.appwrite.io/v1",
//        appwriteprojectid : "677eb42f003e041a0476",
//        appwritedatabaseid : "677eb5070038c01a28ba",
//        appwritebucketid : "677eb5a00022f1981a75",
//        appwritecollectionid : "677eb52100323069a5d9",
//        appwritecommentsid : "67ab8e610035c93ab222",
//        appwriteprofileid : "67af2d5d0023c5596848",
//        appwriteprofiledb : "67b3477500263fc9b0dd",
//        appwriteeucationid : "67c199b4000f1d175952",
//        appwriteemploymentid:"680219040013f737ea6c",
//        appwritefollowersid : "67c59daf001fd267f564",
//        appwritepostcollectionid: "67ebc23800306bef77c4",
//        appwritebiocollectionid : "67fe81ff0025e50296b0",
//        appwritelocationid : "680247a000298997ff8b",
//        appwritequestionid : "6812313e0023fd2afd63",
//        appwriteanswerid  :  "68136d0a001fe58addb3"

//   }
//   export default conf  

const conf = {
  appwriteurl: import.meta.env.VITE_APPWRITE_URL,
  appwriteprojectid: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  appwritedatabaseid: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  appwritebucketid: import.meta.env.VITE_APPWRITE_BUCKET_ID,
  appwritecollectionid: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
  appwritecommentsid: import.meta.env.VITE_APPWRITE_COMMENTS_ID,
  appwriteprofileid: import.meta.env.VITE_APPWRITE_PROFILE_ID,
  appwriteprofiledb: import.meta.env.VITE_APPWRITE_PROFILE_DB,
  appwriteeducationid: import.meta.env.VITE_APPWRITE_EDUCATION_ID,
  appwriteemploymentid: import.meta.env.VITE_APPWRITE_EMPLOYMENT_ID,
  appwritefollowersid: import.meta.env.VITE_APPWRITE_FOLLOWERS_ID,
  appwritepostcollectionid: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
  appwritebiocollectionid: import.meta.env.VITE_APPWRITE_BIO_COLLECTION_ID,
  appwritelocationid: import.meta.env.VITE_APPWRITE_LOCATION_ID,
  appwritequestionid: import.meta.env.VITE_APPWRITE_QUESTION_ID,
  appwriteanswerid: import.meta.env.VITE_APPWRITE_ANSWER_ID,
  appwritechatid :import.meta.env.VITE_APPWRITE_CHAT_ID
};
export default conf;
