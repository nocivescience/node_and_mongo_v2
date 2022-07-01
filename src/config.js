const {config}=require('dotenv');
config();
const configurations={
    port:process.env.PORT || 3000,
};
module.exports=configurations //ojo aca solo se trabaja con module.exports=configurations