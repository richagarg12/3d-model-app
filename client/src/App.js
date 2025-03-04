// import React, { useState, useEffect } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, useGLTF } from '@react-three/drei';
// import { db } from './firebase'; // Ensure this points to your Firebase config
// import { collection, getDocs } from 'firebase/firestore'; // Corrected import
// import './App.css';

// function Model({ url }) {
//   const { scene } = useGLTF(url);
//   return <primitive object={scene} scale={1} />;
// }

// function App() {
//   const [models, setModels] = useState([]);
//   const [filteredModels, setFilteredModels] = useState([]);
//   const [search, setSearch] = useState('');
//   const [selectedModel, setSelectedModel] = useState(null);

//   useEffect(() => {
//     const fetchModels = async () => {
//       const querySnapshot = await getDocs(collection(db, 'models'));
//       const modelList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setModels(modelList);
//       setFilteredModels(modelList);
//       setSelectedModel(modelList[0]?.url); // Default to first model’s URL
//     };
//     fetchModels();
//   }, []);

//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearch(value);
//     const filtered = models.filter(model => 
//       model.name.toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredModels(filtered);
//     setSelectedModel(filtered[0]?.url || null);
//   };

//   return (
//     <div className="App">
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Search models by name..."
//           value={search}
//           onChange={handleSearch}
//         />
//       </div>
//       <div className="canvas-container">
//         {selectedModel ? (
//           <Canvas>
//             <ambientLight intensity={0.5} />
//             <directionalLight position={[10, 10, 5]} intensity={1} />
//             <Model url={selectedModel} />
//             <OrbitControls enableZoom={true} enablePan={true} />
//           </Canvas>
//         ) : (
//           <p>No model selected</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import './App.css';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1} />;
}

function App() {
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedModel, setSelectedModel] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', url: '', id: '' });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch models from Firebase
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'models'));
        const modelList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched models:', modelList);
        setModels(modelList);
        setFilteredModels(modelList);
        setSelectedModel(modelList[0]?.url); // Default to first model’s URL
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };
    fetchModels();
  }, []);

  // Filter models based on search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = models.filter(model => 
      model.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredModels(filtered);
    setSelectedModel(filtered[0]?.url || null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Create or Update model
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && formData.id) {
        // Update existing model
        await updateDoc(doc(db, 'models', formData.id), {
          name: formData.name,
          description: formData.description,
          url: formData.url,
        });
      } else {
        // Create new model
        await addDoc(collection(db, 'models'), {
          name: formData.name,
          description: formData.description,
          url: formData.url,
          uploadDate: new Date().toISOString(),
        });
      }
      // Refetch models after create/update
      const querySnapshot = await getDocs(collection(db, 'models'));
      const modelList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setModels(modelList);
      setFilteredModels(modelList);
      setSelectedModel(modelList[0]?.url);
      setFormData({ name: '', description: '', url: '', id: '' }); // Reset form
      setIsEditing(false);
    } catch (error) {
      console.error('Error creating/updating model:', error);
    }
  };

  // Edit model
  const handleEdit = (model) => {
    setFormData({
      name: model.name,
      description: model.description,
      url: model.url,
      id: model.id,
    });
    setIsEditing(true);
    setSelectedModel(model.url);
  };

  // Delete model
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'models', id));
      const querySnapshot = await getDocs(collection(db, 'models'));
      const modelList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setModels(modelList);
      setFilteredModels(modelList);
      setSelectedModel(modelList[0]?.url || null);
    } catch (error) {
      console.error('Error deleting model:', error);
    }
  };

  return (
    <div className="App">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search models by name..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Form for Create/Update */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Model Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <input
            type="url"
            name="url"
            placeholder="Model URL (GLB/GLTF)"
            value={formData.url}
            onChange={handleInputChange}
            required
          />
          <button type="submit">{isEditing ? 'Update Model' : 'Add Model'}</button>
          {isEditing && (
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          )}
        </form>
      </div>

      {/* List of Models */}
      <div className="models-list">
        {filteredModels.map(model => (
          <div key={model.id} className="model-item">
            <h3>{model.name}</h3>
            <p>{model.description}</p>
            <button onClick={() => handleEdit(model)}>Edit</button>
            <button onClick={() => handleDelete(model.id)}>Delete</button>
          </div>
        ))}
      </div>

      <div className="canvas-container">
        {selectedModel ? (
          <Canvas>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Model url={selectedModel} />
            <OrbitControls enableZoom={true} enablePan={true} />
          </Canvas>
        ) : (
          <p>No model selected</p>
        )}
      </div>
    </div>
  );
}

export default App;