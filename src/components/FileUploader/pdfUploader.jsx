import React, { useState } from 'react';
import axiosFetch from '../../axios/config';

const FileUploader = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUploadAluno = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'x-access-token': token,
      };

      const formData = new FormData();
      formData.append('pdf', file);

      const response = await axiosFetch.post('/aluno/upload/reading-pdf', formData, { headers });

      console.log(response.data);
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
    }
  };

  const handleUploadProfessor = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'x-access-token': token,
      };

      const formData = new FormData();
      formData.append('pdf', file);

      const response = await axiosFetch.post('/professor/upload/reading-pdf', formData, { headers });

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
          Arquivo selecionado aluno: {file.name}
          <button onClick={handleUploadAluno}>Enviar para o servidor</button>
        </div>
      )}

      {file && (
        <div>
          Arquivo selecionado professor: {file.name}
          <button onClick={handleUploadProfessor}>Enviar para o servidor</button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;