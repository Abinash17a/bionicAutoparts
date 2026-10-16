export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f0f4f8]">
      <div className="w-14 h-14 border-4 border-[#1D4E89]/20 border-t-[#1D4E89] rounded-full animate-spin mb-4" />
      <p className="text-[#333] text-lg font-medium">Loading, please wait...</p>
    </div>
  );
}
