var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
let express = require("express");


let router = express.Router();


// deltaオブジェクトAPIのバージョンを返却する
router.get("/version", function (req, res, next) {
  console.log("version 0.0.1");
  // res.send("version 0.0.1");
  // ejsテンプレートを利用してビューをレンダリング
  res.render("./quill.ejs", {
    version: "0.0.1",
  })
});


/**
 * deltaオブジェクトをhtmlに変換する
 */
router.post("/convert/", (req, res, next) => {

  let delta = null;
  if (req.body["delta"]) {
    // JSON.parseは同期的処理なため気をつける
    // deltaオブジェクトがpostされている場合
    delta = JSON.parse(req.body["delta"]);
    if (delta["ops"]) {
      let cfg = {
        customCssClasses: function (option) {
          if (option["attributes"]["header"] && option["attributes"]["header"] === 2 ) {
            return "__custom__";
          }
        }
      };
      let converter = new QuillDeltaToHtmlConverter(delta.ops, cfg);
      let html = converter.convert();
      // console.log(html);
      res.send(html);
    } else {
      console.log("deltaオブジェクトはpostされているが opsプロパティが存在しなかった");
    }
  } else {
    return res.send("error");
  }
})


module.exports = router;
