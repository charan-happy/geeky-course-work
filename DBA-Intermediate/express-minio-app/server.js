import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import minioClient from "./minioClient.js";

dotenv.config();
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const bucket = process.env.MINIO_BUCKET;

// ✅ Home Page with Gradient Background
app.get("/", async (req, res) => {
  let files = [];
  try {
    const stream = minioClient.listObjectsV2(bucket, "", true);
    stream.on("data", obj => files.push(obj.name));
    stream.on("end", () => {
      res.send(`
        <html>
          <head>
            <title>📂 MinIO File Upload Portal</title>
            <style>
              * { box-sizing: border-box; }
              body {
                font-family: 'Segoe UI', Tahoma, sans-serif;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: #fff;
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .container {
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(10px);
                padding: 30px 40px;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
                width: 500px;
                text-align: center;
              }
              h1 {
                margin-bottom: 20px;
                color: #fff;
                letter-spacing: 1px;
              }
              form {
                margin-bottom: 30px;
              }
              input[type="file"] {
                padding: 10px;
                border: none;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: #fff;
              }
              button {
                margin-top: 10px;
                padding: 10px 20px;
                border: none;
                background: #43cea2;
                background: linear-gradient(to right, #30cfd0, #330867);
                color: #fff;
                font-weight: bold;
                border-radius: 8px;
                cursor: pointer;
                transition: transform 0.2s ease;
              }
              button:hover {
                transform: scale(1.05);
              }
              ul {
                list-style-type: none;
                padding: 0;
                margin: 0;
                text-align: left;
                max-height: 250px;
                overflow-y: auto;
              }
              li {
                background: rgba(255, 255, 255, 0.2);
                padding: 10px;
                margin-bottom: 8px;
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              a {
                color: #fff;
                text-decoration: none;
                margin-right: 10px;
              }
              a:hover {
                text-decoration: underline;
              }
              .delete {
                color: #ff6b6b;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🚀 MinIO File Upload</h1>
              <form action="/upload" method="post" enctype="multipart/form-data">
                <input type="file" name="file" required />
                <br />
                <button type="submit">Upload File</button>
              </form>
              <h3>Uploaded Files</h3>
              <ul>
                ${
                  files.length > 0
                    ? files
                        .map(
                          f => `
                          <li>
                            <a href="/file/${f}" target="_blank">${f}</a>
                            <a href="/delete/${f}" class="delete">🗑 Delete</a>
                          </li>`
                        )
                        .join("")
                    : "<p>No files uploaded yet.</p>"
                }
              </ul>
            </div>
          </body>
        </html>
      `);
    });
  } catch (err) {
    console.error("List error:", err);
    res.status(500).send("Failed to list files.");
  }
});

// ✅ Upload a file
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded.");
    const fileName = Date.now() + "-" + req.file.originalname;

    await minioClient.putObject(bucket, fileName, req.file.buffer, {
      "Content-Type": req.file.mimetype,
    });

    res.redirect("/");
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).send("Upload failed.");
  }
});

// ✅ Serve a file
app.get("/file/:name", async (req, res) => {
  try {
    const stream = await minioClient.getObject(bucket, req.params.name);
    stream.pipe(res);
  } catch (err) {
    console.error("Retrieve error:", err);
    res.status(404).send("File not found.");
  }
});

// ✅ Delete a file
app.get("/delete/:name", async (req, res) => {
  try {
    await minioClient.removeObject(bucket, req.params.name);
    res.redirect("/");
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).send("Delete failed.");
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost/publicIP of your ec2:3000");
});

