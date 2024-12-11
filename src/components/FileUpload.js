import React from "react";

const FileUpload = ({ onFileUpload }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          onFileUpload(jsonData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          alert("Error parsing JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="file-upload">
      <input type="file" accept=".json" onChange={handleFileChange} />
    </div>
  );
};

export default FileUpload;
