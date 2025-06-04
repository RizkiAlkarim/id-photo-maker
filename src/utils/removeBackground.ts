import { InferenceSession, Tensor, env } from "onnxruntime-web";
import cv from "@techstark/opencv-js";

export interface BgRemovalSession {
  session: InferenceSession;
  refSize: number;
}

export async function loadBgRemovalModel(refSize: number): Promise<BgRemovalSession> {
  env.wasm.wasmPaths = "./";
  const session = await InferenceSession.create("/model/modnet.onnx");

  return { session, refSize };
}

export async function runBackgroundRemoval(
  input: cv.Mat,
  bgRemoval: BgRemovalSession,
  bgColor: string,
  ratio: number
): Promise<HTMLCanvasElement> {
  try {
    const src = input
    if (src.empty()) throw new Error("Input image is empty");

    cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);

    const [rw, rh] = getScaleFactors(src.rows, src.cols, bgRemoval.refSize);
    const resized = new cv.Mat();
    cv.resize(src, resized, new cv.Size(rw, rh), 0, 0, cv.INTER_AREA);
    resized.convertTo(resized, cv.CV_32FC3, 1 / 127.5, -1.0);

    const chw = new cv.MatVector();
    cv.split(resized, chw);
    const inputData = new Float32Array(1 * 3 * rh * rw);
    for (let i = 0; i < 3; i++){
      inputData.set(chw.get(i).data32F, i * rw * rh);
      chw.get(i).delete()
    }
    chw.delete();

    const inputTensor = new Tensor("float32", inputData, [1, 3, rh, rw]);
    const output = await bgRemoval.session.run({ [bgRemoval.session.inputNames[0]]: inputTensor });
    inputTensor.dispose()
    const result = output[bgRemoval.session.outputNames[0]]
    const matteData = result.data as Float32Array;
    result.dispose()

    const matte = new cv.Mat(rh, rw, cv.CV_32FC1);
    matte.data32F.set(matteData);

    const finalMatte = new cv.Mat();
    cv.resize(matte, finalMatte, new cv.Size(src.cols, src.rows), 0, 0, cv.INTER_AREA);
    matte.delete();

    const rgba = new cv.Mat();
    cv.cvtColor(src, rgba, cv.COLOR_RGB2RGBA);

    const channels = new cv.MatVector();
    cv.split(rgba, channels);
    const alpha = new cv.Mat();
    finalMatte.convertTo(alpha, cv.CV_8UC1, 255.0);
    channels.set(3, alpha);

    const outputMat = new cv.Mat();
    cv.merge(channels, outputMat);

    const subjectCanvas = document.createElement("canvas");
    subjectCanvas.width = outputMat.cols;
    subjectCanvas.height = outputMat.rows;
    cv.imshow(subjectCanvas, outputMat);

    const [aspectW, aspectH] = parseRatio(ratio);
    const finalHeight = 800;
    const finalWidth = Math.floor((finalHeight * aspectW) / aspectH);

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = finalWidth;
    finalCanvas.height = finalHeight;

    const ctx = finalCanvas.getContext("2d");
    if (!ctx) throw new Error("Cannot get canvas context");

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, finalWidth, finalHeight);

    const scaleFactor = finalWidth / subjectCanvas.width;
    const scaledWidth = finalWidth;
    const scaledHeight = subjectCanvas.height * scaleFactor;

    const x = 0;
    const y = finalHeight - scaledHeight;

    ctx.drawImage(subjectCanvas, x, y, scaledWidth, scaledHeight);

    src.delete();
    resized.delete();
    finalMatte.delete();
    rgba.delete();
    channels.delete();
    alpha.delete();
    outputMat.delete();
    subjectCanvas.remove()

    return finalCanvas;
  } catch (error) {
    console.error("Background removal processing failed", error);
    throw error;
  }
}

function getScaleFactors(h: number, w: number, refSize: number): [number, number, number, number] {
  let rw = w,
    rh = h;

  if (Math.max(h, w) < refSize || Math.min(h, w) > refSize) {
    if (w >= h) {
      rh = refSize;
      rw = Math.floor((w / h) * refSize);
    } else {
      rw = refSize;
      rh = Math.floor((h / w) * refSize);
    }
  }

  rw = rw - (rw % 32);
  rh = rh - (rh % 32);

  const xScale = rw / w;
  const yScale = rh / h;

  return [rw, rh, xScale, yScale];
}

function parseRatio(ratio: number): [number, number] {
  const str = ratio.toString();
  if (str.length !== 2) return [1, 1];
  const w = parseInt(str[0]), h = parseInt(str[1]);
  return w > 0 && h > 0 ? [w, h] : [1, 1];
}