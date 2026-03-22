import { useState } from "react";
import "./spinner.css";

const options = ["Yes", "No"];

export default function Spinner() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);

    const numOptions = options.length;
    const sliceDeg = 360 / numOptions;
    const choiceIndex = Math.floor(Math.random() * numOptions);
    const sectionCenter = choiceIndex * sliceDeg + sliceDeg / 2;
    const wiggle = (Math.random() - 0.5) * (sliceDeg * 0.8);
    const landingPoint = sectionCenter + wiggle;
    const actualTargetDeg = 360 - landingPoint;
    const extraSpins = 5 * 360;
    const currentBase = Math.ceil(rotation / 360) * 360;
    const newRotation = currentBase + extraSpins + actualTargetDeg;

    setRotation(newRotation);

    setTimeout(() => {
      setResult(options[choiceIndex]);
      setSpinning(false);
    }, 3000);
  };
  return (
    <div className="spinner-wrap">
      <div
        className="wheel-gamble"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className="slice slice-a">Yes</div>
        <div className="slice slice-b">No</div>
      </div>

      <div className="pointer" />

      <button onClick={spin} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </button>

      {result && (
        <p className="result">
          Result: <strong>{result}</strong>
        </p>
      )}
    </div>
  );
}
