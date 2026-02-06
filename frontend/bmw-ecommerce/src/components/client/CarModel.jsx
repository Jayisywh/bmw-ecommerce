import { useGLTF } from "@react-three/drei";

export default function CarModel(props) {
  const { scene } = useGLTF(
    "https://rjcboxyfdnxsxiawesuk.supabase.co/storage/v1/object/public/bmw-cars/bmw1-1-1.png"
  );
  return <primitive object={scene} {...props} />;
}
