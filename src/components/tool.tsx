import { Button, IconButton, TextField } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Polynomial } from "../interfaces";
import { render } from "../render-lib/render-tool-canvas";
import { Canvas } from "./canvas";
import { InputPolyField } from "./input-poly-field";
import DeleteIcon from "@mui/icons-material/Delete";
import Add from "@mui/icons-material/Add";

const useAddRemovePolys = (
  polys: Polynomial[],
  setPolys: (newPolys: Polynomial[]) => void
) => {
  const addPoly = useCallback(() => {
    const newId = new Date().getTime() / 1000;
    setPolys([...polys, { id: newId, polyString: "", color: "#22aaff" }]);
  }, [polys]);

  const removePoly = useCallback(
    (polyId: number) => {
      setPolys(polys.filter((poly) => poly.id !== polyId));
    },
    [polys]
  );
  return [addPoly, removePoly] as const;
};

export const Tool = () => {
  const [polys, setPolys] = useState<Polynomial[]>([
    { id: 0, polyString: "x+x+x", color: "#ff00ff" },
    { id: 1, polyString: "0.5x^0.5+0.5x^0.5", color: "#ffaaff" },
    { id: 2, polyString: "51x^7+2x", color: "#aa99aa" },
    { id: 3, polyString: "0.5x^0+x^1+x^2+x^3+x^4", color: "#00ff00" },
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [addPoly, removePoly] = useAddRemovePolys(polys, setPolys);

  const updatePolyString = (id: number, newString: string) => {
    setPolys(
      polys.map((poly) =>
        poly.id === id ? { ...poly, polyString: newString } : poly
      )
    );
  };

  const updatePolyColor = (id: number, newColor: string) => {
    setPolys(
      polys.map((poly) =>
        poly.id === id ? { ...poly, color: newColor } : poly
      )
    );
  };

  const renderCanvas = useCallback(() => {
    if (canvasRef.current) {
      render(
        canvasRef.current,
        polys.filter((poly) => checkString(poly.polyString))
      );
    }
  }, [canvasRef, polys]);

  useEffect(() => {
    renderCanvas();

    window.addEventListener("resize", renderCanvas);
    return () => window.removeEventListener("resize", renderCanvas); // always clean up after putting an event listenner
  }, [renderCanvas]);

  return (
    <div className="main">
      <div className="input-bar">
        {polys.map((poly) => (
          <div key={poly.id} className="input-field">
            <InputPolyField
              polynomial={poly}
              updatePolyString={updatePolyString}
              updatePolyColor={updatePolyColor}
            />
            <span>
              <IconButton size="small" onClick={() => removePoly(poly.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </div>
        ))}
        <div className="add-button-div">
          <Button variant="contained" onClick={addPoly}>
            <Add />
          </Button>
        </div>
        <div style={{ margin: "1em" }}></div>
      </div>
      <div className="canvas-div">
        <Canvas canvasRef={canvasRef} />
      </div>
    </div>
  );
};

function checkString(evalString: string) {
  return /^(([0-9]|[1-9][0-9]*)(\.0*[1-9]+[0-9]*)?)?x(\^([0-9]|[1-9][0-9]*)(\.0*[1-9]+[0-9]*)?)?((\+|-)(([0-9]|[1-9][0-9]*)(\.0*[1-9]+[0-9]*)?)?x(\^([0-9]|[1-9][0-9]*)(\.0*[1-9]+[0-9]*)?)?)*$/g.test(
    evalString
  );
}
