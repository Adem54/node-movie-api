//movie endpoint i
var express = require("express");
var router = express.Router();
const {ErrorHandler}=require("../helper/error");
//Şimdi verimizi ekleyelim
const { Movie } = require("../modules");
const mongoose=require("mongoose")
const {ObjectId}=mongoose.Types

//Tüm filmleri directors leri ile birlikte  veren endpointin yazılması
router.get("/",async (req,res)=>{
   //bu şekilde tamamını getirebiliriz
  try {
    const data=await Movie.aggregate([
      {
        $lookup:{
          from:"directors",
          localField:"director_id",
          foreignField:"_id",
          as:"director"
        }
      },
      {
        $unwind:{
          path:"$director"
        }
      }
    ])//.exec() ile bize bir promise dönecektir
    res.json(data)  
  } catch (error) {
    res.status(500).send(err);
  }

})

//Biz bu top10 endpointini eğer üstte id ye göre getiren get methodu ile çakışıyor ondan dolayı bizim burda url de postman da top10 yazınca onu id gibi algılayıp hata veriyor ondan dolayı biz bu endpointi eğer o id ye göre getiren get methodunun üzerine yazarsak onu ezecektir ve çalışacaktır
//top 10 endopointinin yazılması
//önce limit yazılıp sonra sıralama yapılsa da olur tam tersi yapılsa da sonuç gelir 
router.get("/top10",async (req,res,next)=>{
  try {
    const data=await Movie.find({}).sort({imdb_score:-1}).limit(10)

    res.json(data)
  } catch (error) {
    res.json(error)
  }
})




//filmdetay endpointinin yazılması-movie_id verince o movie nin gelmesi
//Hata yönetimi
router.get("/:movie_id",async (req,res,next)=>{
  const movie_id=req.params.movie_id
 
  try {
    const data=await Movie.findById(movie_id)
 
    res.json(data)
  } catch (error) {
    res.json(error)
  }
})




//movie güncelleme endpointini yazılması

router.put("/:movie_id",async (req,res,next)=>{
  const {movie_id}=req.params
  try {
    const updateData=await Movie.findByIdAndUpdate(movie_id,req.body,{new:true})
    res.json(updateData)//buraya eski data gelir yine de ancak req.body den sonra {new:true} dersek o zaman güncellenen datayı dönecektir bize
  } catch (error) {
    res.json(error)
  }
})

//movie silme endpointini yazılması
router.delete("/delete/:movie_id", async (req,res,next)=>{
  const {movie_id}=req.params
  try {
    const data=await Movie.findByIdAndRemove(movie_id)//silinen data gelir burda istersek de silindiğini anlamak için {status:1} gibi birşey de yazabilriiz
    res.json(data)
  } catch (error) {
    res.json(error)
  }

})

//Verilen iki yıl arasındaki filmleri listeleyen endpointin yazılması
///api/movies/between/:start_year/:end_year

router.get("/between/:start_year/:end_year", async (req,res,next)=>{
  const {start_year,end_year}=req.params;

  try {
    const data=await Movie.find({//Burda sayılar bize string olarak geldiği için biz karşılaştırma yapabilmemiz için onları integer a çeviririz tekrardan
      year:{"$gte":parseInt(start_year),"$lte":parseInt(end_year)}
      //$gte: büyük ve eşit ,$gt=büyük,$lte=küçük ve eşit,$lt=küçük
})
res.json(data)
  } catch (error) {
    console.log(error)
  }
 
  
})



router.post("/", async (req, res, next) => {
  const movie = new Movie(req.body);
  try {
    const promise = await movie.save();
    res.json(promise);
    //res.send(movie.category)
  } catch (error) {
    res.status(500).send(error);
  }
});

//Tüm filmeleri dönen endpointi yazalım şimdi de

module.exports = router;

/*

//movie endpoint i için film kaydetmemizi sağlayan post methodunu yazalım şimdi...
//node.js de bodyParser adında bir modül var bu modül express-generator içerisinde zaten geliyor
//Yaptığı iş şu sizin gönderdiğiniz post datasını alıp sizin kullanımınıza obje olarak veren bir modül bu modül sayesinde post datasını alıp kullanabiliriz
//Ancak şunu unutmayalım eğer reqBody modülünü kurup gerekli ayar düzenlemelerini yapmassak app.js de app.use(bodyParser.json()) ,app.use(bodyParser.urlencoded({ extended: true })); bunları yapmassak req.body yi alamayız
//Ayrıca postam e gidip post man de req kısmında üst teki kısımda body de raw da json veri tipini seçip bir json nesnesi eklersek biz o eklediğmiz veriyi req.body ile alabiliriz...
//req nesnesi  içerisinde body adında bir obje var.Bu obje bizim gönderdiğmiz post body sini burda barındırıyor




router.post('/', async (req, res, next)=> {
  /* const {title,imdb_score,category,country,year}=req.body
  const movie=new Movie({//director_id yi director collection ı hazırlanınca kullanacağız burda
    title:title,
    imdb_source:imdb_score,
    category:category,
    country:country,
    year:year
  })   

  //Mesela bizim çok büyük verimiz var 40 tane alanımız var girmemiz gereken hepsini tek tek girmeye gerek yok doğrudan req.body yi new Movie() içerisine girmemiz yeterlidir
  const movie=new Movie(req.body)


/*
  movie.save((err,data)=>{
    if (err) res.json(err) //Bizim collection ımızın schema kısmında belirttiğimiz valdasyonlardan herhangi birine uymazsak hata alırız mesela required:true veya unique:true olarak vermiş ve kullanmamışsak ya da unique olması gerekirken aynı veriyi tekrar kullanırsak hata alırız
       
   //Biz kaydedildiği durumda bir json verisi verip bu veriyi dön  de diyebiliriz eğer bu veri dönüyorsa biliriz ki verimiz kaydedilmiştir ve gidip mongo db de kontrol ederiz verimizi
    res.json({status:1})
   //res.json(data)//veri tabanına kaydedildikten sonra veritabanına ne kaydetti ise o ilgili datayı döner
  })
  */

/* 
  THAN-CATCH YÖNTEMİ İLE PROMİSE KULLANIM
  //await nereye yapıyorsam ondan sonra then yapılabilir demektir ve await ile veriyi neye eşitliyorsam o da then yapınca parametre olarak aldığımı ver i demektir diyebiliriz
 const promise=movie.save()
 promise.then(data=>{
   res.json(data)
 }).catch(err=>res.json(err))
 
//ASYNC AWAİT İLE PROMİSE KULLANIM-En başta en yukardaki ilk callback fonksiyonnun async ile başlatırız
try {
  const promise=await movie.save();
  res.json(promise.country)
  //res.send(movie.category)
} catch (error) {
  res.status(500).send(err);
}

 // res.json(country);//Eğer alacağımız veri json ise o zaman res.json ile alabiliriz 
});  */
