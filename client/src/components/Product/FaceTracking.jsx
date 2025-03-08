import React, { useRef, useEffect } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";

const FaceTracking = ({ glassesImage }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let camera = null;

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support the getUserMedia API");
      return;
    }

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (!canvasRef.current || !videoRef.current) return;
      const canvasCtx = canvasRef.current.getContext("2d");
      canvasCtx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      if (results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];

        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
        const nose = landmarks[168];

        const glassesWidth =
          Math.abs(rightEye.x - leftEye.x) * canvasRef.current.width * 2;
        const glassesX = nose.x * canvasRef.current.width - glassesWidth / 2;
        const glassesY =
          ((leftEye.y + rightEye.y) / 2) * canvasRef.current.height -
          glassesWidth / 4;

        const glassesImg = new Image();
        glassesImg.src = glassesImage;
        glassesImg.onload = () => {
          canvasCtx.drawImage(
            glassesImg,
            glassesX,
            glassesY,
            glassesWidth,
            glassesWidth / 2
          );
        };
      }
    });

    if (videoRef.current) {
      camera = new cam.Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera
        .start()
        .then(() => {
          console.log("Camera started");
        })
        .catch((error) => {
          console.error("Error starting camera:", error);
          alert("Error starting camera: " + error.message);
        });
    }
  }, [glassesImage]);

  return (
    <div style={{ position: "relative", width: "640px", height: "480px" }}>
      <video
        ref={videoRef}
        style={{ position: "absolute", width: "100%", height: "100%" }}
        autoPlay
        muted
      />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default FaceTracking;
