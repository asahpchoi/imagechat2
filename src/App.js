import "./styles.css";
import { supabase } from "./lib/api";

import { useState } from "react";
import axios from "axios";
export default function App() {
  const [url, setUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [question, setQuestion] = useState("what is the image?");
  async function uploadFile(file) {
    const filename = file.name;
    const { data, error } = await supabase.storage
      .from("photos")
      .upload(filename, file, {
        upsert: true
      });

    const path = await supabase.storage.from("photos").getPublicUrl(data.path);
    setUrl(path.data.publicUrl);
    askQuestion(path.data.publicUrl);
  }

  async function askQuestion(publicUrl) {
    const result = await axios.get(
      `https://rdg34z-5000.csb.app/imageCheck?image_url=${publicUrl}&question=${question}`
    );
    setDesc(result.data);
  }

  async function onFileChange(event) {
    // Details of the uploaded file
    uploadFile(event.target.files[0]);
  }

  return (
    <div className="App">
      <input
        type="file"
        accept="image/*"
        capture="camera"
        onChange={onFileChange}
      />
      {url && (
        <>
          <img src={url} width="100vw" />
          <br />
          {desc && (
            <>
              <h2>Description</h2>
              <div>{desc}</div>
            </>
          )}
          Question:{" "}
          <input
            onChange={(event) => {
              setQuestion(event.target.value);
            }}
          />
          <button
            onClick={() => {
              setDesc("loading");
              askQuestion(url);
            }}
          >
            Ask Question of the image
          </button>
        </>
      )}
    </div>
  );
}
