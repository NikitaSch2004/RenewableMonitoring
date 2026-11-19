import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import {
    MessageCircle,
    XOctagon,
    User
} from 'lucide-react';

import { useTranslation } from "../../hooks/useTranslation";

export default function PlannedMaintenanceList({ maintenanceList, onDelete, loading, isAdmin }) {
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    console.log("PlannedMaintenanceList loaded with items:", maintenanceList);

    const t = useTranslation("plannedMaintenanceList"); // namespace

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

    // Форматируем facility_ids для отображения
    const formatFacilityIds = (facilityIds) => {
        if (Array.isArray(facilityIds)) {
            return facilityIds.map(id => id.trim()).join(', ');
        }
        return facilityIds;
    };

    if (loading) return <p className="p-4">{t("loading")}</p>;

    return (
        <div className="p-4 space-y-3">
            {maintenanceList.map((item) => (
                <div
                    key={item.id}
                    className="flex flex-col sm:flex-row bg-gray-100 rounded-xl p-3 shadow gap-3 sm:items-center"
                >
                    {/* Grid контейнер для элементов */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${isAdmin ? 'md:grid-cols-5' : 'md:grid-cols-4'} gap-2 flex-grow min-w-0`}>

                        {/* ID пользователя - только для админа */}
                        {isAdmin && (
                            <span className="bg-blue-100 px-3 py-2 rounded-lg font-semibold text-center text-sm md:text-base min-h-[2.5rem] flex items-center justify-center gap-1">
                                <User size={16} />
                                {t("userLabel")} {item.user_id}
                            </span>
                        )}

                        <span className="bg-gray-200 px-3 py-2 rounded-lg font-semibold text-center text-sm md:text-base min-h-[2.5rem] flex items-center justify-center">
                            {formatFacilityIds(item.facility_ids)}
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
                            title={t("viewComment")}
                        >
                            <MessageCircle size={20} />
                        </button>
                        <button
                            onClick={() => handleOpenDelete(item)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title={t("delete")}
                        >
                            <XOctagon size={20} />
                        </button>
                    </div>
                </div>
            ))}

            {/* Модалка комментария */}
            <Dialog open={commentModalOpen} onClose={() => setCommentModalOpen(false)}>
                <DialogTitle>{t("commentLabel")}</DialogTitle>
                <DialogContent>
                    <div className="space-y-2">
                        {/*                         {isAdmin && selectedItem?.user_id && (
                            <p className="text-sm text-gray-600">
                                <strong>User ID:</strong> {selectedItem.user_id}
                            </p>
                        )} */}
                        <p>{selectedItem?.comments}</p>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCommentModalOpen(false)}>{t("close")}</Button>
                </DialogActions>
            </Dialog>

            {/* Модалка удаления */}
            <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <DialogTitle>{t("confirmDeleting")}</DialogTitle>
                <DialogContent>
                    <div className="space-y-2">
{/*                         {isAdmin && selectedItem?.user_id && (
                            <p className="text-sm text-gray-600">
                                <strong>User ID:</strong> {selectedItem.user_id}
                            </p>
                        )} */}
                        <p>
                            {t("deleteDesc")}{' '}
                            <b>{formatFacilityIds(selectedItem?.facility_ids)}</b>?
                        </p>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteModalOpen(false)}>{t("cancel")}</Button>
                    <Button color="error" onClick={handleDeleteConfirm}>{t("delete")}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}