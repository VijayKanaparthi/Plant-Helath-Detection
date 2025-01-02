import * as tf from "@tensorflow/tfjs"
import { useState } from "react"

import "./PlantDetector.css"

const PlantDetector = () => {
  const [result, setResult] = useState("")
  const [image, setImage] = useState(null)
  const [tips, setTips] = useState(null)

  const detectPlantHealth = async () => {
    const model = await tf.loadLayersModel("/plant-model/model.json")
    const img = document.getElementById("uploaded-image")
    if (!img) {
      alert("Please Provide Valid File")
    } else {
      const tensor = tf.browser
        .fromPixels(img)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(255)
        .expandDims()

      const predictions = await model.predict(tensor).data()
      const classes = ["Healthy", "Unhealthy", "Pest-Affected"]

      const maxIndex = predictions.indexOf(Math.max(...predictions))
      const healthStatus = classes[maxIndex]
      setResult(healthStatus)
      fetchTips(healthStatus)
    }
  }

  const fetchTips = async (healthStatus) => {
    try {
      const response = await fetch("/care-tips.json")
      const data = await response.json()
      const healthTips = data[healthStatus]
      if (healthTips) {
        setTips(healthTips)
        console.log(tips)
      } else {
        setTips([])
      }
    } catch (error) {
      console.log("Error While Fetching tips: ", error.message)
      setTips([])
    }
  }

  return (
    <>
      <div className="plant-detector-container">
        <div className="heading-container">
          <h2 className="heading">Plant Health Detection</h2>
        </div>

        {image !== null ? (
          <div className="plant-image-container">
            <img
              id="uploaded-image"
              src={image}
              alt="plant"
              className="plat-image"
            />
          </div>
        ) : (
          <div className="plant-image-container">
            <img
              src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_23-2148310293.jpg?uid=R176173293&ga=GA1.1.1961507238.1728465887"
              alt="Upload_Image"
              className="plat-image"
            />
          </div>
        )}
        <div className="input-container">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0]
              if (file) {
                setImage(URL.createObjectURL(file))
              }
            }}
          />
        </div>

        <button onClick={detectPlantHealth} className="check-button">
          Check Plant Helath
        </button>
        {result === "Healthy" ? (
          <div className="result-container-healthy">
            <p> {result}</p>
          </div>
        ) : (
          ""
        )}
        {result === "Unhealthy" ? (
          <div className="result-container-unhealthy">
            <p> {result}</p>
          </div>
        ) : (
          ""
        )}
        {result === "Pest-Affected" ? (
          <div className="result-container-Pest-Affected">
            <p> {result}</p>
          </div>
        ) : (
          ""
        )}
        {tips && tips.tips.length > 0 ? (
          <div className="tips-card">
            <h2 className="title">{tips.title}</h2>
            <ul>
              {tips.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : (
          result && <p>No tips available for this plant health status.</p>
        )}
      </div>
      <footer className="footer-background">
        <p>
          <strong>Plant Health Detection App</strong> - Helping you take care of
          your plants!
        </p>
        <p>
          For more tips and guides, visit{" "}
          <a
            href="https://www.gardeningknowhow.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#007BFF", textDecoration: "none" }}
          >
            Gardening Know How
          </a>
          .
        </p>
        <p>&copy; {new Date().getFullYear()} Plant Health Detection Project</p>
      </footer>
    </>
  )
}
export default PlantDetector
