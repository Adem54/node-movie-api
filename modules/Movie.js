//model dosyalarının başharfi büyük olur bunun sebebide aynı isimde rooter da dosya oluştururken başharfi büyük olanın model dosyası oldğunu anlarız

const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const {String,Number,ObjectId}=Schema.Types

const MovieSchema=new Schema({
director_id:ObjectId,//Burası ObjectId olmalı çünkü director collectionundaki id ile join işlemi çakıştırma işlemi yapacağız
title:{
    type:String,
    required:true
},
category:String,
country:String,
year:Number,
imdb_score:Number,//imdb puan ortalaması
createdAt:{
    type:Date,
    default:Date.now
}
})

//Biz router da promise kullanmak için burda promise tanımlaması yaparak global Promise kullanabiliriz bu doğrudan mongoose ta olan bir fonksiyon
mongoose.Promise=global.Promise
module.exports=mongoose.model("movie",MovieSchema);
//"movie" ismi collection ismimiz