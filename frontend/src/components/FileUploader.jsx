import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

export default function FileUploader({ onFileSelect }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div
      className={`file-uploader ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      style={{
        border: '2px dashed var(--color-border, #ccc)',
        borderRadius: '8px',
        padding: '2rem',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: dragActive ? 'var(--color-bg-surface, #f0f0f0)' : 'transparent'
      }}
      onClick={onButtonClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <UploadCloud size={48} style={{ marginBottom: '1rem', color: 'var(--color-text-secondary, #666)' }} />
      <p>Drag & drop your resume here, or click to select</p>
      <small style={{ color: 'var(--color-text-secondary, #666)' }}>Supports PDF and DOCX</small>
    </div>
  );
}
