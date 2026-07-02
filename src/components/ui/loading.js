import {ProgressCircle} from "@heroui/react";

export default function AppLoading() {
  return (
    <ProgressCircle isIndeterminate aria-label="Loading" className="w-10 h-10" style={{ width: "40px", height: "40px" }}>
      <ProgressCircle.Track>
        <ProgressCircle.TrackCircle />
        <ProgressCircle.FillCircle />
      </ProgressCircle.Track>
    </ProgressCircle>
  );
}