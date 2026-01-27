const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { v4: uuidv4 } = require("uuid");

const dynamo = require("../config/dynamodb");
const s3 = require("../config/s3");

const {
    ScanCommand,
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

const {
    PutObjectCommand,
    DeleteObjectCommand
} = require("@aws-sdk/client-s3");

/* ===================== READ ===================== */
router.get("/", async(req, res) => {
    const data = await dynamo.send(
        new ScanCommand({
            TableName: process.env.DYNAMODB_TABLE
        })
    );

    res.render("index", { products: data.Items || [] });
});

/* ===================== FORM ADD ===================== */
router.get("/add", (req, res) => {
    res.render("add");
});

/* ===================== CREATE ===================== */
router.post("/add", upload.single("image"), async(req, res) => {
    try {
        const { name, price, quantity } = req.body;

        if (!req.file) {
            return res.send("Vui lòng chọn hình ảnh sản phẩm");
        }

        const id = uuidv4();
        const imageKey = `products/${Date.now()}-${req.file.originalname}`;

        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: imageKey,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            })
        );

        const imageUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${imageKey}`;

        await dynamo.send(
            new PutCommand({
                TableName: process.env.DYNAMODB_TABLE,
                Item: {
                    id,
                    name,
                    price: Number(price),
                    quantity: Number(quantity),
                    url_image: imageUrl
                }
            })
        );

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Lỗi khi thêm sản phẩm");
    }
});

/* ===================== FORM EDIT ===================== */
router.get("/edit/:id", async(req, res) => {
    const data = await dynamo.send(
        new GetCommand({
            TableName: process.env.DYNAMODB_TABLE,
            Key: { id: req.params.id }
        })
    );

    res.render("edit", { product: data.Item });
});

/* ===================== UPDATE ===================== */
router.post("/edit/:id", upload.single("image"), async(req, res) => {
    try {
        const { name, price, quantity } = req.body;
        const { id } = req.params;

        let updateExpression = "set #n=:n, price=:p, quantity=:q";
        let expressionValues = {
            ":n": name,
            ":p": Number(price),
            ":q": Number(quantity)
        };

        // Nếu có upload ảnh mới
        if (req.file) {
            const oldData = await dynamo.send(
                new GetCommand({
                    TableName: process.env.DYNAMODB_TABLE,
                    Key: { id }
                })
            );

            if (oldData.Item && oldData.Item.url_image) {
                const oldKey = oldData.Item.url_image.split(".com/")[1];

                await s3.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.S3_BUCKET,
                        Key: oldKey
                    })
                );
            }

            const newImageKey = `products/${Date.now()}-${req.file.originalname}`;

            await s3.send(
                new PutObjectCommand({
                    Bucket: process.env.S3_BUCKET,
                    Key: newImageKey,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype
                })
            );

            const newImageUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${newImageKey}`;

            updateExpression += ", url_image=:img";
            expressionValues[":img"] = newImageUrl;
        }

        await dynamo.send(
            new UpdateCommand({
                TableName: process.env.DYNAMODB_TABLE,
                Key: { id },
                UpdateExpression: updateExpression,
                ExpressionAttributeNames: {
                    "#n": "name"
                },
                ExpressionAttributeValues: expressionValues
            })
        );

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Lỗi khi cập nhật sản phẩm");
    }
});

/* ===================== DELETE ===================== */
router.get("/delete/:id", async(req, res) => {
    try {
        const data = await dynamo.send(
            new GetCommand({
                TableName: process.env.DYNAMODB_TABLE,
                Key: { id: req.params.id }
            })
        );

        if (data.Item && data.Item.url_image) {
            const imageKey = data.Item.url_image.split(".com/")[1];

            await s3.send(
                new DeleteObjectCommand({
                    Bucket: process.env.S3_BUCKET,
                    Key: imageKey
                })
            );
        }

        await dynamo.send(
            new DeleteCommand({
                TableName: process.env.DYNAMODB_TABLE,
                Key: { id: req.params.id }
            })
        );

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Lỗi khi xoá sản phẩm");
    }
});

module.exports = router;