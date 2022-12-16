// Express の哲学は、HTTP サーバー用の小型で堅牢なツールを提供することであり、
// シングル ページ アプリケーション、Web サイト、ハイブリッド、またはパブリック
// HTTP API のための優れたソリューションになります。
const express = require("express");
const app = express();
app.use(express.json());
// CORS は、さまざまなオプションで CORS を有効にするために使用できる
// Connect/Express ミドルウェアを提供するための node.js パッケージです。
const cors = require("cors");
app.use(cors());

// Multer は multipart/form-data を処理するための node.js
// ミドルウェアで、主にファイルのアップロードに使用されます。
// 最大限の効率を得るために busboy の上に書かれています。
const multer = require("multer");
const Brand = require("./db/brand");
const fs = require("fs");
var urls = [];
var files = [];
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    let result = await Brand.find({
      _id: new ObjectId(req.body.brandId),
    }).select("name");

    const dir = `uploads/${result[0].name}/${req.body.name.replace(/ /g, "_")}`;
    if (!fs.existsSync(`${__dirname}\\${dir}`)) {
      fs.mkdirSync(`${__dirname}\\${dir}`, { recursive: true });
    }

    urls.push(`${dir}`);
    files.push(`${file.originalname}`);

    cb(null, `${dir}`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// MongoDB は、アプリケーションの開発とスケーリングを容易にするために
// 設計されたドキュメント データベースです。
const { ObjectId } = require("mongodb");
const port = 3000;

// ファイルのインポート
require("./db/config");
// const Brand = require("./db/brand");
const Car = require("./db/car");
const Image = require("./db/image");
const token = require("./middleware");

const {
  signIn,
  signUp,
  getProfileByFilter,
  getProfileById,
} = require("./controller/profile");
// ログインした情報を承認するAPI
app.get("/sign-in", signIn);
// 新ユーザーを登録するAPI
app.post("/sign-up", signUp);
// 検索情報に対した、ユーザーを取得するAPI
app.get("/profile", token, getProfileByFilter);
// プロファイルIdに対した、ユーザーを取得するAPI
app.get("/profile/:id", token, getProfileById);

const { getRoles, getRoleNameById } = require("./controller/role");
// Roles取得API
app.get("/roles", token, getRoles);
app.get("/role/:id", token, getRoleNameById);

const { addCar, getImages } = require("./controller/car");
const { url } = require("inspector");
app.post("/car", upload.array("image", 12), addCar(urls, files));
app.get("/images", getImages);

// 車の一覧を取得する
app.get("/cars", token, async (req, res) => {
  try {
    // 車の一覧を取得する。
    let car = await Car.find().populate({
      // Collection名を記載する。
      path: "profileId brandId productId categoryId",
      // Collectionのアイテムを記載する。
      select: "name",
    });

    // 車の一覧を送る。
    res.send(car);
  } catch (error) {
    // エラーが発生される場合、エラーを送る。
    res.status(400).send({ result: `${error}` });
    throw error;
  }
});

app.get("/image", async (req, res) => {
  res.setHeader("Content-Disposition", "filename=" + "Ferrari SuperNova.jpg");
  res.sendFile(
    `${__dirname}/uploads/Ferrari/Ferrari SF90 Stradale/superior-logo-back.jpg`
  );
});

app.get("/download", async (req, res) => {
  res.setHeader(
    "Content-Disposition",
    "attachment;filename=" + "Ferrari SuperNova.jpg"
  );
  res.sendFile(
    `${__dirname}/uploads/Ferrari/Ferrari SF90 Stradale/superior-logo-back.jpg`
  );
});

function getUrls() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Image.find().select("url").distinct("url"));
    }, 2000);
  });
}

async function setStaticFiles() {
  const ans = await getUrls();
  ans.map((item) => {
    app.use(`/${item}`, express.static(`${__dirname}\\${item}`));
  });
}

setStaticFiles();

// ウェブサーバーを開始する。
app.listen(port, () =>
  console.log(`e-travel web server started @ port ${port}`)
);
