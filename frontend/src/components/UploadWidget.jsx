import { useEffect, useRef } from 'react'; // Import useRef

export default function UploadWidget({ onUpload }) {
  // Create a ref to store the widget instance
  const widgetRef = useRef(null);
  const buttonRef = useRef(null); // Ref for the button itself

  useEffect(() => {
    // Only load the script and initialize the widget once
    if (window.cloudinary && typeof window.cloudinary.createUploadWidget === 'function') {
      // Widget already loaded, just initialize if not already done
      if (!widgetRef.current) {
        widgetRef.current = window.cloudinary.createUploadWidget(
          {
            cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD,
            uploadPreset: import.meta.env.VITE_CLOUDINARY_PRESET,
            // Optional: Add more options for a better user experience
            // sources: ['local', 'url', 'camera', 'unsplash'], // Allowed upload sources
            // cropping: true, // Enable image cropping
            // showSkipCropSelection: false, // Don't show skip crop button
            // defaultSource: 'local', // Default tab in the widget
            // clientAllowedFormats: ["png", "gif", "jpeg", "webp"], // Restrict file types
            // maxImageFileSize: 5000000, // 5MB max file size
            // folder: "blog_posts", // Specific folder in Cloudinary
            // tags: ["blog_upload", "post_image"] // Auto-apply tags
          },
          (err, info) => {
            if (!err && info.event === 'success') {
              onUpload(info.info.secure_url);
            }
            // You can also handle 'abort', 'close', 'failure' events
            if (err) {
              console.error("Cloudinary Upload Error:", err);
              // Optionally show an error message to the user
              alert("Image upload failed. Please try again.");
            }
          }
        );
      }
    } else {
      // If script not loaded, create and append it
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true; // Load script asynchronously
      script.onload = () => {
        // Once script is loaded, initialize the widget
        if (window.cloudinary && typeof window.cloudinary.createUploadWidget === 'function' && !widgetRef.current) {
          widgetRef.current = window.cloudinary.createUploadWidget(
            {
              cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD,
              uploadPreset: import.meta.env.VITE_CLOUDINARY_PRESET,
              // ... (add other widget options as above)
            },
            (err, info) => {
              if (!err && info.event === 'success') {
                onUpload(info.info.secure_url);
              }
              if (err) {
                console.error("Cloudinary Upload Error:", err);
                alert("Image upload failed. Please try again.");
              }
            }
          );
        }
      };
      // Append script to body
      document.body.appendChild(script);

      // Cleanup function
      return () => {
        // It's generally not recommended to remove the script once loaded
        // as it might be used by other parts of the application or if the component re-renders.
        // Instead, ensure the widget is only initialized once and its instance managed.
        // For production, consider loading the script outside of components, e.g., in index.html,
        // if multiple components might use Cloudinary.
      };
    }
  }, [onUpload]); // Depend on onUpload to ensure widget is configured correctly if it changes

  // Handler to open the widget when the button is clicked
  const handleUploadClick = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      console.warn("Cloudinary widget not yet initialized.");
      alert("Please wait a moment, the upload widget is still loading.");
    }
  };

  return (
    <button
      ref={buttonRef} // Attach ref to the button
      type="button" // <--- THIS IS THE FIX! Set type to "button"
      onClick={handleUploadClick} // Call the specific click handler
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Upload Image
    </button>
  );
}