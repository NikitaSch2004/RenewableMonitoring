import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function DatePick({ value, onChange, mode, disabled }) {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {mode === "day" && (
        <DatePicker
          label="Select day"
          value={value}
          onChange={onChange}
          disabled={disabled}
          views={["year", "month", "day"]}
        />
      )}
      {mode === "month" && (
        <DatePicker
          label="Select month"
          value={value}
          onChange={onChange}
          disabled={disabled}
          views={["year", "month"]}
        />
      )}
      {mode === "year" && (
        <DatePicker
          label="Select year"
          value={value}
          onChange={onChange}
          disabled={disabled}
          views={["year"]}
        />
      )}
    </LocalizationProvider>
  );
}