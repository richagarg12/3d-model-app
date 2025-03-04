import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { db } from './firebase'; // Ensure this points to your Firebase config
import { collection, getDocs } from 'firebase/firestore'; // Corrected import
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

  useEffect(() => {
    const fetchModels = async () => {
      const querySnapshot = await getDocs(collection(db, 'models'));
      const modelList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setModels(modelList);
      setFilteredModels(modelList);
      setSelectedModel(modelList[0]?.url); // Default to first model’s URL
    };
    fetchModels();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = models.filter(model => 
      model.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredModels(filtered);
    setSelectedModel(filtered[0]?.url || null);
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