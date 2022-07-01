const {config}=require('dotenv');
config();
const configurations={
    port:process.env.PORT || 3000,
};
module.exports=configurations;