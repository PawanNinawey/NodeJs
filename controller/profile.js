const Profile = require("../db/profile");
const { ObjectId } = require("mongodb");

// これは、draft-ietf-oauth-json-web-token-08 に対して開発されました。
// node-jws を利用します。
const jwt = require("jsonwebtoken");
const fs = require("fs");
const jwtKey = fs.readFileSync('./common/private.key', 'utf8');

// ログイン承認API
const signIn = async (req, res, next) => {
  try {
    // プロファイルを検索する。
    const result = await Profile.findOne(req.body).select("name");
    // トークンを生成する。
    const secretkey = jwt.sign({ auth: result }, jwtKey, {
      expiresIn: "2h",
    });

    // 検索された結果とトークンを送る。
    res.status(200).send({ name: result, auth: `${secretkey}` });
  } catch (error) {
    // エラーが発生される場合、エラーを送る。
    res.status(400).send({ result: `${error}` });
    throw error;
  }
};

const signUp = async (req, res, next) => {
  // プロファイル情報を取得する。
  const profile = new Profile(req.body);

  try {
    // プロファイルを登録する。
    const result = await profile.save();

    // トークンを生成する。
    const secretkey = jwt.sign({ auth: result }, jwtKey, {
      expiresIn: "2h",
    });

    // 登録された結果とトークンを送る。
    res.status(200).send({ result: result, auth: `${secretkey}` });
  } catch (error) {
    // エラーが発生される場合、エラーを送る。
    res.status(400).send({ result: `${error}` });
    throw error;
  }
};

const getProfileById = async (req, res, next) => {
  try {
    // プロファイルを検索する。
    const result = await Profile.findOne({
      _id: new ObjectId(req.params.id),
    }).populate({
      path: "roleId",
      select: "name",
    });

    // 検索された結果とトークンを送る。
    res.status(200).send({ result });
  } catch (error) {
    // エラーが発生される場合、エラーを送る。
    res.status(400).send({ result: `${error}` });
    throw error;
  }
};

const getProfileByFilter = async (req, res, next) => {
  try {
    // プロファイルを検索する。
    const result = await Profile.findOne({
      _id: new ObjectId(req.body),
    }).populate({
      path: "roleId",
      select: "name",
    });

    // 検索された結果とトークンを送る。
    res.status(200).send({ result });
  } catch (error) {
    // エラーが発生される場合、エラーを送る。
    res.status(400).send({ result: `${error}` });
    throw error;
  }
};

module.exports = { signIn, signUp, getProfileById, getProfileByFilter };
