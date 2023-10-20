var express = require("express");
var router = express.Router();

const { body, check, validationResult } = require("express-validator");
const {
  validateTxn,
  runValidation,
} = require("../validate/validateTransaction");
/*var mid = '19010';
var username = '1021705';
var password = '74b1K5k2';
var secret = 'P43WoR9jcQkB7UOh';*/
var mid = "293856";
var username = "JfXAvB2kXZ";
var password = "v5x8vA4K";
var secret = "5d3VVJ3W4AC99ayR";

var now = new Date();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/txn", function (req, res, next) {
  console.log(req.body);
  res.render("txn", { title: "Express" });
});

router.post("/sendtoairpay", function (req, res, next) {
  try {
    var md5 = require("md5");
    var sha256 = require("sha256");
    var dateformat = require("dateformat");
    alldata =
      req.body.buyerEmail +
      req.body.buyerFirstName +
      req.body.buyerLastName +
      req.body.buyerAddress +
      req.body.buyerCity +
      req.body.buyerState +
      req.body.buyerCountry +
      req.body.amount +
      req.body.orderid;
    udata = username + ":|:" + password;
    privatekey = sha256(secret + "@" + udata);
    const keySha256 = sha256(username + "~:~" + password);
    aldata = alldata + dateformat(now, "yyyy-mm-dd");
    checksum = sha256(keySha256 + "@" + aldata); //md5(aldata+privatekey);
    fdata = req.body;
    console.log({ checksum });
    res.render("sendtoairpay", {
      mid: mid,
      data: fdata,
      privatekey: privatekey,
      checksum: checksum,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/responsefromairpay", function (req, res, next) {
  var CRC32 = require("crc-32");
  var txnhash = CRC32.str(
    req.body.TRANSACTIONID +
      ":" +
      req.body.APTRANSACTIONID +
      ":" +
      req.body.AMOUNT +
      ":" +
      req.body.TRANSACTIONSTATUS +
      ":" +
      req.body.MESSAGE +
      ":" +
      mid +
      ":" +
      username
  );

  var chmod = req.body.CHMOD;
  var custmvar = req.body.CUSTOMERVPA;
  if (chmod === "upi") {
    txnhash = CRC32.str(
      req.body.TRANSACTIONID +
        ":" +
        req.body.APTRANSACTIONID +
        ":" +
        req.body.AMOUNT +
        ":" +
        req.body.TRANSACTIONSTATUS +
        ":" +
        req.body.MESSAGE +
        ":" +
        mid +
        ":" +
        username +
        ":" +
        custmvar
    );
  }
  txnhash = txnhash >>> 0;
  txndata = req.body;
  console.log(txndata.ap_SecureHash);
  console.log(txnhash);

  res.render("response", { txnhash: txnhash, txndata: txndata });
});

module.exports = router;
