const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const serviceAccount = require('./service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const PORT = process.env.PORT || 5000;

app.get('/models', async (req, res) => {
  try {
    const snapshot = await db.collection('models').get();
    const models = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

app.post('/upload', async (req, res) => {
  const { name, description, url } = req.body;
  if (!name || !url) {
    return res.status(400).json({ error: 'Name and URL are required' });
  }

  try {
    const modelData = {
      name,
      description: description || '',
      url,
      uploadDate: new Date().toISOString(),
    };
    const docRef = await db.collection('models').add(modelData);
    res.status(201).json({ id: docRef.id, ...modelData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload model' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});    