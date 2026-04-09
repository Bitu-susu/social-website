import { useMutation } from "@tanstack/react-query";

let fetchingfollowings = async(id)=>{
       const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
const databases = new Databases(client);
     const getfollowings = await databases.listDocuments(
   conf.appwritedatabaseid, conf.appwritefollowersid,[Query.equal("giver", id)])
   let followinglist  = getfollowings.documents
  let listmapping = followinglist.map((list) => list.reciever);
  setfollowinglist(listmapping.length)
  return listmapping.length
    }

    const {data :fetchfollowings, isLoading :followingsloading, error : followingserror} = useQuery({
                    queryKey:["followings", selectorid],
                    queryFn : ()=> fetchingfollowings(selectorid),
                    staleTime :  5 * 60 * 1000,
                 }) 

       



let fetchingfollowers = async(id)=>{
      const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
const databases = new Databases(client);
const getfollowers = await databases.listDocuments(
   conf.appwritedatabaseid, conf.appwritefollowersid,[Query.equal("reciever",id)]   
 )
  let followerslist = getfollowers.documents
     let listmapping = followerslist.map((list) => list.giver);
     setfollowers(listmapping.length)
     return listmapping.length
  }

   const {data :fetchfollowers, isLoading :followersloading, error : followerserror} = useQuery({
                 queryKey:["followers", selectorid],
                 queryFn : ()=> fetchingfollowers(selectorid),
                 staleTime :  5 * 60 * 1000,
              }) 

    


//  first check wheter the current user follow the profile or not

const checkfollowing = async()=>{
 const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
    const databases = new Databases(client);

    try {
    const check = await databases.listDocuments(
      conf.appwritedatabaseid, conf.appwritefollowersid,[Query.equal("reciever",selectorid)]
    )
    let givenusers =  check.documents.find((list)=> list.giver === curentuserss)
    if (givenusers.length === 0) {
    //  here true or false due to changing the button from follow to unfollow in jsx
        return false       
    }
     else {return true}

    } catch (error) {
         console.log(error);
         
    }
}

const {data :checking, isLoading :checkingloading, error : checkingerror} = useQuery({
                 queryKey:["checking"],
                 queryFn : ()=> checkfollowing(),
                //  staleTime :  5 * 60 * 1000,
              }) 

 async function increasefollowers(){
       const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
    const databases = new Databases(client);
    try {
       const addfollowers = await databases.createDocument(conf.appwritedatabaseid, conf.appwritefollowersid,ID.unique(),{
                //  "giver": authid,
                 "giver": currentuserss,
                 "reciever": data,
                 "name":  currentname
                })

 return addfollowers;
    } catch (error) {
        return error;
    }
    }

        const followmutation = useMutation({
        mutationFn : increasefollowers,

         onMutate: async () => {
    await queryClient.cancelQueries(["followers", selectorid]);
    await queryClient.cancelQueries(["followings",selectorid]);

    const prevFollowers = queryClient.getQueryData(["followers", selectorid]);
    const prevFollowings = queryClient.getQueryData(["followings", currentuserss]);

    queryClient.setQueryData(["followers", selectorid], (old) => (old ?? 0) + 1);
    // queryClient.setQueryData(["followings", selectorid], (old) => (old ?? 0) + 1);

    return {prevFollowers, prevFollowings};     
  },

  onSettled : ()=>{
  queryClient.invalidateQueries(["followers", selectorid]);
  queryClient.invalidateQueries(["followings", selectorid]);
  queryClient.invalidateQueries(["checking"])
  },
}
)

async function decreasefollowers(){
       const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
    const databases = new Databases(client);
    try {
        const check = await databases.listDocuments(
      conf.appwritedatabaseid, conf.appwritefollowersid,[Query.equal("reciever",selectorid)]
    )
    let givenusers = check.documents.find((list)=> list.giver === curentuserss)
         let deleteid =  await databases.deleteDocument(conf.appwritedatabaseid, conf.appwritefollowersid,givenusers.$id)
    } 

    catch (error) {
         return error
    }
}

const unfollowmutation = useMutation({
       mutationFn : decreasefollowers,
           onMutate: async () => {
    await queryClient.cancelQueries(["followers", selectorid]);
    await queryClient.cancelQueries(["followings",selectorid]);

    const prevFollowers = queryClient.getQueryData(["followers", selectorid]);
    const prevFollowings = queryClient.getQueryData(["followings", currentuserss]);

    queryClient.setQueryData(["followers", selectorid], (old) => Math.max((old ?? 1) - 1, 0));
    // queryClient.setQueryData(["followings", currentuserss], (old) => Math.max((old ?? 1) - 1, 0));

    return {prevFollowers, prevFollowings};
  },
  onSettled: () => {
    queryClient.invalidateQueries(["followers", selectorid]);
    queryClient.invalidateQueries(["followings", currentuserss]);
    queryClient.invalidateQueries(["checking"])
  },
})
