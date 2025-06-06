# ID Photo Maker

Merupakan sebuah aplikasi berbasis web yang dapat digunakan untuk membuat pas foto secara otomatis. ID Photo Maker memanfaatkan model object detection dan background removal untuk melakukan pemrosesan gambar. ID Photo Maker dibuat guna meningkatkan portabilitas aplikasi pembuatan pasfoto dan privasi pengguna dengan dukungan pemrosesan gambar sepenuhnya dilakukan di sisi klien.

## Fitur

- Client-side image processing
- Offline support (Progressive Web App)

## Teknologi

- [ONNX Runtime Web](https://onnxruntime.ai/docs/)
- [OpenCV.js](https://techstark.github.io/opencv-js/)
- [ReactJS](https://react.dev/)
- [Vite](https://vite.dev/)
- [Typescript](https://www.typescriptlang.org/)

## Model

- [YOLO11n](https://github.com/ultralytics/ultralytics) (Object detection)
- [ModNet](https://github.com/ZHKKKe/MODNet) (Background removal)

## Local Setup

### Requirement:

- node.js v22.15.10
- pnpm v10.4.1

### Clone project

```
git clone https://github.com/RizkiAlkarim/id-photo-maker.git
```

### Instal dependency

```
pnpm i
```

### Run locally

```
pnpm run dev
```

### Deployment

```
pnpm run build
```
