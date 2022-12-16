const Category = require("../db/category");
const { ObjectId } = require("mongodb");

// これは、draft-ietf-oauth-json-web-token-08 に対して開発されました。
// node-jws を利用します。
const jwt = require("jsonwebtoken");
const fs = require("fs");
const jwtKey = fs.readFileSync("./common/private.key", "utf8");

const getCategories = async (req, res, next) => {
  try {
    // カテゴリー一覧を取得する。
    const result = await Category.find();

    // カテゴリー一覧を送る。
    res.status(200).send(result);
  } catch (error) {
    // エラーが発生される場合、エラーを送る。
    res.status(400).send(`${error}`);
    throw error;
  }
};

const getCategoryNameById = async (req, res, next) => {
  try {
    // カテゴリーを検索する。
    const result = await Category.findOne({
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

module.exports = { getCategories, getCategoryNameById };
