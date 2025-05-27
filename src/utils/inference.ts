import { InferenceSession, Tensor, env, } from "onnxruntime-web"
import cv from "@techstark/opencv-js"

export interface modelPath {
  mainModelPath: string;
  nmsPath: string;
}

export interface config {
  inputShape: [number, number, number, number];
  topK: number;
  iouThreshold: number;
  scoreThreshold: number;
};

export interface modelSession{
  model: InferenceSession;
  nms: InferenceSession;
}

export interface sessionConfig extends modelSession, config{}

export async function loadModel(/*modelPath: modelPath,*/ config: config): Promise<any>{
  env.wasm.wasmPaths = './';
  env.logLevel = 'verbose'
  env.debug = true

  const model = await InferenceSession.create("/model/yolo11n.onnx");
  const nms = await InferenceSession.create("/model/yolo-decoder.onnx");
  
  const tensor = new Tensor(
    "float32",
    new Float32Array(config.inputShape.reduce((a, b) => a * b)),
    config.inputShape
  );
  const { output0 } = await model.run({ images: tensor });
  const { output_selected } = await nms.run({
    input: output0,
    topk: new Tensor("int32", new Int32Array([config.topK])),
    iou_threshold: new Tensor("float32", new Float32Array([config.iouThreshold])),
    score_threshold: new Tensor("float32", new Float32Array([config.scoreThreshold])),
  });

  output0.dispose();
  output_selected.dispose();

  return { model, nms };
};

export async function inference( input: HTMLImageElement, canvasRef: HTMLCanvasElement, config: sessionConfig ): Promise< cv.Mat>{
  const src = cv.imread(input);
  
  const [preprocessedSrc, xRatio, yRatio] = preprocess(src, config.inputShape[2], config.inputShape[3]);

  const inputTensor = new Tensor(
    "float32",
    preprocessedSrc.data32F,
    [1, 3, config.inputShape[3], config.inputShape[2]]
  );

  const { output0 } = await config.model.run({images: inputTensor});
  const { output_selected } = await config.nms.run({
    input: output0,
    topk: new Tensor("int32", new Int32Array([config.topK])),
    iou_threshold: new Tensor("float32", new Float32Array([config.iouThreshold])),
    score_threshold: new Tensor("float32", new Float32Array([config.scoreThreshold])),
  });
  output0.dispose();

  const results = [];
  for (let i = 0; i < output_selected.dims[1]; i++) {
    const startIndex = i * output_selected.dims[2];
    const endIndex = (i + 1) * output_selected.dims[2];
    const rawData = output_selected.data.slice(startIndex, endIndex) as Float32Array;

    const [xCenter, yCenter, width, height] = rawData.slice(0, 4);
    const scores = rawData.slice(4);
    const score = Math.max(...scores);
    const classIndex = scores.indexOf(score);

    let [x, y, w, h] = [
      (xCenter - 0.5 * width) * xRatio,
      (yCenter - 0.5 * height) * yRatio,
      width * xRatio,
      height * yRatio,
    ];

    results.push({
      bbox: [x, y, w, h] as [number, number, number, number],
      classIndex,
      score
    });

  }
  output_selected.dispose();

  let croppedImage = new cv.Mat();
  const canvas = canvasRef;
  if(!canvas) throw new Error("canvas doesn't existed");
  const canvasCtx = canvas.getContext('2d');
  if(!canvasCtx) throw new Error("canvas context doesn't existed");

  if (results && results.length > 0) {
    let [x, y, width, height] = results[0].bbox.map((b: any) => Number(Math.round(b)));

    let yCoordinateToleration = 10;
    if(y < yCoordinateToleration) y = 0;
    else y -= yCoordinateToleration;
        
    const scaledHeight = width
    let croppedHeight = height
    if(height >= scaledHeight) croppedHeight = scaledHeight
    
    let cropRect = new cv.Rect(x, y, width, croppedHeight)
    croppedImage = src.roi(cropRect)
  }

  src.delete()
  preprocessedSrc.delete();
  
  return croppedImage;
};

function preprocess(input: cv.Mat, modelWidth: number, modelHeight: number): [cv.Mat, number, number]{
  cv.cvtColor(input, input, cv.COLOR_RGBA2RGB);

  const [width, height] = resize(32, input.cols, input.rows);
  cv.resize(input, input, new cv.Size(width, height));

  const maxSize = Math.max(width, height);
  const xPad = maxSize - width;
  const yPad = maxSize - height;
  cv.copyMakeBorder(
    input,
    input,
    0,
    yPad,
    0,
    xPad,
    cv.BORDER_CONSTANT,
    new cv.Scalar(0, 0, 0)
  );

  const xRatio = input.cols / modelWidth;
  const yRatio = input.rows / modelHeight;

  const preProcessed = cv.blobFromImage(
    input,
    1 / 255.0,
    new cv.Size(modelWidth, modelHeight),
    new cv.Scalar(0, 0, 0),
    false,
    false
  );

  return [preProcessed, xRatio, yRatio];
};

function resize(stride: number, width: number, height: number): [number, number] {
  width =
    width % stride >= stride / 2
      ? (Math.floor(width / stride) + 1) * stride
      : Math.floor(width / stride) * stride;

  height =
    height % stride >= stride / 2
      ? (Math.floor(height / stride) + 1) * stride
      : Math.floor(height / stride) * stride;

  return [width, height];
};
