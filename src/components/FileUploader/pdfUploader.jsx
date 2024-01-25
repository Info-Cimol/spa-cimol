import React, { useState } from 'react';
import axios from 'axios';

const FileUploader = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
const token = localStorage.getItem('token');
const headers = {
    'x-access-token': token,
  };
  const handleUpload = async () => {
    try {
    
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await axios.post('http://localhost:5000/upload', formData, {headers});

      console.log(response.data);
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleFileChange(e)} />
      {file && (
        <div>
          Arquivo selecionado: {file.name}
          <button onClick={handleUpload}>Enviar para o servidor</button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;