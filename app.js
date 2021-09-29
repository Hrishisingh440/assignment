const express= require('express')
const app=express()
const User= require('./models/user')
const auth=require('./middleware/auth')

app.post('/signup',async (req,res)=>{
    const user =  new User(req.body)
    try {
        await user.save()
        const token =await  user.generateAuthToken()
        res.send({user,token})
    }
    catch(e){
        res.send(e)
    }
})
app.post('/login',async(req,res)=>{
    try{
        const user= await User.findByData(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
        
    }
    catch(e){
        res.send(e)
    }
})
app.get('/login/user',auth,async(req,res)=>{
    res.send(req.user)

})
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.send()
    }
})
app.listen(3000,()=>{
    console.log('Running on server')
})