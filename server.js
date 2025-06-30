const express = require('express');
const mysql = require('mysql2'); // 注意：這裡用的是 mysql2 套件
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// 資料庫連線設定
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'emily882244', // ⬅️ 在這裡填入你的 MySQL 密碼（沒設密碼就留空字串 ''）
  database: 'beef_noodle'
});

// 建立連線
db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('MySQL connected.');
});

// 接收訂單的 API
app.post('/order', (req, res) => {
  const { items, total_price } = req.body;
  const query = 'INSERT INTO orders (items, total_price) VALUES (?, ?)';
  db.query(query, [JSON.stringify(items), total_price], (err, result) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).send('Database error');
    }
    res.send('Order saved!');
  });
});

// 顯示所有訂單的 API
app.get('/orders', (req, res) => {
  const query = 'SELECT * FROM orders ORDER BY id DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error fetching orders');
    }
    res.json(results);
  });
});


// 啟動伺服器
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
