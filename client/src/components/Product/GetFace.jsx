import React, { useEffect, useRef } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const glassesRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    // renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Load 3D glasses model from public folder
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/"); // Path to Draco decoder
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/scene.gltf", // Path to the GLTF file in the public folder
      (gltf) => {
        const glasses = gltf.scene;
        glasses.scale.set(0.1, 0.1, 0.1); // Adjust scale as needed

        // Apply initial rotation to fix orientation
        glasses.rotation.set(0, Math.PI, 0); // Rotate 180 degrees around the Y-axis

        scene.add(glasses);
        glassesRef.current = glasses;
      },
      undefined,
      (error) => {
        console.error("Error loading GLTF model:", error);
      }
    );

    // Position the camera
    camera.position.z = 5;

    // Initialize FaceLandmarker
    const initializeFaceLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        }
      );
    };

    initializeFaceLandmarker();

    // Access the webcam
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", predictWebcam);
        })
        .catch((err) => {
          console.error("Error accessing the webcam: ", err);
        });
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
    // Cleanup
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  const predictWebcam = () => {
    const video = videoRef.current;
    const nowInMs = Date.now();
    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      const results = faceLandmarkerRef.current.detectForVideo(video, nowInMs);
      if (results.faceLandmarks && glassesRef.current) {
        const landmarks = results.faceLandmarks[0]; // Use the first detected face
        updateGlassesPosition(glassesRef.current, landmarks);
      }
    }

    requestAnimationFrame(predictWebcam);
  };

  const updateGlassesPosition = (glasses, landmarks) => {
    if (!landmarks) return;
    // Get the nose bridge landmark (landmark index 168)
    //   const noseBridge = landmarks[168];
    //   // Get the left and right ear landmarks (indices 127 and 356)
    //   const leftEar = landmarks[127];
    //   const rightEar = landmarks[356];

    //   let midX = (landmarks[33].x + landmarks[263].x) / 2;
    //   let midY = (landmarks[33].y + landmarks[263].y) / 2;

    //   // let eyeDistance = Math.sqrt(
    //   //   Math.pow(landmarks[263].x - landmarks[33].x, 2) +
    //   //     Math.pow(landmarks[263].y - landmarks[33].y, 2)
    //   // );
    //   const eyeDistance = Math.sqrt(
    //     Math.pow(rightEar.x - leftEar.x, 2) + Math.pow(rightEar.y - leftEar.y, 2)
    //   );

    //   glasses.position.x = midX; // علشان المنتصف يكون في مكان العين
    //   glasses.position.y = -midY + 1; // الY مقلوب في Three.js
    //   glasses.scale.set(eyeDistance * 2, eyeDistance * 2, eyeDistance * 2);

    //   let eyeDistance = Math.sqrt(
    //     Math.pow(landmarks[263].x - landmarks[33].x, 2) +
    //     Math.pow(landmarks[263].y - landmarks[33].y, 2)
    // );
    // let glassesScale = eyeDistance * 1.5;

    //   // // Calculate the center of the glasses
    //   // const centerX = (leftEar.x + rightEar.x) / 2;
    //   // const centerY = (leftEar.y + rightEar.y) / 2;

    //   // // Position the glasses
    //   // glasses.position.set(centerX, centerY, 0);

    //   // // Scale the glasses based on the distance between the ears
    //   // const distance = Math.sqrt(
    //   //   Math.pow(rightEar.x - leftEar.x, 2) + Math.pow(rightEar.y - leftEar.y, 2)
    //   // );
    //   // glasses.scale.set(distance, distance, distance);

    //   let dx = landmarks[263].x - landmarks[33].x;
    //   let dy = landmarks[263].y - landmarks[33].y;

    //   let roll = Math.atan2(dy, dx) * (180 / Math.PI);

    //   if (glasses) {
    //     glasses.rotation.y = THREE.MathUtils.degToRad(roll);
    //   }

    if (!landmarks) return;
    let glassesX = (landmarks[33].x + landmarks[263].x) / 2 + 0.6; // تحريكها يمينًا قليلًا
    let glassesY = (landmarks[33].y + landmarks[263].y) / 2 - 0.035; // رفعها للأعلى قليلًا
    let glassesZ = (landmarks[168].z || 0) - 0.15; // تقديمها للأمام
    let eyeDistance = Math.sqrt(
      Math.pow(landmarks[263].x - landmarks[33].x, 2) +
        Math.pow(landmarks[263].y - landmarks[33].y, 2)
    );
    let glassesScale = eyeDistance * 2.2; // زيادة الحجم لتتناسب مع الوجه

    let dx = landmarks[263].x - landmarks[33].x;
    let dy = landmarks[263].y - landmarks[33].y;

    let roll = Math.atan2(dy, dx) * (180 / Math.PI);

    if (glasses) {
      glasses.position.set(glassesX - 0.5, -glassesY + 0.5, glassesZ);
      glasses.scale.set(glassesScale, glassesScale, glassesScale);
      if (glasses) {
        glasses.rotation.y = THREE.MathUtils.degToRad(roll);
      }
    }
  };

  let lastVideoTime = -1;

  return (
    <div className="App">
      <video
        style={{
          width: "640px",
          height: "480px",
        }}
        ref={videoRef}
        autoPlay
        playsInline
      ></video>
      <canvas
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "640px",
          height: "480px",
        }}
        ref={canvasRef}
        width="640"
        height="480"
      ></canvas>
    </div>
  );
}

export default App;
