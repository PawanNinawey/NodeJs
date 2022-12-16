const Car = require("../db/car");
const Image = require("../db/image");
const { ObjectId } = require("mongodb");

// これは、draft-ietf-oauth-json-web-token-08 に対して開発されました。
// node-jws を利用します。
const jwt = require("jsonwebtoken");
const fs = require("fs");
const jwtKey = fs.readFileSync("./common/private.key", "utf8");

// 車の一覧を取得する。
const getCars = async (req, res, next) => {
  try {
    // 車一覧を取得する。
    const result = await Car.find();

    // 車一覧を送る。
    res.status(200).send(result);
  } catch (error) {
    // エラーが発生される場合、エラーを送る。
    res.status(400).send(`${error}`);
    throw error;
  }
};

// 車ＩＤに対して、車情報を取得する。
const getCarById = async (req, res, next) => {
  try {
    // 車を検索する。
    const result = await Car.findOne({
      _id: new ObjectId(req.body),
    });

    // 検索された結果とトークンを送る。
    res.status(200).send(result);
  } catch (error) {
    // エラーが発生される場合、エラーを送る。
    res.status(400).send(`${error}`);
    throw error;
  }
};

// 車情報を登録する。
const addCar = (urls, files) =>
  async function (req, res, next) {
    try {
      // 車の情報を登録する
      const car = new Car(req.body);
      const result = await car.save();

      // 車のイメージを登録する
      await urls.map((url, i) => {
        const image = new Image({
          carId: new ObjectId(result._id),
          url: url,
          file: files[i],
        });
        image.save();
      });

      // 検索された結果とトークンを送る。
      res.status(200).send({ result });
    } catch (error) {
      // エラーが発生される場合、エラーを送る。
      res.status(400).send(`${error}`);
      throw error;
    }
  };

// 車の一覧を取得する。
const getImages = async (req, res, next) => {
  try {
    // 車一覧を取得する。
    const results = await Image.find({
      _carId: new ObjectId("639cca226689bd61ab5de15e"),
    }).select("url file");
    var html = "";
    console.log(results);
    results.map((result, i) => {
      html =
        html + `<img src="http://localhost:3000/${result.url}/${result.file}">`;
    });
    // 車一覧を送る。
    res.status(200).send(html);
  } catch (error) {
    // エラーが発生される場合、エラーを送る。
    res.status(400).send(`${error}`);
    throw error;
  }
};

module.exports = { getCars, getCarById, addCar, getImages };
