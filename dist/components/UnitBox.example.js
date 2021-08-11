import {useStateValue} from "../state/state.js";
import React from "../../snowpack/pkg/react.js";
export function UnitBox({field}) {
  const [{unitBoxes}, dispatch] = useStateValue();
  const style = {textAlign: "center", padding: "0.6rem", fontSize: "1rem"};
  const bigFontStyle = {...style, fontSize: "2rem"};
  return /* @__PURE__ */ React.createElement("div", {
    style
  }, /* @__PURE__ */ React.createElement("div", {
    style: bigFontStyle
  }, "value: ", unitBoxes[field].value), /* @__PURE__ */ React.createElement("div", {
    style
  }, "currUnit: ", unitBoxes[field].currUnit), /* @__PURE__ */ React.createElement("button", {
    style,
    onClick: () => dispatch({
      type: "setUnitBoxes",
      payload: {
        ...unitBoxes,
        [field]: {...unitBoxes[field], value: Math.floor(Math.random() * 1e3)}
      }
    })
  }, "randomize ", field, " unit box"));
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvcHJpY2UtY2FsY3VsYXRvci9wcmljZS1jYWxjdWxhdG9yL3NyYy9jb21wb25lbnRzL1VuaXRCb3guZXhhbXBsZS50c3giXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUNBO0FBYU8sd0JBQWlCLENBQUUsUUFBb0M7QUFDN0QsUUFBTSxDQUFDLENBQUUsWUFBYSxZQUFZO0FBRWxDLFFBQU0sUUFBdUIsQ0FBRSxXQUFXLFVBQVUsU0FBUyxVQUFVLFVBQVU7QUFDakYsUUFBTSxlQUE4QixJQUFLLE9BQU8sVUFBVTtBQUUxRCxTQUNDLG9DQUFDLE9BQUQ7QUFBQSxJQUFLO0FBQUEsS0FDSixvQ0FBQyxPQUFEO0FBQUEsSUFBSyxPQUFPO0FBQUEsS0FBYyxXQUFRLFVBQVUsT0FBTyxRQUNuRCxvQ0FBQyxPQUFEO0FBQUEsSUFBSztBQUFBLEtBQWMsY0FBVyxVQUFVLE9BQU8sV0FDL0Msb0NBQUMsVUFBRDtBQUFBLElBQ0M7QUFBQSxJQUNBLFNBQVMsTUFDUixTQUFTO0FBQUEsTUFDUixNQUFNO0FBQUEsTUFDTixTQUFTO0FBQUEsV0FDTDtBQUFBLFNBQ0YsUUFBUSxJQUFLLFVBQVUsUUFBUSxPQUFPLEtBQUssTUFBTSxLQUFLLFdBQVc7QUFBQTtBQUFBO0FBQUEsS0FJckUsY0FDVyxPQUFNO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
