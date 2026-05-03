import { useLoader, useThree, type ThreeEvent } from "@react-three/fiber";
import type { ThreeElements } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCursor, useTexture } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  Box3,
  MeshStandardMaterial,
  SRGBColorSpace,
  Vector3,
  DoubleSide,
} from "three";
import { assetUrl } from "../utils/assetUrl";

type PictureFrameProps = ThreeElements["group"] & {
  image: string;
  imageScale?: number | [number, number];
  imageOffset?: [number, number, number];
  onImageClick?: (imagePath: string) => void;
};

const DEFAULT_IMAGE_SCALE: [number, number] = [0.82, 0.82];

export function PictureFrame({
  image,
  imageScale = DEFAULT_IMAGE_SCALE,
  imageOffset,
  onImageClick,
  children,
  ...groupProps
}: PictureFrameProps) {
  const { gl } = useThree();
  const gltf = useLoader(GLTFLoader, assetUrl("/picture_frame.glb"));
  const pictureTexture = useTexture(image);
  const [isHovered, setIsHovered] = useState(false);

  useCursor(isHovered);

  pictureTexture.colorSpace = SRGBColorSpace;
  pictureTexture.anisotropy =
    typeof gl.capabilities.getMaxAnisotropy === "function"
      ? gl.capabilities.getMaxAnisotropy()
      : 1;

  const frameScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  const { frameSize, frameCenter } = useMemo(() => {
    const box = new Box3().setFromObject(frameScene);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    return { frameSize: size, frameCenter: center };
  }, [frameScene]);

  const scaledImage = useMemo<[number, number]>(() => {
    if (Array.isArray(imageScale)) {
      return imageScale;
    }
    return [imageScale, imageScale];
  }, [imageScale]);

  const [imageScaleX, imageScaleY] = scaledImage;

  const imageWidth = frameSize.x * imageScaleX;
  const imageHeight = frameSize.y * imageScaleY;

  const [offsetX, offsetY, offsetZ] = imageOffset ?? [
    0,
    0.05,
    -0.27,
  ];

  const imagePosition: [number, number, number] = [
    frameCenter.x + offsetX,
    frameCenter.y + offsetY,
    frameCenter.z + offsetZ,
  ];

  const pictureMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        map: pictureTexture,
        roughness: 0.08,
        metalness: 0,
        side: DoubleSide,
      }),
    [pictureTexture]
  );

  useEffect(() => {
    return () => {
      pictureMaterial.dispose();
    };
  }, [pictureMaterial]);

  const handlePointerOver = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsHovered(true);
  }, []);

  const handlePointerOut = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsHovered(false);
  }, []);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      onImageClick?.(image);
    },
    [image, onImageClick]
  );

  return (
    <group {...groupProps}>
      <group rotation={[0.04, 0, 0]}>
        <primitive object={frameScene} />
        <mesh
          position={imagePosition}
          rotation={[0.435, Math.PI, 0]}
          material={pictureMaterial}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        >
          <planeGeometry args={[imageWidth, imageHeight]} />
        </mesh>
        {children}
      </group>
    </group>
  );
}
