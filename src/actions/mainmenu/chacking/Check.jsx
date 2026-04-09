import React from 'react'
import { Client,Account,Storage,Databases,ID} from 'appwrite'
import conf from '../../../appwrite/conf';

function Check() {
const client = new Client()
    .setEndpoint(conf.appwriteurl) // Your API Endpoint
    .setProject(conf.appwriteprojectid); // Your project ID

const storage = new Storage(client);
    async function createfile() {
        try {
            const result = await storage.createFile(
                conf.appwritebucketid,ID.unique(),
                document.getElementById('uploader').files[0], // file
            );
            
            console.log(result.$id);
            let fileid = result.$id;
            let url =`https://cloud.appwrite.io/v1/storage/buckets/677eb5a00022f1981a75/files/${fileid}/view?project=677eb42f003e041a0476`;
            console.log(url); 
            

        } catch (error) {
             console.log(error);
             
        }
    }

  return (
    <div>
      <input type="file" name="" id="uploader"/>
      <button onClick={createfile}>click</button>
    </div>
  )
}

export default Check





  //  { 
  //                                  posts.map((listings)=> (
  //                                    <div className="Posts" style={{marginTop : "8px"}} key={listings.$id}>
  //                                    <div className="every-post">
  //                                    <div className="onlycontent">
  //                                      <div className="post-heading" style={{lineHeight: "10px"}}>
  //                                        <h5 style={{color : "white"}}>{listings.posttitle}</h5> 
  //                                        <div className="incdate" style={{display: "flex", justifyContent: "space-between"}}> 
  //                                        <span style={{fontWeight: "400", fontSize: "14px", color: "white",textDecoration : "underline"}}>{listings.postcategory ? "category - " + listings.postcategory :listings.postcategory} </span>
  //                                        <span style={{fontWeight: "400", fontSize: "14px", color: "white",background:"#0b57d0", borderRadius:"20px", padding : "7px 7px"}} >{listings.Date}</span>
  //                                        </div> 
  //                                      </div>
  //                                       {/* <div className="post-category">
                                       
  //                                       <span style={{fontWeight: "500"}} >category : {listings.postcategory}</span>
               
  //                                       </div> */}
  //                                      <div className="post-user" style={{display : "flex", justifyContent :"space-between", padding: "8px 0px",color : "#626161"}}>
  //                                        <h6 onClick={()=> reduxsend(listings.authid)} style={{color :"#626161", textDecoration: "underline",fontSize: "14px"}}>{listings.postcreator}</h6>
                                        
  //                                        {/* <i class="fa-solid fa-circle-xmark" onClick={()=>postdeletion(listings.$id)} style={deletepost}></i> */}
  //                                      </div>   
                                     
  //                                      <div className="post-content"> 
  //                                     {gettingid === listings.$id ?(
  //                                       <h6 style={{color: "white",fontWeight:"400",lineHeight:"24px" }}>{nottrimcontent}</h6>
  //                                      ):( <h6 style={{color: "white",fontWeight:"400",lineHeight:"24px" }}>{listings.postcontent.slice(0,300)}</h6> )}
  //                                      <h6 style={{cursor: "pointer", fontWeight : "300", color: "#0b57d0"}} onClick={()=>nottrim(listings.$id)}>{gettingid === listings.$id ?"" :"(... more⬇️)"}</h6>
                                       
  //                                      </div> 
  //                                      </div>
  //                                      <div className="post-image" style={{display: "flex", justifyContent:"center", backgroundColor : "#626161"}}>
  //                                        <img src={listings.featuredimage} alt="image" style={{width:"80%"}} />
  //                                    </div>
  //                                    <div className="like-comment-section">
  //                                       <div className="like-section">
  //                                        {/* {listings.Like.includes(authid) ?  <i class="fa-regular fa-heart" style={{color : "red"}} ></i>: <i class="fa-regular fa-heart"onClick={()=>likesincrease(listings.$id)}></i>} */}
  //                                        <i className="fa-regular fa-heart"onClick={()=>likesincrease(listings.$id)} style={{color:"white"}}></i>
  //                                        <h6 style={{color : "white", fontSize : "13px"}}>Upvote</h6>
  //                                      <div className="like-right" style={{color : "white"}}>
                                       
  //                {increaselike.includes(listings.$id)
  //                  ? listings.Like.length + 1 
  //                  : listings.Like.length} 
                
  //                                      </div>
  //                                      </div> 
  //                                      <div className="right-comment">
  //                                      <i className="fa-regular fa-comment" style={{color : "white"}} onClick={addcomment}></i>
  //                                    {/* <button style={{background: "none", color :"#414040"}} onClick={()=>fetchcomments(listings.$id)}>list comments</button> */}
  //                                    <h6 style={{background: "none", color :"white", cursor : "pointer", fontWeight : "400"}} onClick={()=>fetchcomments(listings.$id)}>list comments</h6>     
                                     
                                        
  //                                      </div>
  //                                    </div>
  //                                    {/* <div className="comments" style={comments}>
  //                                    <div className="message-section">
  //                            <p className='username'>{firstletter}</p>
  //                            <input type="text" name="" id="" className='dashboard-input' placeholder='Add comments' value={addcomments} onChange={(e)=>setaddcomments(e.target.value)} />
  //                            <div className="comments-right">
  //                            <i class="fa-solid fa-caret-right" style={{fontSize:"25px"}} onClick={()=>Addcomments(listings.$id)}></i>
  //                            </div>
  //                            </div>
  //                              </div> */}
  //                              <div className="comments" style={comments}>
  //                             <div className="dash-2-up-top">
  //                                  {/* <h6 style={{padding : "4px 9px", backgroundColor :"#0b57d0",color : "white", borderRadius : "20px", width: '30px'}} >{firstletter}</h6> */}
  //                                  <input type="text" name="" id="" style={{height: "35px",color: "white", background : "#474545",border : "none", width : "100%", borderRadius : '20px'}} className='dashboard-input' placeholder="Add comments " value={addcomments} onChange={(e)=>setaddcomments(e.target.value)}/>
  //                                  <div className="comments-right">
  //                            <i className="fa-solid fa-caret-right" style={{fontSize:"25px", color : "white"}} onClick={()=>Addcomments(listings.$id)}></i>
  //                            </div>
  //                            </div>
  //                                  </div>
               
               
  //                                          <div className="showing-comments">
  //                                          {getcomments
  //                  .filter((comment) => comment.postid === listings.$id) // Only show comments for this post
  //                  .map((comment) => (
  //                      //  <h6>{comment.length}</h6> 
               
  //                    <div className="every-comment" style={{height: "100px",padding : "15px"}} key={comment.$id}>
  //                      <div className="name-date" style={{display: "flex", justifyContent : "space-between"}}>
  //                      <h6 style={{color : "white" }}>{comment.name}</h6>
  //                      {/* <h6 style={{fontSize : "12px"}}>{comment.date}</h6> */}
  //                      <span style={{fontWeight: "400", fontSize: "14px", color: "white",background:"#0b57d0", borderRadius:"20px", padding : "3px 7px"}} >{listings.Date}</span></div>
  //                      <h6 style={{color: "white",fontWeight:"400"}}>{comment.comments}</h6><hr style={{color : "#686665"}} />
                                   
  //                    </div>
  //                  ))}
  //                  </div>
  //                  </div>
                      
  //                          </div>
                 
  //                              ))} 