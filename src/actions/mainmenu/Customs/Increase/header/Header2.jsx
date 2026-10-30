 import { Link } from "react-router-dom"
 import './header2.css'
 import { createContext } from "react"
 import Status from "../../../status/Status"
 import { Mycontext } from "../../../status/Context"
 import { useState } from "react"

function Header2() {
 
  // let Mycontext = createContext()

  const[mydisplay, setmydisplay] = useState("message")

 
  return (
    
<>
<Mycontext.Provider value={{mydisplay, setmydisplay}}>
          <div className="headers" id='headers' >
            <div className="headerrleftt">

        {/* <i className="fa-solid fa-house" style={{fontSize: "18px"}}></i> */}
        <Link to="/"><i className="fa-solid fa-house" style={{ color : "#0b57d0"}}></i></Link>
        {/* <i className="fa-solid fa-users-line" style={{fontSize: "20px"}} ></i>  */}
        <i className="fa-solid fa-comment" onClick={()=>setmydisplay("message")}></i>
        <i className="fa-solid fa-circle-dot" onClick={()=>setmydisplay("status")}></i>
          {/* <div className="with-notification" style={{display : "flex", position : "relative"}}>
         <Link to="/notifications"> <i className="fa-solid fa-bell" style={{fontSize: "20px", color : "#0b57d0"}}></i></Link>
        
          </div> */}

        <i className="fa-solid fa-book-open-reader" style={{}}></i>
        </div>
      
        <div className="headerright">
            {/* <h6 style={{padding : "4px 8px", backgroundColor :"#0b57d0",color : "white", borderRadius : "20px"}}>{firstletter}</h6>
            {user?<><h6 style={{color : "black",fontWeight : "400"}}>{user.slice(0,7)}..</h6></> : <>loading..</>} */}
            {/* <h6 style={{color : "black",fontWeight : "400"}}>{user}</h6> */}
           
        </div>  
        </div> 
        
          <Status/>
      </Mycontext.Provider>
      </>
  )


}
  
export default Header2




 { select === "likes"?(
              likes?.map((listings)=>(
             listings.authid !== authid?(<>
             <div className="notification-box" style={{ padding : "9px 9px", marginBottom : "8px"}}>
                  <div className="dp" style={{width : "55px", height : "53px"}}>
                    {listings.giverpic !==null ?(<img src={listings.giverpic} alt="" style={{width : "100%", heigth : "100%", borderRadius : "50%", }} />):(<>
                    <div className="content-dp" style={{width :"47px", height : "40px", textAlign : 'center', }}>
                    <p style={{width : "95%", heigth : "100%", borderRadius : "50%", border : "3px solid rgb(245 245 245)", boxShadow : "4px 12px 27px 0px #e4e4e8"}}>{listings.name.slice(0,1)}</p>
                    </div>
                    </>)}
                 </div>
               <div className="notification-bottom" style={{width : '100%'}}>
                <h5 style={{fontSize : "16px"}}> {listings.name} likes your post..&nbsp;&nbsp;&nbsp;<span style={{fontSize : "14px", color : "blue", textDecoration : "underline"}}>view</span></h5>
                <div className="follow-content" style={{display : "flex", justifyContent : "space-between"}}>
               <h6 style={{marginBottom :"7px !important", fontWeight : "400"}}>{listings.postname.slice(0,56)}.....</h6> 
                <span style={{fontSize : "14px"}}> {listings.actualtime}</span>
                </div>
                </div>
                </div>
                </>):(<></>)
              )) 

            ):select === "followers"?(
              likes?.map((listings)=>(
                 listings.authid !== authid?(
              <div className="notification-box" style={{background : "aliceblue", padding : "9px 9px", marginBottom : "8px", display : "flex", justifyContent : "space-between"}}>
                 <div className="dp" style={{width : "55px", height : "53px"}}>
                <img src={listings.giverpic} alt="" style={{width : "100%", heigth : "100%", borderRadius : "50%", }} />
                 </div>
                 <div className="follow-content">

                <h5 style={{fontSize : "15px"}}> {listings.name} starts following you </h5>
                 <span style={{fontSize : "14px"}}> {listings.actualtime}</span>
                 </div>
              </div>
                ):(<></>)
            )) 
            ): select === "comments"? (
               likes?.map((listings)=>(
                  listings.authid !== authid?(
               <div className="notification-box" style={{ padding : "9px 9px", marginBottom : "8px", }}>
                  <div className="dp" style={{width : "55px", height : "53px"}}>
                    {listings.giverpic !==null ?(<img src={listings.giverpic} alt="" style={{width : "100%", heigth : "100%", borderRadius : "50%",}} />):(<>
                    <div className="content-dp" style={{width :"47px", height : "40px", textAlign : 'center', }}>
                    <p style={{width : "95%", heigth : "100%", borderRadius : "50%", border : "3px solid rgb(245 245 245)", boxShadow : "4px 12px 27px 0px #e4e4e8"}}>{listings.name.slice(0,1)}</p>
                    </div>
                    </>)}
                 </div>
               <div className="notification-bottom" style={{width : '100%'}}>
                <h5 style={{fontSize : "16px"}}> {listings.name} commented on your post..&nbsp;&nbsp;&nbsp;<span style={{fontSize : "14px", color : "blue", textDecoration : "underline"}}>view</span></h5>
                <div className="follow-content" style={{display : "flex", justifyContent : "space-between"}}>
               <h6 style={{marginBottom :"7px !important", fontWeight : "400"}}>{listings.post}.....</h6> 
                <span style={{fontSize : "14px"}}> {listings.actualtime}</span>
                </div>
                </div>
                </div>
                ):(<></>)
            )) 
            ):select === "all" ?(
           
              likes?.map((listings)=>(
                listings.call === "increase" && listings.authid !== authid?(
                   
                <div className="notification-box" style={{ padding : "9px 9px", marginBottom : "8px"}}>
                  <div className="dp" style={{width : "55px", height : "53px"}}>
                    {listings.giverpic !==null ?(<img src={listings.giverpic} alt="" style={{width : "100%", heigth : "100%", borderRadius : "50%",}} />):(<>
                    <div className="content-dp" style={{width :"47px", height : "40px", textAlign : 'center', }}>
                    <p style={{width : "95%", heigth : "100%", borderRadius : "50%", border : "3px solid rgb(245 245 245)", boxShadow : "4px 12px 27px 0px #e4e4e8"}}>{listings.name.slice(0,1)}</p>
                    </div>
                    </>)}
                 </div>
               <div className="notification-bottom" style={{width : '100%'}}>
                <h5 style={{fontSize : "16px"}}> {listings.name} likes on your post..&nbsp;&nbsp;&nbsp;<span style={{fontSize : "14px", color : "blue", textDecoration : "underline"}}>view</span></h5>
                <div className="follow-content" style={{display : "flex", justifyContent : "space-between"}}>
               <h6 style={{marginBottom :"7px !important", fontWeight : "400"}}>{listings.postname.slice(0,56)}.....</h6> 
                <span style={{fontSize : "14px"}}> {listings.actualtime}</span>
                </div>
                </div>
                </div>
                ): listings.call === "follows" && listings.authid !== authid?(
                 <div className="notification-box" style={{background : "aliceblue", padding : "9px 9px", marginBottom : "8px", display : "flex", justifyContent : "space-between"}}>
                 <div className="dp" style={{width : "55px", height : "53px"}}>
                <img src={listings.giverpic} alt="" style={{width : "100%", heigth : "100%", borderRadius : "50%", }} />
                 </div>
                 <div className="follow-content">

                <h5 style={{fontSize : "15px"}}> {listings.name} starts following you </h5>
                 <span style={{fontSize : "14px"}}> {listings.actualtime}</span>
                 </div>
              </div>
                ): listings.call === "comment" && listings.authid !== authid?(
                  <div className="notification-box" style={{ padding : "9px 9px", marginBottom : "8px"}}>
                  <div className="dp" style={{width : "55px", height : "53px"}}>
                    {listings.giverpic !==null ?(<img src={listings.giverpic} alt="" style={{width : "100%", heigth : "100%", borderRadius : "50%",}} />):(<>
                    <div className="content-dp" style={{width :"47px", height : "40px", textAlign : 'center', }}>
                    <p style={{width : "95%", heigth : "100%", borderRadius : "50%", border : "3px solid rgb(245 245 245)", boxShadow : "4px 12px 27px 0px #e4e4e8"}}>{listings.name}</p>
                    </div>
                    </>)}
                 </div>
               <div className="notification-bottom" style={{width : '100%'}}>
                <h5 style={{fontSize : "16px"}}> {listings.name} commented on your post..&nbsp;&nbsp;&nbsp;<span style={{fontSize : "14px", color : "blue", textDecoration : "underline"}}>view</span></h5>
                <div className="follow-content" style={{display : "flex", justifyContent : "space-between"}}>
               <h6 style={{marginBottom :"7px !important", fontWeight : "400"}}>{listings.post.slice(0,56)}.....</h6> 
                <span style={{fontSize : "14px"}}> {listings.actualtime}</span>
                </div>
                </div>
                </div>
                ):(<>
 
                </>)
              ))
            ): select === "profile"?(
               <div className="profile-container">
                <div className="profile-user">
                  {user?<h3 style={{fontWeight : "350", fontSize : "45px",color: "#312f2f"}}>{user}</h3>:<h3></h3>}
                </div>
                <div className="profile-credentials">
                  {likes?.profile?(<>
                  <h6 style={{color : "black", fontSize: "16px,", fontWeight :"400"}}>{likes?.profile?.profession}</h6>
                  <h6 style={{color : "black", fontSize: "16px,", fontWeight :"400"}}>{likes?.profile?.personal}</h6>

                  </>):(<>nothing yet</>)}
                </div>
                <div className="profile-followers">
                  {likes?.followerss?(<>
                   <h6 style={{color : "#1f47ff", fontSize: "16px,", fontWeight :"400"}}>{likes?.followerss} followers</h6>
                   <h6 style={{color : "#1f47ff", fontSize: "16px,", fontWeight :"400"}}>{likes?.followings} followings</h6>
                  </>):(<></>)}
                </div>
                <div className="profile-image">
                 <img src={likes?.profile?.picurl} alt=""  className='profile-left-top-image-box'/>

                </div>
                <div className="education-credentials">
                  <h5>  Education Credentials</h5>
                   {likes?.school?(<>
                    <h6 style={{color : "black", fontSize: "16px,", fontWeight :"400"}}> Schooling at -{likes?.school?.schooling} </h6>
                    <h6 style={{color : "#1f47ff", fontSize: "16px,", fontWeight :"400"}}> Higher education at -{likes?.school?.highereducation} </h6>
                   </>):(<></>)}
                </div>
               <div className="professional-credentials">
                     {/* <h5>  Professional Credentials</h5> */}

                       <h6 style={{color : "black", fontSize: "16px,", fontWeight :"400"}}> Profession -{likes?.employment?.employment} </h6>
               </div>
               </div>

            ):(<></>)
            (<> </>)
            }  