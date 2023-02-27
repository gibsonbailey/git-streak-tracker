export default ({
  outputText,
  linesChanged,
  showCursor,
}: {
  outputText: string
  linesChanged: number
  showCursor: boolean
}) => {
  return (
    <div className="flex border-t border-t-slate-800 p-2 font-medium text-xs sm:text-md 2xl:text-lg">
      <span className="text-fuchsia-400 shrink-0">~/git-streak-tracker</span>
      <span className="text-green-300 ml-2 shrink-0">git:(</span>
      <span className="text-yellow-200 shrink-0">main</span>
      <span className="text-green-300 shrink-0">
        ){linesChanged ? `±${linesChanged}` : null}
      </span>
      <span className="ml-2 truncate">{outputText}</span>
      {showCursor ? (
        <span
          className="whitespace-pre bg-cyan-400"
          style={{ width: 2 }}
        ></span>
      ) : null}
    </div>
  )
}
