const Product = require("../db/product");
const { ObjectId } = require("mongodb");

// これは、draft-ietf-oauth-json-web-token-08 に対して開発されました。
// node-jws を利用します。
const jwt = require("jsonwebtoken");
const fs = require("fs");
const jwtKey = fs.readFileSync("./common/private.key", "utf8");

const getProducts = async (req, res, next) => {
  try {
    // プロダクト一覧を取得する。
    const result = await Product.find();

    // プロダクト一覧を送る。
    res.status(200).send(result);
  } catch (error) {
    // エラーが発生される場合、エラーを送る。
    res.status(400).send(`${error}`);
    throw error;
  }
};

const getProductNameById = async (req, res, next) => {
  try {
    // プロダクトを検索する。
    const result = await Product.findOne({
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

module.exports = { getProducts, getProductNameById };
