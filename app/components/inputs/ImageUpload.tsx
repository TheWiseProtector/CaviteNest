import { useState } from "react";
import Image from "next/image";

interface ImageUploadProps {
  onImageUpload: (newImages: string[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [imageSrc, setImageSrc] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  // Function to handle image file upload to Cloudinary
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "fsvzne6s"); // Use your Cloudinary preset
    formData.append("cloud_name", "dhmqsfi7g"); // Replace with your Cloudinary cloud name

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dhmqsfi7g/image/upload`, // Replace with your Cloudinary URL
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const data = await response.json();
      return data.secure_url; // Return the uploaded image URL
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };

  // Function to handle the image selection and upload
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUploading(true);

    const files = Array.from(event.target.files || []);
    const uploadedUrls: string[] = [];

    // Upload each selected file to Cloudinary
    for (const file of files) {
      const url = await uploadToCloudinary(file);
      if (url) {
        uploadedUrls.push(url);
      }
    }

    // Update local state and send URLs to the parent component
    setImageSrc((prev) => [...prev, ...uploadedUrls]);
    onImageUpload(uploadedUrls);

    setUploading(false);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />
      {uploading && <p>Uploading images...</p>}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {imageSrc.map((src, index) => (
          <div
            key={index}
            style={{ position: "relative", width: "150px", height: "150px" }}
          >
            <Image
              src={src}
              alt={`Preview ${index}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
