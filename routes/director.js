const express=require("express");
const router=express.Router();

const {Director}=require("../modules");


//api/directors get endpointini yazılması
router.get("/",async (req,res,next)=>{
    try {
        const data=await Director.find({})
        res.json(data)
    } catch (error) {
        res.json(error)
        
    }
})
//api/directors post endpointini yazılması
router.post("/",async (req,res,next)=>{
    /*
    const {name,surname,bio}=req.body
    const director=new Director({
        name:name,
        surname:surname,
        bio:bio
    })
   */
  const director=new Director(req.body)
    
    try {
        const data=await director.save();
        res.json(data)
    } catch (error) {
        res.json(error)
    }

})

module.exports=router