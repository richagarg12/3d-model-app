// // const express = require('express');
// // const admin = require('firebase-admin');
// // const cors = require('cors');
// // const app = express();

// // app.use(cors());
// // app.use(express.json());

// // const serviceAccount = require('./service-account.json');
// // admin.initializeApp({
// //   credential: admin.credential.cert(serviceAccount),
// // });
// // const db = admin.firestore();

// // const PORT = process.env.PORT || 5000;

// // app.get('/models', async (req, res) => {
// //   try {
// //     const snapshot = await db.collection('models').get();
// //     const models = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// //     res.json(models);
// //   } catch (error) {
// //     res.status(500).json({ error: 'Failed to fetch models' });
// //   }
// // });

// // app.post('/upload', async (req, res) => {
// //   const { name, description, url } = req.body;
// //   if (!name || !url) {
// //     return res.status(400).json({ error: 'Name and URL are required' });
// //   }

// //   try {
// //     const modelData = {
// //       name,
// //       description: description || '',
// //       url,
// //       uploadDate: new Date().toISOString(),
// //     };
// //     const docRef = await db.collection('models').add(modelData);
// //     res.status(201).json({ id: docRef.id, ...modelData });
// //   } catch (error) {
// //     res.status(500).json({ error: 'Failed to upload model' });
// //   }
// // });

// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });    


// const express = require('express');
// const admin = require('firebase-admin');
// const cors = require('cors');
// const app = express();

// app.use(cors());
// app.use(express.json());

// // Initialize Firebase Admin SDK
// const serviceAccount = require('./service-account.json'); // Ensure this file exists
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// const db = admin.firestore();

// const PORT = process.env.PORT || 5000;

// // GET /models - Fetch all models
// app.get('/models', async (req, res) => {
//   try {
//     const snapshot = await db.collection('models').get();
//     const models = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     res.json(models);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch models' });
//   }
// });

// // POST /upload - Create a new model
// app.post('/upload', async (req, res) => {
//   const { name, description, url } = req.body;
//   if (!name || !url) {
//     return res.status(400).json({ error: 'Name and URL are required' });
//   }

//   try {
//     const modelData = {
//       name,
//       description: description || '',
//       url,
//       uploadDate: new Date().toISOString(),
//     };
//     const docRef = await db.collection('models').add(modelData);
//     res.status(201).json({ id: docRef.id, ...modelData });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to upload model' });
//   }
// });

// // PUT /models/:id - Update an existing model
// app.put('/models/:id', async (req, res) => {
//   const { id } = req.params;
//   const { name, description, url } = req.body;

//   try {
//     const modelRef = db.collection('models').doc(id);
//     const doc = await modelRef.get();
//     if (!doc.exists) {
//       return res.status(404).json({ error: 'Model not found' });
//     }

//     await modelRef.update({
//       name: name || doc.data().name,
//       description: description || doc.data().description,
//       url: url || doc.data().url,
//       uploadDate: doc.data().uploadDate, // Keep the original upload date
//     });
//     res.json({ id, ...req.body });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update model' });
//   }
// });

// // DELETE /models/:id - Delete a model
// app.delete('/models/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const modelRef = db.collection('models').doc(id);
//     const doc = await modelRef.get();
//     if (!doc.exists) {
//       return res.status(404).json({ error: 'Model not found' });
//     }

//     await modelRef.delete();
//     res.status(204).send(); // No content response for successful deletion
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to delete model' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'https://your-vercel-frontend-url.vercel.app' })); // Replace with your Vercel URL
app.use(express.json());

// Initialize Firebase Admin SDK with environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Use Render's provided port or default to 5000 locally
const PORT = process.env.PORT || 5000;

// GET /models - Fetch all models
app.get('/models', async (req, res) => {
  try {
    const snapshot = await db.collection('models').get();
    const models = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

// POST /upload - Create a new model
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

// PUT /models/:id - Update an existing model
app.put('/models/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, url } = req.body;

  try {
    const modelRef = db.collection('models').doc(id);
    const doc = await modelRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Model not found' });
    }

    await modelRef.update({
      name: name || doc.data().name,
      description: description || doc.data().description,
      url: url || doc.data().url,
      uploadDate: doc.data().uploadDate,
    });
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update model' });
  }
});

// DELETE /models/:id - Delete a model
app.delete('/models/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const modelRef = db.collection('models').doc(id);
    const doc = await modelRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Model not found' });
    }

    await modelRef.delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete model' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});