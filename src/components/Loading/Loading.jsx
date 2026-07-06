import './Loading.css';

export function NewsCardSkeleton() {
  return (
    <div className="card-skeleton">
      <div className="skeleton card-skeleton__image" />
      <div className="card-skeleton__body">
        <div className="skeleton card-skeleton__line" style={{ width: '40%' }} />
        <div className="skeleton card-skeleton__line" style={{ width: '90%', height: 18 }} />
        <div className="skeleton card-skeleton__line" style={{ width: '70%', height: 18 }} />
        <div className="skeleton card-skeleton__line" style={{ width: '100%' }} />
        <div className="skeleton card-skeleton__line" style={{ width: '60%' }} />
      </div>
    </div>
  );
}

export function NewsGridSkeleton({ count = 6 }) {
  return (
    <div className="grid-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function Spinner({ size = 32 }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner" style={{ width: size, height: size }} />
    </div>
  );
}

export default NewsGridSkeleton;
