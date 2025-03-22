import React from "react";
import "./Camera.css";
import { useZakeke } from "@zakeke/zakeke-configurator-react";

export interface CameraInterface {
  attributes: any[];
  attributesAlwaysOpened: boolean;
  cameraLocationId: string | null;
  direction: number;
  displayOrder: number;
  enabled: boolean;
  guid: string;
  icon?: any | null; // Assuming icon can be null or a string
  id: number;
  imageUrl?: string | null;
  name: string;
  steps: any[]; // You might want to specify a more specific type for steps
  templateGroups?: any | null;
}

export type CamerasProps = {
  cameras: CameraInterface[];
  onSelect: any;
  onCameraAngle: any;
  selectedCameraAngle: string | null;
};

const Cameras: React.FC<CamerasProps> = React.memo((props) => {
  const { setExplodedMode } = useZakeke();

  let cameraViews = props.cameras.filter((x) => {
    if (x.imageUrl != null) {
      return x;
    }
  });

  
  let selectedCameraAngle = props.selectedCameraAngle
  
  if (selectedCameraAngle === 'blazer') { selectedCameraAngle = "choose your lining style"};

  const idsToRemove = ["full view", "choose your lining style", "pant"];
  cameraViews = cameraViews.filter((obj) =>
    idsToRemove.includes(obj.name.toLowerCase())
  );


  return !!props.cameras.length ? (
    <div className="camera_root">
      {cameraViews.map((camera) => (
        <div
          onClick={() => {
            {
              camera.name.toLowerCase() === "pant"
                ? setExplodedMode(true)
                : setExplodedMode(false);
            }

            if (camera.name.toLowerCase() === "full view") {
              props.onSelect(camera.cameraLocationId);
              props.onCameraAngle("full view");
            }

            if (camera.name.toLowerCase() === "choose your lining style") {
              setExplodedMode(false);
              props.onSelect(camera.attributes[0].cameraLocationId);
              props.onCameraAngle("blazer");
            }

            if (camera.name.toLowerCase() === "pant") {
              setExplodedMode(true);
              props.onSelect(camera.steps[0].cameraLocationID);
              props.onCameraAngle("pant");
            }
          }}
          key={camera.id}
          className={`cameras_camera ${
            camera.name.toLowerCase() === selectedCameraAngle
              ? "selected_camera"
              : ""
          }`}
          style={{ filter: "grayscale(1)", cursor: "pointer" }}
        >
          <div className="camereImage">
            <img
              src={camera.imageUrl || `imgs/camera.png`}
              alt={"CAMERA_ALT"}
            />
          </div>
        </div>
      ))}
    </div>
  ) : null;
});

export default Cameras;
