
export default ({ outputText, linesChanged, showCursor }: { outputText: string, linesChanged: number, showCursor: boolean }) => {

    return (
        <div className='flex border-t border-t-slate-800 p-2 font-medium'>
            <span className='text-fuchsia-400'>~/git-streak-tracker</span>
            <span className='text-green-300 ml-2'>git:(</span>
            <span className='text-yellow-200'>main</span>
            <span className='text-green-300'>){linesChanged ? `±${linesChanged}` : null}</span>
            <span className='ml-2'>{outputText}</span>
            {
                showCursor ? <div className='whitespace-pre bg-cyan-400' style={{ width: 2 }}></div> : null
            }
        </div>
    )
}