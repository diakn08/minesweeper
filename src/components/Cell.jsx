export default function Cell({cell,onClick,onRightClick}){

  let content = ""

  if(cell.isFlagged) content="🚩"
  if(cell.isRevealed && cell.isMine) content="💣"
  if(cell.isRevealed && cell.neighborMines>0)
    content=cell.neighborMines

  return(

    <div
      className={`cell ${cell.isRevealed?"revealed":""}`}
      onClick={onClick}
      onContextMenu={onRightClick}
    >

      {content}

    </div>

  )

}