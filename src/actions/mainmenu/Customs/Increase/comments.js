import React from "react";
import conf from "../../../../appwrite/conf";
import { useState } from "react";
import { databases, storage } from "./appwritesdk";
// import authService from '../../../appwrite/auth'
import { Client,Storage,ID,Databases,Query } from 'appwrite'
import { useQuery } from "@tanstack/react-query";  
//   custom hook
function useComments(){

    const[newcomment, setnewcomment] = useState(false)
async function Addcomments({listingsid,addcomments,user,authid}){

    console.log(listingsid,addcomments,user, authid);
    
   try {
        const comments = await databases.createDocument(
               conf.appwritedatabaseid,conf.appwritecommentsid,ID.unique(),{
                 "comments" : addcomments,
                 "postid": listingsid,  // commentsid
                "name": user,
                 "date":new Date().toDateString(),
                 "authid":authid                                                            
               }
             )
             if (comments) {
                 console.log(comments, "comments"); 
             }
             return comments
   } catch (error) {
       console.log(error);
        
   }
}

async function fetchcomments({listingsi}){
    console.log(listingsi, "listings");
    
     try {
         const fetchingcomments = await databases.listDocuments(
            conf.appwritedatabaseid,conf.appwritecommentsid,[Query.equal("postid",listingsi)])
            console.log(fetchingcomments.documents);
         return fetchingcomments.documents
            
     } catch (error) {
           console.log(error);
           
     }
    }
   



   return {Addcomments, fetchcomments}
 }
 export default useComments



//     <div className="everyposts-section">
//                     { 
//                     postdocuments.map((listings)=> (
//                       <div className="Posts" style={{marginTop : "20px"}} key={listings.$id} >
//                       <div className="every-post">
//                       <div className="onlycontent">
//                         <div className="post-heading" style={{lineHeight: "10px"}} >
//                           <h5 style={{color : "black"}}>{listings.posttitle}</h5> 
//                           <div className="incdate" style={{display: "flex", justifyContent: "space-between"}}> 
//                           <span style={{fontWeight: "400", fontSize: "14px", color: "black",textDecoration : "underline"}}>{listings.postcategory ? "category - " + listings.postcategory :listings.postcategory} </span>
//                           <span style={{fontWeight: "400", fontSize: "14px", color: "#0b57d0", borderRadius:"20px", padding : "7px 7px"}} >{listings.Date}</span>
//                           </div> 
//                         </div> 
                        
//                         <div className="post-user" style={{display : "flex", justifyContent :"space-between", padding: "8px 0px",color : "#0b57d0"}}>
//                           <h6 onClick={()=> reduxsend(listings.authid,listings.postcreator)} style={{color :"#0b57d0", textDecoration: "underline",fontSize: "14px", cursor:"pointer"}}>{listings.postcreator}</h6>
                         
                         
//                         </div>   
                      
//                         <div className="post-content"> 
//                        {gettingid === listings.$id ?(
//                          <h6 style={{color: "black",fontWeight:"400",lineHeight:"24px" }}>{nottrimcontent}</h6>
//                         ):( <h6 style={{color: "black",fontWeight:"400",lineHeight:"24px" }}>{listings.postcontent.slice(0,300)}</h6> )}
//                         <h6 style={{cursor: "pointer", fontWeight : "300", color: "#0b57d0"}} onClick={()=>nottrim(listings.$id)}>{gettingid === listings.$id ?"" :"(... more⬇️)"}</h6>
                        
//                         </div> 
//                         </div>
//                         <div className="post-image" style={{display: "flex", justifyContent:"center",}}>
//                           <img src={listings.featuredimage} alt="image" style={{width:"95%", borderRadius : "21px"}} />
//                       </div>
//                       <div className="like-comment-section">
//                          <div className="like-section"> 
                     

//                           {/* {listings.Like.includes(authid)?<i class="fa-solid fa-heart" style={{color:"#d7329a", fontSize  : "14px", cursor : "pointer"}} onClick={()=>decreaselikeMutation.mutate(listings.$id)}></i> : <i class="fa-solid fa-heart" style={{color : "white", fontSize : "14px", cursor : "pointer"}} onClick={()=>likeMutation.mutate(listings.$id)}></i>} */}
                          
//    {listings.Like.includes(authid)?<i class="fa-solid fa-heart" style={{color:"#d7329a", fontSize  : "14px", cursor : "pointer"}} onClick={()=>decreaselikeMutation.mutate({docid : listings.$id, Like : listings.Like})}></i> : <i class="fa-solid fa-heart" style={{color : "white", fontSize : "14px", cursor : "pointer"}} onClick={()=>likeMutation.mutate({ docid :listings.$id, Like : listings.Like})}></i>}

                               
//                         <div className="like-right" style={{color : "white"}}>
//   {/* {increaselike.includes(listings.$id)
//     ? listings.Like.length + 1 
//     : listings.Like.length}  */}
//   {/* {listings.Like.includes(authid)
//     ? listings.Like.length 
//     : listings.Like.length}  */}
//       {listings.Like.length}
//   {/* {increaselike === listings.$id ? listings.Like.length +1 : listings.Like.length} */}    
//                         </div>
//                         </div> 
//                         <div className="right-comment">
//                         <i className="fa-regular fa-comment" style={{color : "white"}} onClick={addcomment}></i>
//                       {/* <button style={{background: "none", color :"#414040"}} onClick={()=>fetchcomments(listings.$id)}>list comments</button> */}
//                       <h6 style={{background: "none", color :"white", cursor : "pointer", fontWeight : "400"}} onClick={()=>fetchcomments(listings.$id)}>list comments</h6>     
                      
                         
//                         </div>
//                       </div>
//                       {/* <div className="comments" style={comments}>
//                       <div className="message-section">
//               <p className='username'>{firstletter}</p>
//               <input type="text" name="" id="" className='dashboard-input' placeholder='Add comments' value={addcomments} onChange={(e)=>setaddcomments(e.target.value)} />
//               <div className="comments-right">
//               <i class="fa-solid fa-caret-right" style={{fontSize:"25px"}} onClick={()=>Addcomments(listings.$id)}></i>
//               </div>
//               </div>
//                 </div> */}
//                 <div className="comments" style={comments}>
//                <div className="dash-2-up-top">
//                     <h6 style={{padding : "4px 9px", backgroundColor :"#0b57d0",color : "white", borderRadius : "20px", width: '30px'}} >{firstletter}</h6>
//                     <input type="text" name="" id="" style={{height: "35px",color: "white", background : "#474545",border : "none", width : "100%", borderRadius : '20px'}} className='dashboard-input' placeholder="Add comments " value={addcomments} onChange={(e)=>setaddcomments(e.target.value)}/>
//                     <div className="comments-right">
//               <i className="fa-solid fa-caret-right" style={{fontSize:"25px", color : "white"}} onClick={()=>Addcomments(listings.$id)}></i>
//               </div>
//               </div>
//                     </div>


//                             <div className="showing-comments">
//                             {getcomments
//     .filter((comment) => comment.postid === listings.$id) // Only show comments for this post
//     .map((comment) => (
//         //  <h6>{comment.length}</h6> 

//       <div className="every-comment" style={{height: "100px",padding : "15px"}} key={comment.$id}>
//         <div className="name-date" style={{display: "flex", justifyContent : "space-between"}}>
//         <h6 style={{color : "white",fontSize : "14px" }}>{comment.name}</h6>
//         {/* <h6 style={{fontSize : "12px"}}>{comment.date}</h6> */}
//         <span style={{fontWeight: "400", fontSize: "12px", color: "white",background:"#0b57d0", borderRadius:"20px", padding : "3px 7px"}} >{listings.Date}</span></div>
//         <h6 style={{color: "white",fontWeight:"400", fontSize : "13px"}}>{comment.comments}</h6><hr style={{color : "#686665"}} />
                    
//       </div>
//     ))}
//     </div>
//     </div>
       
//             </div>
  
//                 ))}
//                     </div>