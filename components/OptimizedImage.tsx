import Image, { ImageProps } from 'next/image';

type Props = ImageProps & { priorityAboveFold?: boolean };
export default function OptimizedImage({ priorityAboveFold, sizes, ...props }: Props) {
  return <Image {...props} priority={priorityAboveFold} loading={priorityAboveFold ? 'eager' : 'lazy'} sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'} />;
}
