export default function Button({ children, type = 'button', className = '', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-gradient-to-r from-[#FF8551] to-[#FFA46D] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8551] transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 