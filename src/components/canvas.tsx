export const Canvas = ({canvasRef}:{canvasRef:React.RefObject<HTMLCanvasElement>}) => {
  return (
    <canvas
      className="canvas"
      ref={canvasRef}
      width="500px"
      height="500px"
    ></canvas>
  );
};
