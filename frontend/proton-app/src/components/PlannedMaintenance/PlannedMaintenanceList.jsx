import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import {
    MessageCircle,
    XOctagon
} from 'lucide-react';

export default function PlannedMaintenanceList({maintenanceList, onDelete, loading}) {
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    console.log("PlannedMaintenanceList loaded with items:", maintenanceList);

    /*     const maintenanceList = [
            {
                id: 1,
                nlc: "NLC 25413, NLC 85697, NLC 12345",
                start: "Start: 18/07/2025 08:00",
                end: "End: 18/07/2025 12:00",
                progress: 45,
                comment: "Test comment for NLC 25413"
            },
            {
                id: 2,
                nlc: "NLC 85697",
                start: "Start: 21/07/2025 11:00",
                end: "End: 23/07/2025 18:00",
                progress: 100,
                comment: "Test comment for NLC 85697"
            }
        ]; */

    const handleOpenComment = (item) => {
        setSelectedItem(item);
        setCommentModalOpen(true);
    };

    const handleOpenDelete = (item) => {
        setSelectedItem(item);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        console.log(`Delete ID: ${selectedItem.id}`);
        onDelete(selectedItem.id);
        setDeleteModalOpen(false);
    };

    if (loading) return <p className="p-4">Loading...</p>;

    return (
        <div className="p-4 space-y-3">
            {maintenanceList.map((item) => (
                <div
                    key={item.id}
                    className="flex flex-col sm:flex-row bg-gray-100 rounded-xl p-3 shadow gap-3 sm:items-center"
                >
                    {/* Grid контейнер для элементов */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 flex-grow min-w-0">
                        <span className="bg-gray-200 px-3 py-2 rounded-lg font-semibold text-center text-sm md:text-base min-h-[2.5rem] flex items-center justify-center">
                            {item.facility_ids}
                        </span>
                        <span className="bg-gray-200 px-3 py-2 rounded-lg text-center text-sm md:text-base min-h-[2.5rem] flex items-center justify-center">
                            {item.start}
                        </span>
                        <span className="bg-gray-200 px-3 py-2 rounded-lg text-center text-sm md:text-base min-h-[2.5rem] flex items-center justify-center">
                            {item.end}
                        </span>
                        <span className="bg-gray-200 px-3 py-2 rounded-lg text-center text-sm md:text-base min-h-[2.5rem] flex items-center justify-center">
                            {item.exp_decrease}
                        </span>
                    </div>

                    {/* Кнопки действий */}
                    <div className="flex flex-row sm:flex-col justify-center md:flex-row gap-2 flex-shrink-0">
                        <button
                            onClick={() => handleOpenComment(item)}
                            className="text-yellow-600 hover:text-yellow-800 p-2 rounded-lg hover:bg-yellow-50 transition-colors"
                            title="Show comment"
                        >
                            <MessageCircle size={20} />
                        </button>
                        <button
                            onClick={() => handleOpenDelete(item)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                        >
                            <XOctagon size={20} />
                        </button>
                    </div>
                </div>
            ))}

            {/* Модалка комментария */}
            <Dialog open={commentModalOpen} onClose={() => setCommentModalOpen(false)}>
                <DialogTitle>Comment</DialogTitle>
                <DialogContent>
                    <p>{selectedItem?.comments}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCommentModalOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Модалка удаления */}
            <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <DialogTitle>Confirm deleting</DialogTitle>
                <DialogContent>
                    Are you sure that you want to delete <b>{selectedItem?.nlc}</b>?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                    <Button color="error" onClick={handleDeleteConfirm}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}