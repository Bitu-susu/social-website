import React from 'react';
import './Home.css';
import { useState,useEffect } from 'react';
import birendra from '../../../images/developers-4.png';
import leftimage from '../../../images/blogpost_logo-removebg-preview.png'
import backimage from '../../../images/google home.png'
// import screen1 from '../../../images/Screenshot 2025-03-12 192834.png'
import screen2 from '../../../images/Screenshot 2025-03-13 153044.png'
import screen1 from '../../../images/Screenshot 2025-07-06 212709.png'
import { useNavigate } from 'react-router-dom';
import database from '../../../appwrite/database'
import authService from '../../../appwrite/auth'
  import StorageService from '../../../appwrite/storage'
  import { Client,Storage,ID } from 'appwrite'
  import conf from '../../../appwrite/conf'
  import {Account,Databases,Query } from 'appwrite'
  import { Link } from 'react-router-dom';
  // import authService from '../../../appwrite/auth'
  // import { useNavigate } from 'react-router-dom';


function Home() {
  const navigate = useNavigate()
  // fetching the important blogs in home page
  const  [postings,setpostings] = useState([])

    //  check if user session exist or not , if exist then  redirect to dashboard page  else stays in home page 
    
//      async function checklogin() {
//      try {
//              let checking = await authService.getcurrentuser()
//              if (checking) {  
//                   navigate('/newdash')
//              }
//      } catch (error) {    
//            console.log(error);
           
//      }       
//      }

// useEffect(()=>{
//     checklogin()
// },[])

  useEffect(()=>{
    async function listdocument() {
       try {
          const listevery = await database.listdocuments()
          // console.log(listevery);  
          let reversinglists = listevery.documents.reverse()

         setpostings(reversinglists) 
       } catch(error) {
            console.log("error in getting the documents", error);
            
       }
    }
    listdocument()    
  },[])
      const [zoombox, setzoombox] = useState({
        display : "none"
      })
      const[lowopacity, setlowopacity] = useState({
        opacity : "1"
      }) 

      //  fetching documents with respect to query
      const [fetchhome, setfetchhome] = useState("")
      const[trimcontent, settrimcontent] = useState('')
      const [expand, isexpand]= useState(false)
  async function zoomopen(id) {
    //  console.log(id, " here is the id");
     const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
     const databases = new Databases(client);
     try {
      setzoombox({
        display : "block"
      })
           const fetchinghome = await databases.listDocuments(
            conf.appwritedatabaseid,conf.appwritepostcollectionid,[Query.equal("$id",id)]
          )
          // console.log(fetchinghome.documents);
          setfetchhome(fetchinghome.documents[0])  
           settrimcontent(fetchinghome.documents[0].postcontent.slice(0,300))
     } catch (error) {
        console.log(error);   
     }
 useEffect(()=>{
  zoomopen(id)
},[id])    
  }
  
  const [visible, setvisible] = useState({
    display : "none"
  })
  
   

 
  return (
    <>
     <div className="container">
      <div className="herosection" style={{background :`url(${backimage})`, backgroundPosition:"center"}}>
        <h1>what's new in mind?</h1> <br />
        <div className="button-content" style={{position : "fixed", bottom:"0px", right:"0px", zIndex: "5"}}>
          <div className="button-top-content" style={visible}>
          <span>Sign up today and become part of a growing community that thrives on knowledge community that thrives on knowledge, creativity,and meaningful exchange. <b>Because your ideas deserve to be heard</b></span>
          </div>
         </div>
         <button onClick={()=>navigate("/Signup")} style={{position : "fixed", bottom:"0px", right:"0px", zIndex: "5"}}onMouseOver={()=>setvisible({display : "block"})} onMouseLeave={()=>setvisible({display : "none"})}>Unlock now</button>
      </div>
      <div className="content-1">
          <div className="content-1-left">
              <h2 style={{fontSize : "40px"}}>Welcome to Postly - Where ideas come alive </h2>
              <h3 style={{color : "#a3debd", fontSize : "22px"}}>Share knowledge, Spark conversations inspire Minds</h3>
              <p style={{color : "white", fontSize : "17px"}}> Share your thoughts, ideas, experiences, and stories freely — your voice matters, and your perspective is unique.</p>
              <p style={{color : "white", fontSize : "17px"}}> Inspire others with your journey, raise awareness on important issues, or simply brighten someone's day with your words.</p>
              <p style={{color : "white", fontSize : "17px"}}> Postly is a respectful and welcoming space for everyone, regardless of background or belief.</p>
              
              {/* <button style={{backgroundColor: "#0b57d0"}}>Unlock now</button> */}
          </div>
          <div className="content-1-right">
            <img src={screen1} alt="" />
          </div>
      </div>
      
      <div className="content-2">
          <div className="content-2-left">
            <img src={screen1} alt="" />
          </div>
          <div className="content-2-right">
              
            <h2 style={{fontSize : "40px"}}> Explore Topics that Matter</h2>
              <h3 style={{color : "#a3debd", fontSize : "22px"}}>Postly is your platform to learn, grow, and connect with otherswho share your curiosity</h3>
              <p style={{color : "white", fontSize : "17px"}}> <span></span>Share stories, hacks, and advice that improve everyday life.</p>
              <p style={{color : "white", fontSize : "17px"}}> <span></span>Inspire and get inspire by experiences in learning and professional growth.</p>
              <p style={{color : "white", fontSize : "17px"}}> <span></span>Share your perspective on the issues that shape our world.</p>
              
              
          </div>
      </div>
      <div className="content-1">
          <div className="content-1-left">
              <h2 style={{fontSize : "40px"}}>Get what you need from scanned PDFs</h2>
              <p style={{color : "white", fontSize : "17px"}}>With Chrome, now you can search, select, or copy the text you want in scanned PDFs</p>
              <p style={{color : "white", fontSize : "17px"}}> 1. When you come across a scanned PDF on a webpage, open it in Chrome PDF viewer.</p>
              <p style={{color : "white", fontSize : "17px"}}> 1. When you come across a scanned PDF on a webpage, open it in Chrome PDF viewer.</p>
              {/* <button style={{backgroundColor: "#0b57d0"}}>Unlock now</button> */}
          </div>
          <div className="content-1-right">
            <img src={screen1} alt="" />
          </div>
      </div>
       
       <div className="selected-blogs">
        <h1>Explore the best</h1>
        <div className="zoom-mode" style={zoombox}>
        <i class="fa-solid fa-circle-xmark" style={{display : "flex", justifyContent : "right", padding: "4px 0px"}} onClick={()=>setzoombox({display : "none"})} ></i>
                        <div className="post-image" style={{display: "flex", justifyContent:"center"}}>
                          <img src={fetchhome.featuredimage} alt="image" style={{width:"400px"}} />
                      </div>
          <div className="post-creator">
            <h6 style={{paddingTop: "7px"}}>{fetchhome.creator}</h6>
          </div>
        <div className="post-category">
                         <h6>{fetchhome.postcategory}</h6> 

                         </div>
                        <div className="post-heading" >  
                          <h5>{fetchhome.posttitle}</h5>

                        </div>
                      
                        <div className="post-content" >
                        
                        {/* <h6 style={{color : "black", fontWeight:"400", lineHeight: "23px"}}>{trimcontent}<span>.....more⬇️</span></h6> */}
                        <h6 style={{color : "black", fontWeight:"400", lineHeight: "23px"}} >{expand ?fetchhome.postcontent:trimcontent}<span style={{cursor: "pointer"}} onClick={()=>isexpand(!expand)}>{expand?" less⬆️" : " ....more⬇️"} </span> </h6>
                        </div> 
                        </div>
        </div>
        <div className="selectedblog-lists" style={lowopacity}>
{postings.length > 0 ? (
              postings.slice(0, 6).map((listings) => (
                <div className="bloglists" key={listings.$id}>
                  <div className="bloglists-img">
                  <img src={listings.featuredimage} alt="image" style={{ height: "210px" }} /></div>
                  <h5 style={{color : "black", fontSize : "1.1rem"}}>{listings.posttitle}</h5>
                  <div className="plus-button" onClick={()=> zoomopen(listings.$id)} >
                  <i className="fa-solid fa-plus" style={{ color: "#393a5f"}}></i>

                  </div>
                </div>
               )) 
             ) : (
              <h1 style={{color : "white",textAlign : "center"}}>Loading...</h1>
             )} 
        </div>
       </div>
     {/* </div> */}
       <div className="footer" style={{padding : "35px 30px", textAlign : "center", color : "white"}}>
         <h2>Mystry</h2>
         <h6 style={{color : "white", padding: "7px 200px"}}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime impedit quas, itaque minima, placeat nemo ratione iste rem et doloribus doloremque sit sunt voluptatem aspernatur eveniet dolorem eaque vero mollitia.</h6>
         <div className="social-logos">
         <i className="fa-brands fa-facebook"></i>
         <i className="fa-brands fa-youtube"></i>
         <i className="fa-brands fa-x-twitter"></i>
         <i className="fa-brands fa-instagram"></i>
         </div>
         <div className="footer-bottom">
          <Link className="foot" to="/Home" >Home</Link>
          <Link className="foot" to="/signup" >Signup</Link>
          <Link className="foot" to="/Home" >About</Link>
          <Link className="foot" to="/Home" >Privacy & Terms</Link>
         </div>
       </div>
       </>



  )
}

export default Home;