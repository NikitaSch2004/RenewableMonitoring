import { useState } from "react";
import { Checkbox, ListItemText, TextField, MenuItem } from "@mui/material";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function PlannedMaintenance({ facilities }) {
    const [startDate, setStartDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [expectedDecrease, setExpectedDecrease] = useState("");
    const [nlc, setNlc] = useState([]);
    const [comment, setComment] = useState("");

    const handleCreate = () => {
        console.log({
            startDate,
            startTime,
            endDate,
            endTime,
            expectedDecrease,
            nlc,
            comment
        });
    };

    // Проверка для ограничения времени
    const sameDay = startDate && endDate && dayjs(startDate).isSame(endDate, "day");

    return (
        <div className="bg-gray-50 rounded-lg shadow max-w-lg w-full mx-auto p-6">
            <div className="bg-yellow-400 rounded-lg p-4 mb-6 flex items-center justify-between">
                <span className="text-white font-semibold text-lg">Create New Planned Maintenance</span>
                <span className="text-white text-2xl font-bold">+</span>
            </div>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="space-y-4">
                    {/* Maintenance Start */}
                    <div>
                        <p className="text-gray-700 mb-2 font-medium">Maintenance Start</p>
                        <div className="flex gap-4">
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                maxDate={endDate || null} // Не позже End Date
                                slotProps={{ textField: { fullWidth: true, size: "small" } }}
                            />
                            <TimePicker
                                label="Start Time"
                                value={startTime}
                                onChange={(newValue) => setStartTime(newValue)}
                                ampm={false}
                                maxTime={sameDay && endTime ? endTime : undefined} // Ограничение если даты совпадают
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
                                onChange={(newValue) => setEndDate(newValue)}
                                minDate={startDate || null} // Не раньше Start Date
                                slotProps={{ textField: { fullWidth: true, size: "small" } }}
                            />
                            <TimePicker
                                label="End Time"
                                value={endTime}
                                onChange={(newValue) => setEndTime(newValue)}
                                ampm={false}
                                minTime={sameDay && startTime ? startTime : undefined} // Ограничение если даты совпадают
                                slotProps={{ textField: { fullWidth: true, size: "small" } }}
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
                                let value = e.target.value.replace(/\D/g, ""); // убираем все не цифры
                                if (value > 100) value = 100;
                                setExpectedDecrease(value);
                            }}
                            fullWidth
                            size="small"
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
                            onChange={(e) => setNlc(e.target.value)}
                            fullWidth
                            size="small"
                            SelectProps={{
                                multiple: true,
                                renderValue: (selected) =>
                                    selected
                                        .map((id) => {
                                            const facility = facilities.find((f) => f.id === id);
                                            return facility ? facility.name : id;
                                        })
                                        .join(", ")
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
                        onClick={handleCreate}
                        className="w-full mt-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
                    >
                        Create
                    </button>
                </div>
            </LocalizationProvider>
        </div>
    );
}
