const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const { Director } = require("../modules");

//yönetmenlerin sahip olduğu filmlerin gösterilmesi
router.get("/", (req, res) => {
  const promise = Director.aggregate([
    {
      $lookup: {
        from: "movies",
        localField: "_id",
        foreignField: "director_id",
        as: "movies"
      }
    },
    {
      $unwind: {
        path: "$movies",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          _id: "$_id",
          name: "$name",
          surname: "$surname"
        },
        movies: {
          $push: "$movies"
        }
      }
    },
    {
      $project: {
        _id: "$_id._id",
        name: "$_id.name",
        surname: "$_id.surname",
        bio: "$_id.bio",
        movies: "$movies"
      }
    }
  ]);
  promise
    .then(data => {
      res.json(data);
    })
    .catch(error => res.json(error));
});

///api/directors/:director_id	  Aradığımız bir director un verilerini filmleri ile beraber  getirilmesi

router.get("/:director_id", async (req, res) => {
  try {
    const { director_id } = req.params;
    const data = await Director.aggregate([
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "director_id",
          as: "movies"
        }
      },
      {
        $unwind: {
          path: "$movies",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: {
            _id: "$_id",
            name: "$name",
            surname: "$surname"
          },
          movies: {
            $push: "$movies"
          }
        }
      },
      {
        $project: {
          _id: "$_id._id",
          name: "$_id.name",
          surname: "$_id.surname",
          bio: "$_id.bio",
          movies: "$movies"
        }
      },
      {
        $match: {
          //Burda id yi bizim object_id tipinde yollamamız gerekiyor
          _id: ObjectId(director_id)
        }
      }
    ]);
    res.json(data);
  } catch (error) {
    res.json(error);
  }
});

///api/directors/:director_id	  ile put işlemi yapma

router.put("/:director_id", async (req, res) => {
  try {
    const { director_id } = req.params;
    const data = await Director.findByIdAndUpdate(director_id, req.body, {
      new: true
    });
    res.json(data);
  } catch (error) {
    res.json(error);
  }
});

//api/directors yöntemen ekleyen post endpointinin yazılması
router.post("/", async (req, res, next) => {
  const director = new Director(req.body);

  try {
    const data = await director.save();
    res.json(data);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;

//group ve project i iyice anlaayalım iyice bakalım

/* 
BURASI ÇOOOK ÖNEMLİ.....


//yönetmenlerin sahip olduğu filmlerin gösterilmesi
router.get("/",(req,res)=>{
    const promise=Director.aggregate([
        {
            $lookup:{//Burda çakışan kısımlar iki field alana ayrılıyor iki satır a ayrılıyor birisi _id adı diğerinin adı direction_id veya as olarak ne verdi isek odur
                from:"movies",//collection ismi mongodb de çoğul olarak kaydediliyor ondan dolayı collection ismini çoğull olarak girmemiz önemlidir
                localField:"_id",//localField e biz _id yaptık o zaman localField altında name,surname,_id ve bio vardır
                foreignField:"director_id",
                as:"movies"
            }
        },
        {
            $unwind:{
                path:"$movies",//burası biz bu sayfadaki _id fieldına hangi field ı bağladık director_id yi bağladık ve ona da movies ismini verdik yani biz path olarak $movies ya da director_id de kullanabiiriz
                preserveNullAndEmptyArrays:true//burayı yazınca id si çakışmayan director lerde gelir
            }
        },
        {//Yukardaki işlemlerle id si çakışan directorlari getiriyor ama herbir film içerisinde director u de geliyor ancak bir director un 3 filmi varsa her üçünde de director isimleri geliyor.Biz bu şekilde istemiyoruz biz bir director bilgileri ve onun yanında onun filmlerinin bilgilerinin gelmesini istiyoruz bunun için ise $group yöntemini kullanırız 
            $group:{//group dediğmiz zaman biz bir gruplama mantığı demeek şu demeek eğer datalarımız gereksiz yere birden fazla yazılmışsa ayrı ayrı arraylerde veya objelerde o zaman biz bu  tekrarlamalar olmaması  ve veriye daha kolay ulaşma adına gruplama yaparız
                //group mantığında eğer join işlemi gibi bir $lookup yapmış ve localField ve foreignField belirlemişsek o zaman localField her ne ise onun adı bir objedir ve lokaldeki yani bu collection daki properties ler başlıklar name,surname gibi bunlar o id altındaki properties lerdir yani normalde biz tek bir veri ile gruplayacak olsak o zaman da _id:"$name" şeklinde yazardık
                
                //öncelikle burda group içindeki çakışmalarda bu director de biz _id diye çakıştırmıştık ondan dolayı biz _id diye yazınca id bir objedir ve içerisinde name,surname,bio vardır.Biz _id ye localField demiştik ondan dolayı gruplamada obje ismi localField adı _id olabilir ancak 
                _id:{
                    _id:"$_id",
                    name:"$name",
                    surname:"$surname"
                },
                movies:{//biz movies collectionından gelen değerin adını as: "movies" demiştik ondan dolayı adı ya movies olmalı ya da direction_id olmalı foreignField adı olan direction_id de yapsak olur 
                    $push:"$movies"//unwind deki "$movies" datası direk olarak buraya push edilir yani gruop deyince neleri gruplayacağız ona bakmamız gerekiyor 
                }
            }  

        },{//$project ile de $project kullanmadan önce verilerimizde bir ayıklama daha düzenli yazma ve istediğimiz verileri yazma işlemini yapıyoruz ki bura da  biz id ile yazdığmız director verileri id başlıklı bir obje içerisinde ggelmişti ve o obje kapandıktan sonra movies adlı bir dizi ile filmler gelmişti biz id isimli objenin id ismini olmamasını doğrudan obje içine id,name,surname,bio elemanlarını yazılmasını ve movies adlı diziznin de bu objenin bir elemanı olarak yazılmasını istiyorum onun için burda bir düzenleme yapalım
            $project:{
                _id:"$_id._id",
                name:"$_id.name",
                surname:"$_id.surname",
                bio:"$_id.bio",
                movies:"$movies"
            }

        }
    ])
promise.then((data)=>{
    res.json(data)
}).catch(error=>res.json(error))
} );



*/
