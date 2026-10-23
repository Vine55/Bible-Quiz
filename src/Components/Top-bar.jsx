import './Top-bar.css'
import {BookOpenTextIcon} from 'lucide-react'

export default function Topbar() {
    return (
        <>
            <div className='top-bar'>
                <span className='title'><BookOpenTextIcon className='title-icon' size={15}/> Bible Quiz</span>
            </div>
        </>
    )
}