export default function Input({ label, type = 'text', register, error, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        {...register}
        {...props}
        className={`appearance-none block w-full px-3 py-2 border ${
          error ? 'border-red-300' : 'border-gray-300'
        } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF8551] focus:border-[#FF8551] sm:text-sm`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
} 