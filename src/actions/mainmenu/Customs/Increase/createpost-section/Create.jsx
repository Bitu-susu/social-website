import React from 'react'

function Create() {
  function opacitychanger() {
                      setlowopacity({opacity : "0.1"})
                      setpostdisplay({display : "block"})
                 }

                 function postboxclose() {
                    setlowopacity({opacity : "1.0"})
                    setpostdisplay({display : "none"})
                }

  return (
    <div>

      <div className="posting" style ={postdisplay}>
         <div className="fullposting">
         <div className="posting-top">
         <h6 style={{padding : "4px 8px", backgroundColor :"#0b57d0",color : "white", borderRadius : "20px"}} >{firstletter}</h6>
            
            <h6 style={{color : "white"}}>{user}</h6>
            <i className="fa-solid fa-xmark" onClick={postboxclose}  style={{color: "white",position: "absolute", right : "0px", zIndex:"4"}}></i>
            </div>
            <div className="posting-bottom">
            <form action="" className='postform' onSubmit={addingposts}>
          <div className="post-form-top">
  <input type="text" name="" id="" required  value={title} onChange={(e)=>settitle(e.target.value)} placeholder='post content' style={{width :"70%", height:"40px", bordedr : "none"}}/>
  <select name="" id="" required  value={category} style={{border : "none"}} onChange={(e)=>setcategory(e.target.value)}>
    <option value="">Select post category</option>
    <option value="AI">AI</option>                       
    <option value="Science">Science & Technology</option>
    <option value="EV">EV</option>
    <option value="Business & Startup">Business & Startup</option>
    <option value="Politics">Politics</option>
    <option value="Stock Market">Stock Market</option>
    <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
    <option value="Culture">Culture</option>
    <option value="Others">Others</option>
  </select>
  </div>
  <JoditEditor 
        ref={editor}
        value={content}
        onChange={setcontent}
   
         />
         <div className="with-submit">
         <div className="post-form-image" style={{marginTop : "10px"}}>
         <label htmlFor="" style={{color : "white"}}>Cover image</label>
         <input type="file" name="" id="uploader" style={{color : "white"}}  required />
         </div>
         <div className="popularreadings">
          <button className='post-submit' style={{backgroundColor : "#0b57d0"}}>Submit</button>
         </div>
         </div>
            <div className="post-form-result">

              {/* <h6>{success}</h6> */}
            </div>
         </form>
         
              </div>
              </div>
          </div>  
      
    </div>
  )
}

export default Create
