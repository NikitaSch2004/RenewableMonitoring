import { useState } from "react";
import { Checkbox, ListItemText, TextField, MenuItem, Alert } from "@mui/material";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function PlannedMaintenance({ facilities, onCreate }) {
    const [startDate, setStartDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [expectedDecrease, setExpectedDecrease] = useState("");
    const [nlc, setNlc] = useState([]);
    const [comment, setComment] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const validateForm = () => {
        const newErrors = {};

        if (!startDate) {
            newErrors.startDate = "Start date is required";
        }

        if (!endDate) {
            newErrors.endDate = "End date is required";
        }

        if (!expectedDecrease) {
            newErrors.expectedDecrease = "Expected decrease is required";
        }

        if (nlc.length === 0) {
            newErrors.nlc = "At least one NLC must be selected";
        }

        // Проверка что дата окончания не раньше даты начала
        if (startDate && endDate && dayjs(endDate).isBefore(startDate, "day")) {
            newErrors.endDate = "End date cannot be before start date";
        }

        // Проверка времени для одного дня
        const sameDay = startDate && endDate && dayjs(startDate).isSame(endDate, "day");
        if (sameDay && startTime && endTime && dayjs(endTime).isBefore(startTime)) {
            newErrors.endTime = "End time cannot be before start time";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        // Сбросить предыдущие ошибки
        setSubmitError("");
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const formattedStartDate = startDate.format("YYYY-MM-DD");
            const formattedEndDate = endDate.format("YYYY-MM-DD");
            const formattedStartTime = startTime ? startTime.format("HH:mm") : "00:00";
            const formattedEndTime = endTime ? endTime.format("HH:mm") : "23:59";

            await onCreate({
                startDate: formattedStartDate,
                startTime: formattedStartTime,
                endDate: formattedEndDate,
                endTime: formattedEndTime,
                expectedDecrease,
                nlc,
                comment: comment.trim() || "Empty",
            });

            // Очищаем форму при успешном создании
            setStartDate(null);
            setStartTime(null);
            setEndDate(null);
            setEndTime(null);
            setExpectedDecrease("");
            setNlc([]);
            setComment("");
            setErrors({});
        } catch (error) {
            // Обработка ошибок от бэкенда
            const errorMessage = error.response?.data?.message || error.message || "Failed to create maintenance";
            setSubmitError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Проверка для ограничения времени
    const sameDay = startDate && endDate && dayjs(startDate).isSame(endDate, "day");

    return (
        <div className="bg-gray-50 rounded-lg shadow max-w-lg w-full mx-auto p-6">
            <div className="bg-yellow-400 rounded-lg p-4 mb-6 flex items-center justify-between">
                <span className="text-white font-semibold text-lg">Create New Planned Maintenance</span>
                <span className="text-white text-2xl font-bold">+</span>
            </div>

            {/* Ошибка от бэкенда */}
            {submitError && (
                <Alert severity="error" className="mb-4">
                    {submitError}
                </Alert>
            )}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="space-y-4">
                    {/* Maintenance Start */}
                    <div>
                        <p className="text-gray-700 mb-2 font-medium">Maintenance Start</p>
                        <div className="flex gap-4">
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => {
                                    setStartDate(newValue);
                                    if (errors.startDate) {
                                        setErrors(prev => ({ ...prev, startDate: null }));
                                    }
                                }}
                                maxDate={endDate || null}
                                slotProps={{ 
                                    textField: { 
                                        fullWidth: true, 
                                        size: "small",
                                        error: !!errors.startDate,
                                        helperText: errors.startDate
                                    } 
                                }}
                            />
                            <TimePicker
                                label="Start Time"
                                value={startTime}
                                onChange={(newValue) => setStartTime(newValue)}
                                ampm={false}
                                maxTime={sameDay && endTime ? endTime : undefined}
                                slotProps={{ textField: { fullWidth: true, size: "small" } }}
                            />
                        </div>
                    </div>

                    {/* Maintenance End */}
                    <div>
                        <p className="text-gray-700 mb-2 font-medium">Maintenance End</p>
                        <div className="flex gap-4">
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => {
                                    setEndDate(newValue);
                                    if (errors.endDate) {
                                        setErrors(prev => ({ ...prev, endDate: null }));
                                    }
                                }}
                                minDate={startDate || null}
                                slotProps={{ 
                                    textField: { 
                                        fullWidth: true, 
                                        size: "small",
                                        error: !!errors.endDate,
                                        helperText: errors.endDate
                                    } 
                                }}
                            />
                            <TimePicker
                                label="End Time"
                                value={endTime}
                                onChange={(newValue) => {
                                    setEndTime(newValue);
                                    if (errors.endTime) {
                                        setErrors(prev => ({ ...prev, endTime: null }));
                                    }
                                }}
                                ampm={false}
                                minTime={sameDay && startTime ? startTime : undefined}
                                slotProps={{ 
                                    textField: { 
                                        fullWidth: true, 
                                        size: "small",
                                        error: !!errors.endTime,
                                        helperText: errors.endTime
                                    } 
                                }}
                            />
                        </div>
                    </div>

                    {/* Expected Decrease & NLC */}
                    <p className="text-gray-700 mb-2 font-medium">Info</p>
                    <div className="flex gap-4">
                        <TextField
                            label="Decrease"
                            placeholder="Ex: 50"
                            value={expectedDecrease}
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "");
                                if (value > 100) value = 100;
                                setExpectedDecrease(value);
                                if (errors.expectedDecrease) {
                                    setErrors(prev => ({ ...prev, expectedDecrease: null }));
                                }
                            }}
                            fullWidth
                            size="small"
                            error={!!errors.expectedDecrease}
                            helperText={errors.expectedDecrease}
                            slotProps={{
                                input: {
                                    endAdornment: <span style={{ marginLeft: 4 }}>%</span>
                                }
                            }}
                        />

                        <TextField
                            select
                            label="NLC"
                            value={nlc}
                            onChange={(e) => {
                                setNlc(e.target.value);
                                if (errors.nlc) {
                                    setErrors(prev => ({ ...prev, nlc: null }));
                                }
                            }}
                            fullWidth
                            size="small"
                            error={!!errors.nlc}
                            helperText={errors.nlc}
                            slotProps={{
                                select: {
                                    multiple: true,
                                    renderValue: (selected) =>
                                        selected
                                            .map((id) => {
                                                const facility = facilities.find((f) => f.id === id);
                                                return facility ? facility.name : id;
                                            })
                                            .join(", ")
                                }
                            }}
                        >
                            {facilities.map((facility) => (
                                <MenuItem key={facility.id} value={facility.id}>
                                    <Checkbox checked={nlc.indexOf(facility.id) > -1} />
                                    <ListItemText primary={`${facility.name}`} />
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                    {/* Comment */}
                    <TextField
                        label="Add a comment"
                        placeholder="Add a comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                    />

                    {/* Create Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full mt-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
                    >
                        {isSubmitting ? "Creating..." : "Create"}
                    </button>
                </div>
            </LocalizationProvider>
        </div>
    );
}