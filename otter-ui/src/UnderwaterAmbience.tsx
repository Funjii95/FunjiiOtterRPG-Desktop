export function UnderwaterAmbience(){
 return <div className="codex-underwater" aria-hidden="true"><div className="underwater-light"/><div className="underwater-ripples"/><div className="underwater-bubbles">{Array.from({length:9},(_,i)=><span key={i}/>)}</div></div>;
}
