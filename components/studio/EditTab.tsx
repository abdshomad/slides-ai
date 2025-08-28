import React, { useState } from 'react';
import { Slide } from '../../types/index';
import { MagicIcon } from '../icons';

interface EditTabProps {
    slide: Slide;
    onEdit: (slideId: string, prompt: string) => void;
    onClose: () => void;
}

const EditTab: React.FC<EditTabProps> = ({ slide, onEdit, onClose }) => {
    const [editPrompt, setEditPrompt] = useState('');

    const handleEdit = () => {
        onEdit(slide.id, editPrompt);
        onClose();
    };

    if (!slide.image) {
        return <div className="text-center py-10"><p className="text-slate-500">No image to edit. Please generate one first.</p></div>;
    }

    return (
        <div>
            <h3 className="text-lg font-semibold mb-3">Magic Edit</h3>
            <div className="flex gap-4">
                <div className="w-1/3 flex-shrink-0">
                    <img src={`data:image/jpeg;base64,${slide.image}`} alt="Current" className="rounded-lg object-cover w-full h-auto" />
                </div>
                <div className="flex-grow">
                    <label htmlFor="edit-prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">How would you like to change it?</label>
                    <textarea id="edit-prompt" value={editPrompt} onChange={e => setEditPrompt(e.target.value)} placeholder="e.g., 'add a sun in the sky', 'make this black and white', 'remove the car'" className="w-full h-24 p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-pink-500" />
                    <button onClick={handleEdit} disabled={!editPrompt.trim()} className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-slate-500">
                        <MagicIcon className="w-5 h-5 mr-2" /> Apply Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTab;