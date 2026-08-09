export default function Auth() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-text-primary">Welcome to Dream Builder AI</h1>
          <p className="text-text-secondary mt-2">Sign in to your account</p>
        </div>
        {/* Auth form placeholder */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Email</label>
            <input type="email" className="w-full px-4 py-2 bg-background border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="name@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Password</label>
            <input type="password" className="w-full px-4 py-2 bg-background border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="••••••••" />
          </div>
          <button className="w-full py-2 px-4 bg-primary text-white font-medium rounded-xl hover:bg-opacity-90 transition-opacity">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
