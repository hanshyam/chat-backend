import jwt from 'jsonwebtoken';

const generateJwtToken = (user)=>{
   return jwt.sign({
        user:{
            id:user?.id,
            name:user?.fullName,
            email:user?.email
        },
        

    },process.env.MY_TOKEN_STRING,{
        expiresIn:"1d"
    })
}

export default generateJwtToken;