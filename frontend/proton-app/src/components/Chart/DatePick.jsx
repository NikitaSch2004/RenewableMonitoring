import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useTranslation } from '../../hooks/useTranslation';

export default function DatePick({ value, onChange, mode, disabled }) {

  const t = useTranslation("chart"); // namespace

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {mode === "day" && (
        <DatePicker
          label= {t("selectDay")}
          value={value}
          onChange={onChange}
          disabled={disabled}
          views={["year", "month", "day"]}
        />
      )}
      {mode === "month" && (
        <DatePicker
          label= {t("selectMonth")}
          value={value}
          onChange={onChange}
          disabled={disabled}
          views={["year", "month"]}
        />
      )}
      {mode === "year" && (
        <DatePicker
          label= {t("selectYear")}
          value={value}
          onChange={onChange}
          disabled={disabled}
          views={["year"]}
        />
      )}
    </LocalizationProvider>
  );
}