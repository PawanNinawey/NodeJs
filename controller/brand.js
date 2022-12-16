const Brand = require("../db/brand");
const { ObjectId } = require("mongodb");

// これは、draft-ietf-oauth-json-web-token-08 に対して開発されました。
// node-jws を利用します。
const jwt = require("jsonwebtoken");
const fs = require("fs");
const jwtKey = fs.readFileSync("./common/private.key", "utf8");

const getBrands = async (req, res, next) => {
  try {
    // ブランド一覧を取得する。
    const result = await Brand.find();

    // ブランド一覧を送る。
    res.status(200).send(result);
  } catch (error) {
    // エラーが発生される場合、エラーを送る。
    res.status(400).send(`${error}`);
    throw error;
  }
};

const getBrandNameById = async (req, res, next) => {
  try {
    // ブランドを検索する。
    const result = await Brand.findOne({
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

module.exports = { getBrands, getBrandNameById };
