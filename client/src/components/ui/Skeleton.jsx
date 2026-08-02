export default function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-border rounded-xl ${className}`}></div>
  );
}
