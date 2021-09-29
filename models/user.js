const mongoose= require('mongoose')
const validator= require('validator')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
mongoose.connect('mongodb://127.0.0.1:27017/user-api',{useUrlParser:true})

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
     required:true
    },
    email:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid email')
            }
        }
       
    },
    tokens:[{
        token:{
            type:String,
            required:true

        }
    }]
})
const User= mongoose.model('users',userSchema)
userSchema.pre('save',async function(next){
    const user= this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
userSchema.methods.generateAuthToken=async function(){
    const user= this 
    const token = jwt.sign({id:user.id.toString()},'thisismyapp')
    user.tokens=user.tokens.concat({token})
    return token
    


}
userSchema.method.findBydata= async function(email,password){
    const user= await User.findOne({email})
    if(!user){
        throw new Error('user doesnot exist')
    }
    const match= await bcrypt.compare(password,user.password)
    if(!match){throw new Error('invalid password')
    }
    return user

}

module.exports= User
