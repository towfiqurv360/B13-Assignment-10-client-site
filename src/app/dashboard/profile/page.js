// src/app/dashboard/profile/page.js
"use client";
import { useEffect, useState } from "react";
import { axiosSecure } from "@/lib/axios";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosSecure.get("/users/profile");
      setUser(res.data);
      setName(res.data.name);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    const imageFormData = new FormData();
    imageFormData.append("image", file);
    
    const imgbbUrl = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`;
    
    const res = await fetch(imgbbUrl, { method: "POST", body: imageFormData });
    const data = await res.json();
    if(data.success) return data.data.display_url;
    throw new Error("Image upload failed");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      let updatedImageUrl = user.image;
      
      if (imageFile) {
        updatedImageUrl = await handleImageUpload(imageFile);
      }

      const res = await axiosSecure.patch("/users/profile", {
        name,
        image: updatedImageUrl,
      });

      if (res.status === 200) {
        toast.success("Profile updated successfully!");
        setUser(res.data.user);
        
        const localUser = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem("user", JSON.stringify({ ...localUser, name, image: updatedImageUrl }));
        
        window.location.reload(); 
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h2>
      
      <div className="flex items-center gap-6 mb-8 border-b pb-6">
        <img 
          src={user?.image || "https://via.placeholder.com/150"} 
          alt="Profile" 
          className="w-24 h-24 rounded-full object-cover border-4 border-orange-100"
        />
        <div>
          <h3 className="text-xl font-bold">{user?.name}</h3>
          <p className="text-gray-500">{user?.email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold uppercase">
            {user?.isPremium ? "Premium Member" : "Normal User"}
          </span>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Update Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded focus:ring-orange-500" 
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Update Profile Image</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full border p-2 rounded cursor-pointer" 
          />
          <p className="text-xs text-gray-500 mt-1">Leave empty if you don't want to change the image[cite: 1].</p>
        </div>

        <button 
          type="submit" 
          disabled={updating}
          className="w-full bg-orange-600 text-white font-bold py-3 rounded cursor-pointer hover:bg-orange-700 disabled:bg-orange-300"
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}