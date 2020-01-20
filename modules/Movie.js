//model dosyalarının başharfi büyük olur bunun sebebide aynı isimde rooter da dosya oluştururken başharfi büyük olanın model dosyası oldğunu anlarız

const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const {String,Number,ObjectId}=Schema.Types

const MovieSchema=new Schema({
director_id:ObjectId,//Burası ObjectId olmalı çünkü director collectionundaki id ile join işlemi çakıştırma işlemi yapacağız
title:{ 
    type:String,
    required:[true,'`{PATH}` alanı zorunludur'],//biz eğer bu alan yazılmadığında bir mesaj vermek istersek o zaman bu veriyi dizi  olarak yazarız.{PATH} demek title demektir yani properties adı {PATH} demektir
    maxlength:[20,'`{PATH}` alanı (`{VALUE}`), `{MAXLENGTH}` karakterinden küçük olmalıdır'],
    minlength:[5,'`{PATH}` alanı (`{VALUE}`), `{MINLENGTH}` karakterinden büyük olmalıdır']
},
category:{type:String,
maxlength:30,//Bu şekilde de kullanabilirz yukardaki gibi de kullanabiliriz
minlength:4},
country:String,
year:{type:Number,max:2020,min:1980},
imdb_score:{type:Number,max:50,min:10},//imdb puan ortalaması
createdAt:{
    type:Date,
    default:Date.now
}
})

//Biz router da promise kullanmak için burda promise tanımlaması yaparak global Promise kullanabiliriz bu doğrudan mongoose ta olan bir fonksiyon
mongoose.Promise=global.Promise
module.exports=mongoose.model("movies",MovieSchema);
//"movie" ismi collection ismimiz ancak bu movie ismi mongodb de çoğul olarak yazılır ondan dolayı en iyisi bizde burda çoğul yapalım ki sonra root larda işlem yaparken $lookup da collection ismiini yanlış yazınca sonuç alamayız ondan dolayı en başta burda buna dikkat edelimm