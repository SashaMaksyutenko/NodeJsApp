const Sequelize=require('sequelize');
const sequelize=new Sequelize('node-complete','root','mynameissasha8724',{dialect:'mysql',host:'localhost'});
module.exports=sequelize;
